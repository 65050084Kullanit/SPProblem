const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


// เชื่อม PostgreSQL
// const pool = new Pool({
//   user: "postgres",
//   host: "223.204.93.67",
//   database: "postgres",
//   password: "Btisadmin",
//   port: 5432,
// });
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});


// Socket.IO events
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on("join_class", async ({ joinCode }) => {
        try {
        // 1. หา Class_ID
        const classRes = await pool.query(
            'SELECT * FROM "ClassRooms" WHERE "Join_Code"=$1',
            [joinCode]
        );

        if (classRes.rows.length === 0) {
            socket.emit("join_result", { success: false, message: "invalid room code" });
            return;
        }

        const classId = classRes.rows[0].Class_ID;

        // 2. หา ActivitiesRooms (เก็บไว้เฉยๆ)
        const activityRes = await pool.query(
            'SELECT * FROM "ActivitiesRooms" WHERE "Class_ID"=$1',
            [classId]
        );

        // เข้าห้องของ Socket.IO (optional)
        socket.join(`class_${classId}`);

        // ส่งกลับเฉพาะข้อมูลที่จำเป็น
        socket.emit("join_result", { 
            success: true, 
            classId, 
            activities: activityRes.rows // เก็บไว้ frontend ใช้หน้าต่อไป
        });

        } catch (err) {
        console.error(err);
        socket.emit("join_result", { success: false, message: err.message });
        }
    });

    // 1. เช็ก Student
    socket.on("check_student", async ({ studentNumber }) => {
        try {
        const res = await pool.query(
            'SELECT * FROM "Students" WHERE "Student_Number" = $1',
            [studentNumber]
        );

        if (res.rows.length > 0) {
            socket.emit("student_checked", { exists: true, student: res.rows[0] });
        } else {
            socket.emit("student_checked", { exists: false });
        }
        } catch (err) {
        console.error(err);
        socket.emit("student_checked", { exists: false, error: err.message });
        }
    });

    // // 2. สร้าง Student ใหม่
    // socket.on("create_student", async ({ studentNumber }) => {
    //     try {
    //     const res = await pool.query(
    //         'INSERT INTO "Students"("Student_Number") VALUES($1) RETURNING *',
    //         [studentNumber]
    //     );

    //     socket.emit("student_created", { student: res.rows[0] });
    //     } catch (err) {
    //     console.error(err);
    //     socket.emit("student_created", { error: err.message });
    //     }
    // });
    socket.on("create_student", async ({ studentNumber, stageName, maskId, costumeId, bodyId, accessoryId, classId }) => {
      try {
        
        // 1. ตรวจสอบ stageName
        const nameToInsert = stageName && stageName.trim() !== '' ? stageName.trim() : studentNumber;
        console.log("Inserting student with name:", nameToInsert);

        // 2. Insert student พร้อม Avatar_ID
        const insertResult = await pool.query(
          'INSERT INTO "Students" ("Student_Name", "Student_Number", "Avatar_ID", "Class_ID") VALUES ($1, $2, $3, $4) RETURNING *',
          [nameToInsert, studentNumber, avatarId, classId]
        );

        socket.emit("student_created", { student: insertResult.rows[0] });
        console.log("Inserted new student:", insertResult.rows[0].Student_ID);
      } catch (err) {
        console.error(err);
        socket.emit("student_created", { error: err.message });
      }
    }); 


});
// Simple REST endpoint for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

// GET /api/avatars/options → ดึง asset สำหรับหน้าเลือก
app.get("/api/avatars/options", async (req, res) => {
  try {
    const masks = await pool.query('SELECT "Mask_ID", "Mask_Image" FROM "AvatarMasks"');
    const costumes = await pool.query('SELECT "Costume_ID", "Costume_Image" FROM "AvatarCostumes"');
    const bodies = await pool.query('SELECT "Body_ID", "Body_Image" FROM "AvatarBodies"');
    const accessories = await pool.query('SELECT "Accessory_ID", "Accessory_Image" FROM "AvatarAccessories"');

    res.json({
      masks: masks.rows.map(r => ({ id: r.Mask_ID, path: r.Mask_Image })),
      bodies: bodies.rows.map(r => ({ id: r.Body_ID, path: r.Body_Image })),
      costumes: costumes.rows.map(r => ({ id: r.Costume_ID, path: r.Costume_Image })),
      accessories: accessories.rows.map(r => ({ id: r.Accessory_ID, path: r.Accessory_Image })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch avatar options" });
  }
});

// POST /api/avatars → สร้าง Avatar ใหม่
// app.post("/api/avatars", async (req, res) => {
//   const { studentNumber, classId, stageName, maskId, costumeId, accessoryId, bodyId } = req.body;

//   console.log("Payload received:", req.body);

//   try {
//     // 1. Insert avatar
//     const avatarResult = await pool.query(
//       'INSERT INTO "Avatars" ("Mask_ID", "Costume_ID", "Accessory_ID", "Body_ID") VALUES ($1, $2, $3, $4) RETURNING "Avatar_ID"',
//       [maskId, costumeId, accessoryId, bodyId]
//     );

//     const avatarId = avatarResult.rows[0].Avatar_ID;
//     console.log("Avatar insert result:", avatarResult.rows);

//     // 2. Check student
//     const studentResult = await pool.query(
//       'SELECT "Student_ID" FROM "Students" WHERE "Student_Number" = $1',
//       [studentNumber]
//     );

//     let studentId;

//     if (studentResult.rows.length === 0) {
//       // ตรวจสอบ stageName ให้ไม่เป็น null หรือ empty string
//       const nameToInsert = stageName && stageName.trim() !== '' ? stageName.trim() : studentNumber;
//       console.log("Inserting student with name:", nameToInsert);

//       // Insert student ใหม่
//       const insertResult = await pool.query(
//         'INSERT INTO "Students" ("Student_Name", "Student_Number", "Avatar_ID", "Class_ID") VALUES ($1, $2, $3, $4) RETURNING "Student_ID"',
//         [nameToInsert, studentNumber, avatarId, classId]
//       );

//       studentId = insertResult.rows[0].Student_ID;
//       console.log("Inserted new student:", studentId);
//     } else {
//       // Update student เดิม
//       studentId = studentResult.rows[0].Student_ID;
//       await pool.query(
//         'UPDATE "Students" SET "Avatar_ID" = $1 WHERE "Student_ID" = $2',
//         [avatarId, studentId]
//       );
//       console.log("Updated existing student:", studentId);
//     }

//     // ส่ง avatarId กลับ frontend
//     res.json({ avatarId });
//   } catch (err) {
//     console.error("Real server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
//--------------------------------------------------------------------------------------------------------
// app.post("/api/avatars", async (req, res) => {
//   const { studentNumber, classId, stageName, maskId, costumeId, accessoryId, bodyId } = req.body;

//   console.log("Payload received:", req.body);

//   try {
//     // 1. เช็กก่อนว่า Avatar แบบนี้เคยมีหรือยัง
//     const existingAvatar = await pool.query(
//       `SELECT "Avatar_ID" FROM "Avatars"
//        WHERE "Mask_ID" = $1 AND "Costume_ID" = $2
//        AND "Accessory_ID" = $3 AND "Body_ID" = $4`,
//       [maskId, costumeId, accessoryId, bodyId]
//     );

//     let avatarId;

//     if (existingAvatar.rows.length > 0) {
//       // 👉 มีแล้วใช้ของเก่า
//       avatarId = existingAvatar.rows[0].Avatar_ID;
//       console.log("Found existing avatar:", avatarId);
//     } else {
//       // 👉 ไม่มี → สร้างใหม่
//       const avatarResult = await pool.query(
//         `INSERT INTO "Avatars" 
//          ("Mask_ID", "Costume_ID", "Accessory_ID", "Body_ID")
//          VALUES ($1, $2, $3, $4)
//          RETURNING "Avatar_ID"`,
//         [maskId, costumeId, accessoryId, bodyId]
//       );
//       avatarId = avatarResult.rows[0].Avatar_ID;
//       console.log("Created new avatar:", avatarId);
//     }

//     // 2. เช็ก student
//     const studentResult = await pool.query(
//       'SELECT "Student_ID" FROM "Students" WHERE "Student_Number" = $1',
//       [studentNumber]
//     );

//     let studentId;

//     if (studentResult.rows.length === 0) {
//       const nameToInsert =
//         stageName && stageName.trim() !== "" ? stageName.trim() : studentNumber;

//       console.log("Inserting student with name:", nameToInsert);

//       const insertResult = await pool.query(
//         `INSERT INTO "Students"
//         ("Student_Name", "Student_Number", "Avatar_ID", "Class_ID")
//         VALUES ($1, $2, $3, $4)
//         RETURNING "Student_ID"`,
//         [nameToInsert, studentNumber, avatarId, classId]
//       );

//       studentId = insertResult.rows[0].Student_ID;
//       console.log("Inserted new student:", studentId);
//     } else {
//       // update นักเรียนเดิม
//       studentId = studentResult.rows[0].Student_ID;

//       await pool.query(
//         `UPDATE "Students" SET "Avatar_ID" = $1 WHERE "Student_ID" = $2`,
//         [avatarId, studentId]
//       );

//       console.log("Updated existing student:", studentId);
//     }

//     res.json({ avatarId });
//   } catch (err) {
//     console.error("Real server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.post("/api/avatars", async (req, res) => {
  const { studentNumber, classId, stageName, maskId, costumeId, accessoryId, bodyId } = req.body;

  console.log("Payload received:", req.body);

  try {
    // 0. เช็กก่อนว่าคลาสนี้เต็มหรือยัง (200 คน)
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM "Students"
       WHERE "Class_ID" = $1`,
      [classId]
    );

    const total = parseInt(countResult.rows[0].total, 10);

    if (total >= 200) {
      return res.status(400).json({ error: "ห้องนี้มีนักเรียนครบ 200 คนแล้ว!" });
    }

    // 1. เช็กว่า Avatar แบบนี้เคยมีหรือยัง
    const existingAvatar = await pool.query(
      `SELECT "Avatar_ID" FROM "Avatars"
       WHERE "Mask_ID" = $1 AND "Costume_ID" = $2
       AND "Accessory_ID" = $3 AND "Body_ID" = $4`,
      [maskId, costumeId, accessoryId, bodyId]
    );

    let avatarId;

    if (existingAvatar.rows.length > 0) {
      avatarId = existingAvatar.rows[0].Avatar_ID;
      console.log("Found existing avatar:", avatarId);
    } else {
      const avatarResult = await pool.query(
        `INSERT INTO "Avatars" 
         ("Mask_ID", "Costume_ID", "Accessory_ID", "Body_ID")
         VALUES ($1, $2, $3, $4)
         RETURNING "Avatar_ID"`,
        [maskId, costumeId, accessoryId, bodyId]
      );
      avatarId = avatarResult.rows[0].Avatar_ID;
      console.log("Created new avatar:", avatarId);
    }

    // 2. เช็ก student → ต้องเช็กทั้ง Student_Number + Class_ID
    const studentResult = await pool.query(
      `SELECT "Student_ID"
       FROM "Students"
       WHERE "Student_Number" = $1 AND "Class_ID" = $2`,
      [studentNumber, classId]
    );

    let studentId;

    if (studentResult.rows.length === 0) {
      const nameToInsert =
        stageName && stageName.trim() !== "" ? stageName.trim() : studentNumber;

      console.log("Inserting student with name:", nameToInsert);

      // Insert ใหม่
      const insertResult = await pool.query(
        `INSERT INTO "Students"
        ("Student_Name", "Student_Number", "Avatar_ID", "Class_ID")
        VALUES ($1, $2, $3, $4)
        RETURNING "Student_ID"`,
        [nameToInsert, studentNumber, avatarId, classId]
      );

      studentId = insertResult.rows[0].Student_ID;
      console.log("Inserted new student:", studentId);

    } else {
      // อัปเดต avatar เท่านั้น (ไม่แตะ Class_ID)
      studentId = studentResult.rows[0].Student_ID;

      await pool.query(
        `UPDATE "Students" 
         SET "Avatar_ID" = $1 
         WHERE "Student_ID" = $2`,
        [avatarId, studentId]
      );

      console.log("Updated existing student:", studentId);
    }

    res.json({ avatarId });

  } catch (err) {
    console.error("Real server error:", err);
    res.status(500).json({ error: err.message });
  }
});







const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function StudentID() {
//   const { code } = useParams();
//   const [studentId, setStudentId] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (studentId.trim() !== "") {
//       navigate(`/class/${code}/student/${studentId}/avatar`);
//     } else {
//       alert("Please enter your Student ID");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
//       <h1 className="text-2xl font-bold mb-6">Student ID</h1>
//       <input
//           type="text"
//           placeholder="Enter Student ID"
//           value={studentId}
//           onChange={(e) => {
//             const value = e.target.value.replace(/\D/g, "");
//             setStudentId(value)
//           }}
//           className="text-sm w-[299px] h-[61px] px-4 py-2  bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none mb-6"
//         />

//         <button
//           onClick={handleJoin}
//           className="text-base w-[135px] h-[46px] bg-gray-300 text-black py-2 rounded-md border border-gray-700 hover:bg-gray-600 transition duration-200"
//         >
//           Join
//         </button>
//     </div>
//   );
// }

// export default StudentID;


// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000");

// function StudentID() {
//   const location = useLocation();
//   const { classId } = location.state; // มาจาก JoinRoom
//   const [studentNumber, setStudentNumber] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (!studentNumber.trim()) {
//       alert("Please enter your Student ID");
//       return;
//     }

//     // ส่งไป server เช็ก Student ว่ามีรึยัง
//     socket.emit("check_student", { studentNumber });

//     socket.once("student_checked", (data) => {
//       if (data.exists) {
//         // มี Student อยู่แล้ว → ไปหน้า SelectAvatar
//         navigate(`/class/${classId}/student/${studentNumber}/avatar`);
//       } else {
//         // alert(data.message);
//         socket.emit("create_student", { studentNumber });
//         socket.once("student_created", (newData) => {
//             navigate(`/class/${classId}/student/${studentNumber}/avatar`);
//         });
//         // ไม่มี → confirm สร้างใหม่
//         // if (window.confirm("Student ID นี้ยังไม่มี ต้องการสร้างใหม่ไหม?")) {
//         //   socket.emit("create_student", { studentNumber });
//         //   socket.once("student_created", (newData) => {
//         //     navigate(`/selectavatar`, { state: { student: newData.student } });
//         //   });
//         // }
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
//       <h1 className="text-2xl font-bold mb-6">Student ID</h1>
//       <input
//         type="text"
//         placeholder="Enter Student ID"
//         value={studentNumber}
//         onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, ""))}
//         className="text-sm w-[299px] h-[61px] px-4 py-2 mb-6 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none"
//       />
//       <button
//         onClick={handleJoin}
//         className="text-base w-[135px] h-[46px] bg-gray-300 text-black py-2 rounded-md border border-gray-700 hover:bg-gray-600 transition duration-200"
//       >
//         Join
//       </button>
//     </div>
//   );
// }

// export default StudentID;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function StudentID() {
  const location = useLocation();
  const navigate = useNavigate();

  const { classId } = location.state || {}; // กัน error ถ้าไม่มี state

  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState(""); // ⭐ สำหรับโชว์ error

  useEffect(() => {
    // Cleanup เพื่อป้องกัน socket listener ซ้ำ
    return () => {
      socket.off("student_checked");
      socket.off("student_created");
    };
  }, []);

  const handleJoin = () => {
    if (!studentNumber.trim()) {
      setError("⚠️ Please enter your Student ID");
      return;
    }

    // Clear error ก่อนส่ง
    setError("");

    socket.emit("check_student", { studentNumber });

    socket.once("student_checked", (data) => {
      if (data.exists) {
        navigate(`/class/${classId}/student/${studentNumber}/avatar`, {
          state: { classId, studentNumber },
        });
      } else {
        socket.emit("create_student", { studentNumber });

        socket.once("student_created", (newData) => {
          navigate(`/class/${classId}/student/${studentNumber}/avatar`, {
            state: { classId, studentNumber },
          });
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Student ID</h1>

      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentNumber}
        onChange={(e) => {
          setStudentNumber(e.target.value.replace(/\D/g, ""));
          setError(""); // ⭐ เคลียร์ error เมื่อเริ่มพิมพ์ใหม่
        }}
        className="text-sm w-[299px] h-[61px] px-4 py-2 mb-2 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none"
      />

      {/* ⭐ โชว์ error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleJoin}
        className="text-base w-[135px] h-[46px] bg-gray-300 text-black py-2 rounded-md border border-gray-700 hover:bg-gray-600 transition duration-200"
      >
        Join
      </button>
    </div>
  );
}

export default StudentID;


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { socket } from "../socket";

// function StudentID() {
  
//   const navigate = useNavigate();
//   const { joinCode } = useParams();
//   const [studentNumber, setStudentNumber] = useState("");
//   const [error, setError] = useState(""); // ⭐ สำหรับโชว์ error

//   useEffect(() => {
//     // Cleanup เพื่อป้องกัน socket listener ซ้ำ
//     return () => {
//       socket.off("student_checked");
//       socket.off("student_created");
//     };
//   }, []);

//   const handleJoin = () => {
//     if (!studentNumber.trim()) {
//       setError("Please enter your Student ID");
//       return;
//     }

//     // Clear error ก่อนส่ง
//     setError("");

//     socket.emit("check_student", { 
//       joinCode,
//       studentNumber 
//     });

//     socket.once("student_checked", (data) => {
//       console.log("✅ student_checked =", data);
//       if (data.exists) {
//         if (!data.studentId) {
//           setError("Invalid student data");
//           return;
//         }
//         navigate(`/class/${joinCode}/student/${data.studentId}/avatar`, {
//           state: {
//             studentId: data.studentId,
//             studentNumber: data.studentNumber,
//           },
//         });
//       } else {
//         socket.emit("create_student", { joinCode, studentNumber });

//         socket.once("student_created", (newData) => {
//           navigate(`/class/${joinCode}/student/${newData.studentId}/avatar`, {
//           state: {
//             studentId: newData.studentId,
//             studentNumber: newData.studentNumber,
//           },
//       });
//         });
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
//         onChange={(e) => {
//           setStudentNumber(e.target.value.replace(/\D/g, ""));
//           setError(""); // ⭐ เคลียร์ error เมื่อเริ่มพิมพ์ใหม่
//         }}
//         className="text-sm w-[299px] h-[61px] px-4 py-2 mb-2 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none"
//       />

//       {/* ⭐ โชว์ error */}
//       {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket";

function StudentID() {
  const navigate = useNavigate();
  const { joinCode } = useParams();
  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      socket.off("student_checked");
      socket.off("student_created");
    };
  }, []);

  const handleJoin = () => {
    if (!studentNumber.trim()) {
      setError("Please enter your Student ID");
      return;
    }

    setError("");

    socket.emit("check_student", { joinCode, studentNumber });

    socket.once("student_checked", (data) => {
      console.log("✅ student_checked =", data);

      // ✅ ถ้ามีอยู่แล้ว
      if (data.exists) {
        if (!data.studentId) {
          setError("Invalid student data");
          return;
        }

        navigate(`/class/${joinCode}/student/${data.studentId}/avatar`, {
          state: {
            studentId: data.studentId,
            studentNumber: data.studentNumber,
          },
        });
      }
      // ✅ ถ้ายังไม่มี → สร้างใหม่
      else {
        socket.emit("create_student", { joinCode, studentNumber });

        socket.once("student_created", (newData) => {
          console.log("🎉 student_created =", newData);

          if (!newData.studentId) {
            setError("Failed to create student");
            return;
          }

          navigate(`/class/${joinCode}/student/${newData.studentId}/avatar`, {
            state: {
              studentId: newData.studentId,
              studentNumber: newData.studentNumber,
            },
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
          setError("");
        }}
        className="text-sm w-[299px] h-[61px] px-4 py-2 mb-2 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none"
      />

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

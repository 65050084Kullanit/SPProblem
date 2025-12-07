/////////////////////////////////////////////////////////////////////////////////////ยังไม่เชื่อมหลังบ้าน
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar";


// function JoinRoom() {
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (code.trim() !== "") {
//       navigate(`/class/${code}`);
//     } else {
//       alert("Please Fill The Code");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-4 text-center ">
//         <Sidebar />
//         <h1 className="text-2xl font-bold mb-6">Join Room</h1>
//         <p className="text-xs text-gray-600 mb-8">
//           Join a room using the code provided by your teacher.
//         </p>

//         <input
//           type="text"
//           placeholder="Enter Code"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
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

// export default JoinRoom;

/////////////////////////////////////////////////////////////////////////////////////Error Popup
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import Sidebar from "../Sidebar";

// // Connect Socket.IO
// const socket = io("http://localhost:4000");

// function JoinRoom() {
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (code.trim() === "") {
//       alert("Please enter the room code");
//       return;
//     }

//     // Emit join_class event to server
//     socket.emit("join_class", { joinCode: code });

//     // Listen result from server
//     socket.once("join_result", (data) => {
//     if (data.success) {
//         console.log("Joined successfully:", data);

//         // Navigate to StudentID page และส่ง Class_ID + ActivitiesRooms ไปด้วย
//         navigate(`/class/${data.classId}`, {
//         state: { classId: data.classId, activities: data.activities }
//         });
//     } else {
//         alert(data.message); // รหัสห้องไม่ถูกต้อง หรือ error อื่น ๆ
//     }
//     });
// }


//   return (
//     <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-4 text-center">
//       <Sidebar />
//       <h1 className="text-2xl font-bold mb-6">Join Room</h1>
//       <p className="text-xs text-gray-600 mb-8">
//         Join a room using the code provided by your teacher.
//       </p>

//       <input
//         type="text"
//         placeholder="Enter Room Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
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

// export default JoinRoom;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "../Sidebar";

// Connect Socket.IO
const socket = io("http://localhost:4000");

function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");  // ⭐ เพิ่ม state สำหรับ error
  const navigate = useNavigate();

  const handleJoin = () => {
    if (code.trim() === "") {
      setError("Please enter the room code");
      return;
    }

    // Emit join_class event to server
    socket.emit("join_class", { joinCode: code });

    // Listen result from server
    socket.once("join_result", (data) => {
      if (data.success) {
        console.log("Joined successfully:", data);

        // Clear error ก่อน navigate
        setError("");

        // Navigate to StudentID page and send Class_ID + ActivitiesRooms
        navigate(`/class/${data.classId}`, {
          state: { classId: data.classId, activities: data.activities }
        });
      } else {
        // ❌ Show error message on screen, no alert
        setError(data.message || "Invalid room code");//(data.message || "Invalid room code");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-4 text-center">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-6">Join Room</h1>
      <p className="text-xs text-gray-600 mb-8">
        Join a room using the code provided by your teacher.
      </p>

      <input
        type="text"
        placeholder="Enter Room Code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError("");        // ⭐ เคลียร์ error ทันทีเมื่อเริ่มพิมพ์ใหม่
        }}
        className="text-sm w-[299px] h-[61px] px-4 py-2 mb-2 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none"
      />

      {/* ⭐ Show error message below input */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <button
        onClick={handleJoin}
        className="text-base w-[135px] h-[46px] bg-gray-300 text-black py-2 rounded-md border border-gray-700 hover:bg-gray-600 transition duration-200"
      >
        Join
      </button>
    </div>
  );
}

export default JoinRoom;

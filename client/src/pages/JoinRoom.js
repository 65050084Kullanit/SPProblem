import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar";
import { socket } from "../socket";


function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");  // ⭐ เพิ่ม state สำหรับ error
  const navigate = useNavigate();

  // const handleJoin = () => {
  //   if (code.trim() === "") {
  //     setError("Please enter the room code");
  //     return;
  //   }

  //   // Emit join_class event to server
   
  //   socket.emit("join_class", { joinCode: code });
    

  //   // Listen result from server
  //   socket.once("join_result", (data) => {
  //     if (data.success) {
  //       console.log("Joined successfully:", data);

  //       // Clear error ก่อน navigate
  //       setError("");

  //       // Navigate to StudentID page and send Class_ID + ActivitiesRooms
  //       navigate(`/class/${code}`);
  //     } else {
  //       // ❌ Show error message on screen, no alert
  //       setError(data.message || "Invalid room code");//(data.message || "Invalid room code");
  //     }
  //   });
  // };

  // 🔥 connect + listen result แค่ครั้งเดียว
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ CONNECTED:", socket.id);
    });

    socket.on("join_result", (data) => {
      console.log("🔥 join_result:", data);

      if (data.success) {
        setError("");
        navigate(`/class/${data.joinCode}`);
      } else {
        setError(data.message || "Invalid room code");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("join_result");
    };
  }, [navigate, code]);

  const handleJoin = () => {
    if (code.trim() === "") {
      setError("Please enter the room code");
      return;
    }

    socket.emit("join_class", { joinCode: code });
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden gap-4 text-center">
      {/* <Sidebar /> */}
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


      {/* 👩‍🏫 Teacher Sign in (sub action) */}
      <p className="text-xs text-gray-600 mt-3">
        Are you a teacher?{" "}
        <span
          onClick={() => navigate("/teacher/signin")}
          className="underline cursor-pointer hover:text-black"
        >
          Sign in here
        </span>
      </p>
    </div>
  );
}

export default JoinRoom;


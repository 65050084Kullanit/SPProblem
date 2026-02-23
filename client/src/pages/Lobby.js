// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { socket } from "../socket";


// const Lobby = () => {
//   const location = useLocation();
//   const { playerData,joinCode } = location.state || {};
//   const [players, setPlayers] = useState([]);
//   const currentUser = playerData;
//   const navigate = useNavigate();


//   useEffect(() => {
//     if (!playerData || !joinCode) return;

//     console.log("🎧 Lobby listening");

//     socket.on("room-players", (playersInRoom) => {
//       console.log("📥 room-players", playersInRoom);
//       setPlayers(playersInRoom);
//     });

//     socket.on("player-joined", (newPlayer) => {
//       setPlayers((prev) => {
//         const exists = prev.some((p) => p.id === newPlayer.id);
//         return exists ? prev : [...prev, newPlayer];
//       });
//     });

//     // 🔥 emit หลังจาก on แล้วเท่านั้น
//     socket.emit("join-room", {
//       joinCode,
//       player: playerData,
//     });

//     return () => {
//       socket.off("room-players");
//       socket.off("player-joined");
//     };
//   }, [playerData, joinCode]);

//   socket.emit("get_active_activity", {
//     classId: 1
//   });

//   useEffect(() => {
//     const handler = (payload) => {
//       console.log("🎯 activity_started", payload);
//       console.log("activity_started payload =", payload);

//        // 🔥 เข้าห้อง activity ทันที
//       socket.emit("join_activity", {
//         activitySessionId: payload.activitySessionId,
//       });

    
//       navigate(`/class/${joinCode}/lobby/quiz/${payload.activitySessionId}`,{
//           state: {
//             questions: payload.questions,
//             totalQuestions: payload.questions.length,
//             timeLimit: payload.timeLimit,
//             timerType: payload.timerType,
//             activitySessionId: payload.activitySessionId,
//             quizId: payload.quizId,           // ✅ เพิ่ม
//             studentId: playerData.id          // ✅ เพิ่ม
//           }
//       });
//     };

//     socket.on("activity_started", handler);

//     return () => socket.off("activity_started", handler);
//   }, []);






//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-6">Lobby</h1>

//       <p className="mb-6 text-gray-600">Waiting for teacher to start...</p>

//       <div className="grid grid-cols-3 gap-6">
//         {players.map((player) => {
//           const isCurrent = currentUser && player.id === currentUser.id;

//           return (
//             <div
//               key={player.id}
//               className="flex flex-col items-center p-4 rounded-lg animate-fadePop hover:scale-105 transition-transform duration-300"
//             >
//               {/* Avatar */}
//               <div
//                 className={`relative rounded-full flex items-center justify-center bg-gray-200 border-4 transition-all duration-300
//                   ${isCurrent 
//                     ? "w-32 h-32 border-blue-500 text-5xl scale-105 shadow-lg shadow-blue-300/50 animate-floating" 
//                     : "w-24 h-24 border-gray-300 text-4xl animate-floating"
//                   }`}
//               >

//                 {/* Face */}
//                 <span className="absolute">{player.avatar?.face}</span>

//                 {/* Hat */}
//                 {player.avatar.hat && (
//                   <span className="absolute -top-2">{player.avatar.hat}</span>
//                 )}

//                 {/* Clothes */}
//                 {player.avatar.clothes && (
//                   <span className="absolute bottom-0">{player.avatar.clothes}</span>
//                 )}
//               </div>

//               {/* Stage name */}
//               <span
//                 className={`font-medium mt-2 transition-all duration-300
//                   ${isCurrent ? "text-blue-500 text-lg" : "text-black text-base"} animate-floating`}
//               >
//                 {player.stageName}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Lobby;



import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket";


const Lobby = () => {
  const location = useLocation();
  // const { playerData,joinCode } = location.state || {};
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const { joinCode } = useParams();
  const savedPlayer = localStorage.getItem("student_meta");
  const playerData = savedPlayer ? JSON.parse(savedPlayer) : null;
  const currentUser = playerData;


  useEffect(() => {
    if (!playerData || !joinCode) return;

    console.log("🎧 Lobby listening");

    socket.on("room-players", (playersInRoom) => {
      console.log("📥 room-players", playersInRoom);
      setPlayers(playersInRoom);
    });

    socket.on("player-joined", (newPlayer) => {
      setPlayers((prev) => {
        const exists = prev.some((p) => String(p.studentId) === String(newPlayer.studentId));
        return exists ? prev : [...prev, newPlayer];
      });
    });

    // 🔥 emit หลังจาก on แล้วเท่านั้น
    socket.emit("join-room", {
      joinCode,
      player: playerData,
    });

    return () => {
      socket.off("room-players");
      socket.off("player-joined");
    };
  }, [playerData, joinCode]);

  // useEffect(() => {
  //   socket.on("player-updated", ({ studentId, stageName }) => {
  //     console.log("🔥 player-updated received:", stageName);

  //     setPlayers((prev) =>
  //       prev.map((p) =>
  //         String(p.studentId) === String(studentId)
  //           ? { ...p, stageName }
  //           : p
  //       )
  //     );
  //   });

  //   return () => socket.off("player-updated");
  // }, []);


  useEffect(() => {
    socket.emit("get_active_activity", { classId: 1 });
  }, []);


  useEffect(() => {
    const handler = (payload) => {
      console.log("🎯 activity_started", payload);
      console.log("activity_started payload =", payload);

       // 🔥 เข้าห้อง activity ทันที
      socket.emit("join_activity", {
        activitySessionId: payload.activitySessionId,
        studentId: playerData.studentId
      });

    
      navigate(`/class/${joinCode}/lobby/quiz/${payload.activitySessionId}`,{
          state: {
            questions: payload.questions,
            totalQuestions: payload.questions.length,
            timeLimit: payload.timeLimit,
            timerType: payload.timerType,
            activitySessionId: payload.activitySessionId,
            quizId: payload.quizId,           // ✅ เพิ่ม
            studentId: playerData.studentId,        // ✅ เพิ่ม
            quizStartTime: payload.quizStartTime,
            serverTime: payload.serverTime
          }
      });
    };

    socket.on("activity_started", handler);

    return () => socket.off("activity_started", handler);
  }, [joinCode]);






  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Lobby</h1>

      <p className="mb-6 text-gray-600">Waiting for teacher to start...</p>

      <div className="grid grid-cols-3 gap-6">
        {players.map((player) => {
          const isCurrent = currentUser && String(player.studentId) === String(currentUser.studentId);

          return (
            <div
              key={player.studentId}
              className="flex flex-col items-center p-4 rounded-lg animate-fadePop hover:scale-105 transition-transform duration-300"
            >
              {/* Avatar */}
              <div
                className={`relative rounded-full flex items-center justify-center bg-gray-200 border-4 transition-all duration-300
                  ${isCurrent 
                    ? "w-32 h-32 border-blue-500 text-5xl scale-105 shadow-lg shadow-blue-300/50 animate-floating" 
                    : "w-24 h-24 border-gray-300 text-4xl animate-floating"
                  }`}
              >

                {/* Face */}
                <span className="absolute">{player.avatar?.face}</span>

                {/* Hat */}
                {player.avatar.hat && (
                  <span className="absolute -top-2">{player.avatar.hat}</span>
                )}

                {/* Clothes */}
                {player.avatar.clothes && (
                  <span className="absolute bottom-0">{player.avatar.clothes}</span>
                )}
              </div>

              {/* Stage name */}
              <span
                className={`font-medium mt-2 transition-all duration-300
                  ${isCurrent ? "text-blue-500 text-lg" : "text-black text-base"} animate-floating`}
              >
                {String(player.stageName)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lobby;


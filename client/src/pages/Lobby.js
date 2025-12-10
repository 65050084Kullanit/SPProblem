// import React from "react";
// import { useLocation } from "react-router-dom";

// const Lobby = () => {
//   const location = useLocation();
//   const { playerData } = location.state || {}; // รับข้อมูลผู้เล่นตัวเอง
//   // const [activity, setActivity] = useState(null); //จำลอง activity quiz
//   // ถ้าไม่มีข้อมูล ส่งข้อความแจ้ง
//   if (!playerData) return <p>No player data</p>;

//   // สำหรับ demo สมมติมี players array (รวมตัวเองและคนอื่น)
//   const players = [
//     playerData, // ตัวเอง
//     { id: "2", stageName: "Alice", avatar: { face: "😎", hat: "🧢", clothes: "👕" } },
//     { id: "3", stageName: "Bob", avatar: { face: "🤓", hat: null, clothes: "🧥" } },
//     { id: "4", stageName: "Dream", avatar: { face: "😎", hat: "🧢", clothes: "👕" } },
//     { id: "5", stageName: "Baitong", avatar: { face: "🤓", hat: null, clothes: "🧥" } },
//   ];

//   const currentUser = playerData;

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-6">Lobby</h1>

//       <p className="mb-6 text-gray-600">Waiting for teacher to start...</p>

//       <div className="grid grid-cols-3 gap-6">
//         {players.map((player) => {
//             const isCurrent = player.id === currentUser.id; // เช็คผู้เล่นตัวเอง
//             return (
//             <div
//                 key={player.id}
//                 className="flex flex-col items-center p-4 rounded-lg  animate-fadePop hover:scale-105 transition-transform duration-300"
//             >
//                 {/* Avatar preview */}
//                 <div
//                 className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl
//                     bg-gray-200 border-4 ${isCurrent ? "border-blue-500" : "border-gray-300"} animate-floating `}
//                 >
//                 <span className="absolute">{player.avatar.face}</span>
//                 {player.avatar.hat && <span className="absolute -top-2">{player.avatar.hat}</span>}
//                 {player.avatar.clothes && <span className="absolute bottom-0">{player.avatar.clothes}</span>}
//                 </div>

//                 {/* Stage name */}
//                 <span className={`font-medium mt-2 ${isCurrent ? "text-blue-500" : "text-black"}`}>
//                 {player.stageName}
//                 </span>
//             </div>
//             );
//         })}
//         </div>


//     </div>
//   );
// };

// export default Lobby;





import React from "react";
import { useLocation } from "react-router-dom";

const Lobby = () => {
  const location = useLocation();
  const { playerData } = location.state || {};

  if (!playerData) return <p>No player data</p>;

  // ตัวอย่างข้อมูล players
  const players = [
    playerData, 
    { id: "2", stageName: "Alice", avatar: { face: "😎", hat: "🧢", clothes: "👕" } },
    { id: "3", stageName: "Bob", avatar: { face: "🤓", hat: null, clothes: "🧥" } },
    { id: "4", stageName: "Dream", avatar: { face: "😎", hat: "🧢", clothes: "👕" } },
    { id: "5", stageName: "Baitong", avatar: { face: "🤓", hat: null, clothes: "🧥" } },
  ];

  const currentUser = playerData;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Lobby</h1>

      <p className="mb-6 text-gray-600">Waiting for teacher to start...</p>

      <div className="grid grid-cols-3 gap-6">
        {players.map((player) => {
          const isCurrent = player.id === currentUser.id;

          return (
            <div
              key={player.id}
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
                <span className="absolute">{player.avatar.face}</span>

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
                {player.stageName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lobby;


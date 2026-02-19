import { useEffect, useState } from "react";
import { useLocation , useNavigate} from "react-router-dom";
import Navbar from "../Navbar";
import { socket } from "../socket";

function EndQuizPage() {
  const { state } = useLocation();
  const { activitySessionId, studentId } = state || {};
  const navigate = useNavigate();


  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [finalRank, setFinalRank] = useState(null);

  useEffect(() => {
    if (!activitySessionId || !studentId) return;

    socket.emit("get_final_result", {
      activitySessionId,
      studentId,
    });

  }, [activitySessionId, studentId]);

  useEffect(() => {
    const handler = ({ name, score, rank }) => {
      setPlayerName(name);
      setFinalScore(score);
      setFinalRank(rank);
    };

    socket.on("final_result", handler);
    return () => socket.off("final_result", handler);
  }, []);


  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px] pb-10">
      <Navbar />

      {/* Title */}
      <h1 className="text-3xl font-bold mt-4">Your Ranking</h1>

      {/* Profile Circle */}
      <div className="w-48 h-48 bg-gray-300 rounded-full mt-8"></div>

      {/* Name */}
      <p className="text-xl font-medium mt-4">{playerName}</p>

      {/* Final score */}
      <p className="text-lg font-medium mt-6">Your final score :</p>
      <p className="text-4xl font-bold">{finalScore}</p>

      {/* Final rank */}
      <p className="text-lg font-medium mt-6">Your final rank :</p>
      <p className="text-4xl font-bold">{finalRank !== null ? finalRank : "-"}</p>

      <div className="mt-16 w-full flex flex-col items-center space-y-6">
        <button
          onClick={() =>
            navigate(`/class/${activitySessionId}/analysis`, {
              state: { activitySessionId, studentId }
            })
          }
          className="bg-gray-600 text-white w-10/12 py-4 rounded-2xl text-lg hover:bg-gray-400"
        >
          Game Analysis
        </button>

      </div>
    </div>
  );
}

export default EndQuizPage;



// import { useEffect, useState } from "react";
// import { useLocation , useNavigate, useParams} from "react-router-dom";
// import Navbar from "../Navbar";
// import { socket } from "../socket";

// function EndQuizPage() {
//   const { state } = useLocation();
//   // const { activitySessionId, studentId, joincode } = state || {};
//   const { joinCode, activitySessionId } = useParams();
//   const studentId = localStorage.getItem("studentId"); // หรือ context

//   const navigate = useNavigate();


//   const [playerName, setPlayerName] = useState("");
//   const [finalScore, setFinalScore] = useState(0);
//   const [finalRank, setFinalRank] = useState(null);

//   useEffect(() => {
//     if (!activitySessionId || !studentId) return;

//     socket.emit("get_final_result", {
//       activitySessionId,
//       studentId,
//     });

//   }, [activitySessionId, studentId]);

//   useEffect(() => {
//     const handler = ({ name, score, rank }) => {
//       setPlayerName(name);
//       setFinalScore(score);
//       setFinalRank(rank);
//     };

//     socket.on("final_result", handler);
//     return () => socket.off("final_result", handler);
//   }, []);


//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px] pb-10">
//       <Navbar />

//       {/* Title */}
//       <h1 className="text-3xl font-bold mt-4">Your Ranking</h1>

//       {/* Profile Circle */}
//       <div className="w-48 h-48 bg-gray-300 rounded-full mt-8"></div>

//       {/* Name */}
//       <p className="text-xl font-medium mt-4">{playerName}</p>

//       {/* Final score */}
//       <p className="text-lg font-medium mt-6">Your final score :</p>
//       <p className="text-4xl font-bold">{finalScore}</p>

//       {/* Final rank */}
//       <p className="text-lg font-medium mt-6">Your final rank :</p>
//       <p className="text-4xl font-bold">{finalRank !== null ? finalRank : "-"}</p>

//       <div className="mt-16 w-full flex flex-col items-center space-y-6">
//         <button
//           onClick={() =>
//             navigate(`/class/:joinCode/lobby/quiz/:activitySessionId/end/analysis`, {
//               state: { joinCode,activitySessionId, studentId }
//             })
//           }
//           className="bg-gray-600 text-white w-10/12 py-4 rounded-2xl text-lg hover:bg-gray-400"
//         >
//           Game Analysis
//         </button>

//       </div>
//     </div>
//   );
// }

// export default EndQuizPage;

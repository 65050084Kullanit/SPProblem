// import { useEffect, useState } from "react";
// import { useLocation , useNavigate, useParams } from "react-router-dom";
// import Navbar from "../Navbar";
// import { socket } from "../socket";

// function EndQuizPage() {
//   const { state } = useLocation();
//   const { activitySessionId, studentId } = state || {};
//   const navigate = useNavigate();
//   const { joinCode } = useParams();


//   const [playerName, setPlayerName] = useState("");
//   const [finalScore, setFinalScore] = useState(0);
//   const [finalRank, setFinalRank] = useState(null);
//   const [avatar, setAvatar] = useState(null);

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


//   useEffect(() => {

//     const handler = () => {
//       console.log("🔴 teacher ended activity → back to lobby");

//       localStorage.removeItem("quiz_meta");
//       localStorage.removeItem("quiz_phase");
//       localStorage.removeItem("quiz_q_index");

//       navigate(`/class/${joinCode}/lobby`);
//     };

//     socket.on("force_back_to_lobby", handler);

//     return () => socket.off("force_back_to_lobby", handler);

//   }, [joinCode]);

//   useEffect(() => {
//     if (!studentId) return;

//     socket.emit("request_my_profile", { studentId });

//     const handler = (data) => {
//       setPlayerName(data.stageName); // ถ้าใช้ stageName
//       setAvatar(data.avatar);
//     };

//     socket.on("my_profile_data", handler);

//     return () => socket.off("my_profile_data", handler);
//   }, [studentId]);

  
//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px] pb-10">
//       <Navbar />

//       {/* Title */}
//       <h1 className="text-3xl font-bold mt-4">Your Ranking</h1>

//       <div className="relative w-48 h-48 rounded-full overflow-hidden bg-white mt-8">
//         <img src={avatar?.bodyPath} className="absolute inset-0 w-full h-full object-contain" />
//         <img src={avatar?.costumePath} className="absolute inset-0 w-full h-full object-contain" />
//         <img src={avatar?.hairPath} className="absolute inset-0 w-full h-full object-contain" />
//         <img src={avatar?.facePath} className="absolute inset-0 w-full h-full object-contain" />
//       </div>

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
//             navigate(`/class/${joinCode}/lobby/quiz/${activitySessionId}/end/analysis`, {
//               state: { activitySessionId, studentId }
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


import { useEffect, useState } from "react";
import { useLocation , useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { socket } from "../socket";

function EndQuizPage() {

  const { state } = useLocation();

  const activitySessionId =
    state?.activitySessionId || localStorage.getItem("activitySessionId");

  const studentId =
    state?.studentId || localStorage.getItem("studentId");
  const navigate = useNavigate();
  const { joinCode } = useParams();

  const [mode, setMode] = useState("individual");

  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [finalRank, setFinalRank] = useState(null);

  const [teamName, setTeamName] = useState("");
  const [teamScore, setTeamScore] = useState(0);
  const [teamRank, setTeamRank] = useState(null);

  const [avatar, setAvatar] = useState(null);

  /* ================= GET FINAL RESULT ================= */

  useEffect(() => {

    if (!activitySessionId || !studentId) return;

    socket.emit("get_final_result", {
      activitySessionId,
      studentId
    });

  }, [activitySessionId, studentId]);


  useEffect(() => {

    const handler = ({
      mode,
      name,
      score,
      rank,
      teamName,
      teamScore,
      teamRank
    }) => {

      setMode(mode);

      setPlayerName(name);
      setFinalScore(score);
      setFinalRank(rank);

      if (teamName) setTeamName(teamName);
      if (teamScore !== undefined) setTeamScore(teamScore);
      if (teamRank !== undefined) setTeamRank(teamRank);

    };

    socket.on("final_result", handler);

    return () => socket.off("final_result", handler);

  }, []);


  /* ================= FORCE BACK ================= */

  useEffect(() => {

    const handler = () => {

      console.log("🔴 teacher ended activity → back to lobby");

      localStorage.removeItem("quiz_meta");
      localStorage.removeItem("quiz_phase");
      localStorage.removeItem("quiz_q_index");

      navigate(`/class/${joinCode}/lobby`);

    };

    socket.on("force_back_to_lobby", handler);

    return () => socket.off("force_back_to_lobby", handler);

  }, [joinCode]);


  /* ================= GET AVATAR ================= */

  useEffect(() => {

    if (!studentId) return;

    socket.emit("request_my_profile", { studentId });

    const handler = (data) => {
      setPlayerName(data.stageName);
      setAvatar(data.avatar);
    };

    socket.on("my_profile_data", handler);

    return () => socket.off("my_profile_data", handler);

  }, [studentId]);

  useEffect(() => {

  const handler = () => {

      navigate(`/class/${joinCode}/lobby/quiz/${activitySessionId}/end/team`, {
        state:{ activitySessionId, studentId }
      })

    }

    socket.on("show_final_team_ranking", handler)

    return () => socket.off("show_final_team_ranking", handler)

  }, [joinCode, activitySessionId, studentId])


  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px] pb-10">

      <Navbar />

      <h1 className="text-3xl font-bold mt-4">Final Ranking</h1>

      {/* Avatar */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden bg-white mt-8">
        <img src={avatar?.bodyPath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.costumePath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.hairPath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.facePath} className="absolute inset-0 w-full h-full object-contain" />
      </div>

      {/* ================= INDIVIDUAL ================= */}

      {mode === "individual" && (
        <>
          <p className="text-xl font-medium mt-4">{playerName}</p>

          <p className="text-lg font-medium mt-6">Your Final Score :</p>
          <p className="text-4xl font-bold">{finalScore}</p>

          <p className="text-lg font-medium mt-6">Your Final Rank :</p>
          <p className="text-4xl font-bold">
            {finalRank !== null ? `#${finalRank}` : "-"}
          </p>

          <div className="mt-16 w-full flex flex-col items-center space-y-6">

            <button
              onClick={() =>
                navigate(`/class/${joinCode}/lobby/quiz/${activitySessionId}/end/analysis`, {
                  state: { activitySessionId, studentId }
                })
              }
              className="bg-gray-600 text-white w-10/12 py-4 rounded-2xl text-lg hover:bg-gray-400"
            >
              Game Analysis
            </button>

          </div>
        </>

        
      )}

      {/* ================= TEAM ================= */}

      {mode === "team" && (
        <>
          <p className="text-xl font-bold mt-4">{teamName}</p>

          <p className="text-gray-500">{playerName}</p>

          <p className="text-lg font-medium mt-6">Your Final Score :</p>
          <p className="text-4xl font-bold">{finalScore}</p>

          <p className="text-md font-medium mt-8 text-gray-500">
            Waiting for teacher to reveal final team result...
          </p>
        </>
      )}

    </div>
  );
}

export default EndQuizPage;
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { socket } from "../socket";

export default function EndQuizPageTeam() {

  const { state } = useLocation();

  const activitySessionId =
    state?.activitySessionId || localStorage.getItem("activitySessionId");

  const studentId =
    state?.studentId || localStorage.getItem("studentId");

  const navigate = useNavigate();
  const { joinCode } = useParams();

  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [teamName, setTeamName] = useState("");
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

    const handler = ({ name, score, teamName }) => {
      setPlayerName(name);
      setFinalScore(score);
      setTeamName(teamName);
    };

    socket.on("final_result", handler);

    return () => socket.off("final_result", handler);

  }, []);

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

  /* ================= SHOW TEAM RANKING ================= */

  useEffect(() => {

    const handler = () => {

      navigate(`/class/${joinCode}/lobby/quiz/${activitySessionId}/end/team`, {
        state: { activitySessionId, studentId }
      });

    };

    socket.on("show_final_team_ranking", handler);

    return () => socket.off("show_final_team_ranking", handler);

  }, [joinCode, activitySessionId, studentId]);

  /* ================= FORCE BACK ================= */

  useEffect(() => {

    const handler = () => {

      localStorage.removeItem("quiz_meta");
      localStorage.removeItem("quiz_phase");
      localStorage.removeItem("quiz_q_index");

      navigate(`/class/${joinCode}/lobby`);

    };

    socket.on("force_back_to_lobby", handler);

    return () => socket.off("force_back_to_lobby", handler);

  }, [joinCode]);

  return (

    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">

      <Navbar />

      <h1 className="text-3xl font-bold mt-4">
        Team Result
      </h1>

      {/* Avatar */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden bg-white mt-8">
        <img src={avatar?.bodyPath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.costumePath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.hairPath} className="absolute inset-0 w-full h-full object-contain" />
        <img src={avatar?.facePath} className="absolute inset-0 w-full h-full object-contain" />
      </div>

      <p className="text-xl font-bold mt-6">
        {teamName}
      </p>

      <p className="text-gray-500">
        {playerName}
      </p>

      <h2 className="text-2xl font-medium mt-6">
        Your Final Score :
      </h2>

      <p className="text-4xl font-bold">
        {finalScore}
      </p>

      <p className="text-md mt-8 text-gray-500">
        Waiting for teacher to reveal final team result...
      </p>

    </div>

  );
}
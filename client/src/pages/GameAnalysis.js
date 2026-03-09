import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { socket } from "../socket";
import QuestionAnalysisDetail from "./QuestionAnalysisDetail";

function GameAnalysis({ 
  activitySessionId: propSessionId,
  beforePage,
  onBack 
}) {
  const { activitySessionId: paramSessionId } = useParams();
  const navigate = useNavigate();
  const activitySessionId = propSessionId || paramSessionId;
    // const { classId, joinCode } = useParams();
  // const { activitySessionId } = location.state || {};
  // const activitySessionId = propSessionId ||
  //   location?.state?.activitySessionId;
  const [questions, setQuestions] = useState([]);
  const [analysisMap, setAnalysisMap] = useState({});
  const beforePageState = beforePage || "Play_Quiz";

  console.log("GameAnalysis activitySessionId =", activitySessionId, " beforePage =", beforePage);
  const { joinCode } = useParams();

  useEffect(() => {

    const handleKick = () => {
      console.log("🚪 activity ended");

      localStorage.removeItem("activity_session");

      navigate(`/class/${joinCode}/lobby`, { replace: true });
    };

    socket.on("force_back_to_lobby", handleKick);

    return () => socket.off("force_back_to_lobby", handleKick);

  }, [joinCode]);

  /* โหลดคำถาม */
  useEffect(() => {
    if (!activitySessionId) return;

    socket.emit("get_questions_by_activity", { activitySessionId });

    const handler = (data) => setQuestions(data || []);
    socket.on("questions_by_activity_data", handler);

    return () => socket.off("questions_by_activity_data", handler);
  }, [activitySessionId]);

  /* โหลด analysis ต่อข้อ */
  useEffect(() => {
    if (!activitySessionId || questions.length === 0) return;

    questions.forEach((q) => {
      socket.emit("get_question_analysis", {
        activitySessionId,
        questionId: q.Question_ID,
      });
    });

    const handler = (data) => {
      if (!data?.length) return;
      const qid = data[0].Question_ID;
      setAnalysisMap((prev) => ({ ...prev, [qid]: data }));
    };

    socket.on("question_analysis_data", handler);
    return () => socket.off("question_analysis_data", handler);
  }, [activitySessionId, questions]);

  return (
<div className="min max-w-4xl mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col">

<div className="h-5" />

  <div className="px-4 pt-6 pb-4">
    <h1 className="text-3xl font-bold text-center">
      Game Analysis
    </h1>
  </div>

  <div className="h-3" />

  <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-6">

        {questions.map((q, index) => (

          <div
            key={q.Question_ID}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
          >

            {/* Question Header */}

            <div className="mb-3">

              <div className="text-xs text-slate-400 mb-1">
                Question {index + 1}
              </div>

              <div className="font-medium">
                {q.Question_Text}
              </div>

            </div>


            {/* Analysis */}

            {analysisMap[q.Question_ID] ? (

              <QuestionAnalysisDetail
                analysis={analysisMap[q.Question_ID]}
              />

            ) : (

              <div className="text-sm text-slate-500">
                Loading analysis...
              </div>

            )}

          </div>

        ))}

      </div>



      {/* FOOTER BUTTON */}

      {beforePageState === "Play_Quiz" && (

        <div className="flex flex-col items-center gap-3 pb-12">

          <button
            onClick={() => navigate(-1)}
            className="
            w-72 py-3 rounded-lg
            bg-cyan-400 text-slate-900 font-semibold
            hover:bg-cyan-300
            shadow-lg shadow-cyan-400/30
            transition"
          >
            Back
          </button>

        </div>

      )}

    </div>

  );
}

export default GameAnalysis;

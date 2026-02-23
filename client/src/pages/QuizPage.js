// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useRef, useState} from "react";
// import { socket } from "../socket";

// import OneAnsQuizPage from "./OneAnsQuizPage";
// import MultiAnsQuizPage from "./MultiAnsQuizPage";
// import Activity_quiz_ordering from "./OrderAnsQuizPage";
// import AnswerResultPage from "./AnswerResultPage";

// export default function QuizPage() {
//   const { state } = useLocation();
//   const safeState = state ?? {};
//   const { joinCode } = useParams();
//   const [rank, setRank] = useState(null);


//   const {
//     questions = [],
//     totalQuestions = 0,
//     timeLimit = null,
//     timerType,
//     activitySessionId,
//     quizId,
//     studentId,
//   } = safeState;

//   /* ================= STATE ================= */

//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [localPhase, setLocalPhase] = useState("question"); // question | solution
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [lastTimeSpent, setLastTimeSpent] = useState(0);
//   const navigate = useNavigate();
  

//   const question = questions[questionIndex];
//   const isTeacherPaced = timerType === "teacher";
//   const [quizEnded, setQuizEnded] = useState(false);
//   const isLastQuestion = questionIndex === questions.length - 1;

//   const [pointForThis, setPointForThis] = useState(0);
//   const [currentPoint, setCurrentPoint] = useState(0);



//   useEffect(() => {
//     if (!activitySessionId) return;

//     socket.emit("join_activity", {
//       activitySessionId: Number(activitySessionId),
//       studentId, // ✅ ส่ง studentId ด้วย
      
//     });
//     console.log("sending join_activity:", {
//       activitySessionId,
//       studentId
//     });


//     console.log("👨‍🎓 student joined activity room:", activitySessionId);
//   }, [activitySessionId]);


//   /* ================= TEACHER START QUESTION ================= */

//   useEffect(() => {
//     if (!isTeacherPaced) return;

//     const handler = ({ index }) => {
//       setQuestionIndex(index);
//       setLocalPhase("question");
//       setIsCorrect(null);
//     };

//     socket.on("start_question", handler);
//     return () => socket.off("start_question", handler);
//   }, [isTeacherPaced]);

//   //===============QuizTimer=======================================================
//   const isQuizTimer = timerType === "quiz";
//   const isQuestionTimer = timerType === "question" || timerType === "teacher";
//   const isManualEnd = timerType === "manual";

//   const [quizRemainingTime, setQuizRemainingTime] = useState(() =>
//     isQuizTimer && Number.isFinite(timeLimit)
//       ? timeLimit
//       : null
//   );

//   // useEffect(() => {
//   //   if (!isQuizTimer) return;
//   //   if (!Number.isFinite(timeLimit)) return;

//   //   setQuizRemainingTime(timeLimit);
//   // }, [isQuizTimer, timeLimit]);

  

//   useEffect(() => {
//     if (!isQuizTimer) return;
//     if (!Number.isFinite(quizRemainingTime)) return;

//     if (quizRemainingTime <= 0) {
//       socket.emit("force_submit", { activitySessionId });
//       socket.emit("end_quiz", { activitySessionId });
//       return;
//     }

//     const id = setInterval(() => {
//       setQuizRemainingTime(t => (Number.isFinite(t) ? t - 1 : 0));
//     }, 1000);

//     return () => clearInterval(id);
//   }, [quizRemainingTime, isQuizTimer]);


//   console.log({
//     timerType,
//     timeLimit,
//     quizRemainingTime
//   });

//   /* ================= RECEIVE ANSWER RESULT ================= */

//   useEffect(() => {
//     const handler = ({ isCorrect }) => {
//       setIsCorrect(isCorrect);
//       setLocalPhase("solution");
//     };

//     socket.on("answer_result", handler);
//     return () => socket.off("answer_result", handler);
//   }, []);


//   useEffect(() => {
//     const handler = ({ studentId: sid, scoreForThis, totalScore }) => {
//       console.log("📥 student_result received:", sid, scoreForThis, totalScore);

//       if (Number(sid) !== Number(studentId)) return;

//       setPointForThis(scoreForThis);
//       setCurrentPoint(totalScore);
//     };

//     socket.on("student_result", handler);
//     return () => socket.off("student_result", handler);
//   }, [studentId]);


//   useEffect(() => {
//     socket.on("my_rank_update", ({ rank }) => {
//       setRank(rank);
//     });

//     return () => socket.off("my_rank_update");
//   }, []);



// /* ================= Quiz Ended ================= */
//   useEffect(() => {
//     const handleQuizEnd = () => {
//       console.log("🟢 quiz_ended received (student)");
//       setQuizEnded(true);
//     };

//     socket.on("quiz_ended", handleQuizEnd);
//     return () => socket.off("quiz_ended", handleQuizEnd);
//   }, []);

//   useEffect(() => {
//     if (!quizEnded) return;

//     navigate(
//       `/class/${joinCode}/lobby/quiz/${activitySessionId}/end`,
//       {
//         state: { activitySessionId, studentId }
//       }
//     );

//   }, [quizEnded, navigate, activitySessionId, studentId]);


//   //refresh
//   useEffect(() => {
//     if (!question) return;

//     socket.emit("check_answer_status", {
//       activitySessionId,
//       questionId: question.Question_ID,
//       studentId,
//       questionType: question.Question_Type
//     });


//     const handler = ({
//       alreadyAnswered,
//       isCorrect,
//       scoreForThis,
//       totalScore,
//       timeSpent,
//       rank
//     }) => {

//       if (alreadyAnswered) {
//         setIsCorrect(isCorrect);
//         setPointForThis(scoreForThis);
//         setCurrentPoint(totalScore);
//         setLastTimeSpent(timeSpent);
//         setRank(rank);
//         setLocalPhase("solution");
//       }
//     };



//     socket.on("answer_status", handler);

//     return () => socket.off("answer_status", handler);

//   }, [questionIndex]);


//   /* ================= ACTION ================= */

//   const submitAnswer = ({ selectedIds, timeSpent,questionType }) => {
//     setLastTimeSpent(timeSpent);

//     console.log(studentId)

//     socket.emit("submit_answer", {
//       activitySessionId,
//       quizId,
//       questionId: question.Question_ID,
//       studentId,
//       questionType,
//       choiceIds: selectedIds,
//       timeSpent,
//       currentQuestionIndex: questionIndex + 1,   // ✅ เพิ่ม
//       totalQuestions,  
//     });
//   };

//   const goNextQuestion = () => {
//     if (questionIndex + 1 < questions.length
//     ) {
//       setQuestionIndex(i => i + 1);
//       setLocalPhase("question");
//       setIsCorrect(null);
//     } else {
//       console.log("🎉 Quiz finished");
//       setQuizEnded(true);
//     }
//   };

//   /* ================= RENDER: LOADING ================= */

//   if (!questions.length) {
//     return <div className="p-10 text-center">Loading quiz...</div>;
//   }

//   /* ================= RENDER: SOLUTION ================= */

//   if (localPhase === "solution") {
//     return (
//       <AnswerResultPage
//         isTeacherPaced={isTeacherPaced}
//         isCorrect={isCorrect}
//         pointForThis={pointForThis}
//         currentPoint={currentPoint}
//         timeSpent={lastTimeSpent}
//         rank={rank}
//         username="Aka"
//         showNext={!isTeacherPaced}
//         onNext={goNextQuestion}
//         isLastQuestion={isLastQuestion}
//         isQuizTimer={timerType === "quiz"}
//         quizRemainingTime={quizRemainingTime}
//       />
//     );
//   }

//   if (!question) {
//     return <div className="p-10 text-center">No question</div>;
//   }
//   /* ================= RENDER: QUESTION ================= */

//   if (question.Question_Type === "single") {
//     return (
//       <OneAnsQuizPage
//         question={question}
//         // timeLimit={
//         //   timerType === "quiz" ? quizRemainingTime : timeLimit
//         // }
//         timeLimit={
//           isQuizTimer
//             ? quizRemainingTime
//             : isQuestionTimer
//               ? timeLimit
//               : null
//         }
//         isQuizTimer={timerType === "quiz"}
//         currentQuestion={questionIndex + 1}
//         totalQuestions={totalQuestions}
//         // onSubmit={(selectedIds, timeSpent) =>
//         //   submitAnswer({ selectedIds, timeSpent })
//         // }
//         onSubmit={(selectedIds, timeSpent) =>
//           submitAnswer({
//             selectedIds,
//             timeSpent,
//             questionType: "single",   // หรือ "multiple"
//           })
//         }

//       />
//     );
//   }

//   if (question.Question_Type === "multiple") {
//     return (
//       <MultiAnsQuizPage
//         question={question}
//         timeLimit={
//           isQuizTimer
//             ? quizRemainingTime
//             : isQuestionTimer
//               ? timeLimit
//               : null
//         }
//         isQuizTimer={timerType === "quiz"}
//         currentQuestion={questionIndex + 1}
//         totalQuestions={totalQuestions}
//         // onSubmit={(selectedIds, timeSpent) =>
//         //   submitAnswer({ selectedIds, timeSpent })
//         // }
//         onSubmit={(selectedIds, timeSpent) =>
//           submitAnswer({
//             selectedIds,
//             timeSpent,
//             questionType: "multiple",   // หรือ "multiple"
//           })
//         }

//       />
//     );
//   }

//   if (question.Question_Type === "ordering") {
//     return (
//       <Activity_quiz_ordering
//         question={question}
//         current={questionIndex + 1}
//         total={totalQuestions}
//         // timeLimit={
//         //   timerType === "quiz" ? quizRemainingTime : timeLimit
//         // }
//         timeLimit={
//           isQuizTimer
//             ? quizRemainingTime
//             : isQuestionTimer
//               ? timeLimit
//               : null
//         }
//         onNext={(orderedAnswers,actualTimeSpent) => {
//           // orderedAnswers = [{ optionId, order }, ...]
//           submitAnswer({
//             selectedIds: orderedAnswers,
//             timeSpent: actualTimeSpent,
//             questionType: "ordering", 
//           });
//         }}
//         onTimeUp={(orderedAnswers, actualTimeSpent) => {
//           submitAnswer({
//             selectedIds: orderedAnswers,
//             timeSpent: actualTimeSpent,
//             questionType: "ordering",
//           });
//       }}
//       />
//     );
//   }



//   return <div>Unsupported question type</div>;
// }


import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState} from "react";
import { socket } from "../socket";

import OneAnsQuizPage from "./OneAnsQuizPage";
import MultiAnsQuizPage from "./MultiAnsQuizPage";
import Activity_quiz_ordering from "./OrderAnsQuizPage";
import AnswerResultPage from "./AnswerResultPage";
import RankingPage from "./RankingPage";

export default function QuizPage() {

  const { state } = useLocation();
  const { joinCode } = useParams();
  const navigate = useNavigate();

  const [answerLoading, setAnswerLoading] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [questionStartRemaining, setQuestionStartRemaining] = useState(null);
  const [manualStartTime, setManualStartTime] = useState(null);

  /* ================= SAFE STATE (รองรับ refresh) ================= */

  let safeState = state;

  if (!safeState) {
    const saved = localStorage.getItem("quiz_meta");
    if (saved) {
      safeState = JSON.parse(saved);
    } else {
      safeState = {};
    }
  }

  const {
    questions = [],
    totalQuestions = 0,
    timeLimit = null,
    timerType,
    activitySessionId,
    quizId,
    studentId,
    quizStartTime,
    serverTime

  } = safeState;
  console.log("quizStartTime =", quizStartTime);
  console.log("timeLimit =", timeLimit);
  const [rank, setRank] = useState(null);


  const isQuizTimer = timerType === "quiz";
  const isQuestionTimer = timerType === "question" || timerType === "teacher";

  /* ================= STATE ================= */

  const [questionIndex, setQuestionIndex] = useState(() => {
    const saved = localStorage.getItem("quiz_q_index");
    return saved ? Number(saved) : 0;
  });

  const [localPhase, setLocalPhase] = useState(() => {
    return localStorage.getItem("quiz_phase") || "question";
  });

  const [isCorrect, setIsCorrect] = useState(null);
  const [lastTimeSpent, setLastTimeSpent] = useState(0);

  const [pointForThis, setPointForThis] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);

  const question = questions[questionIndex];
  const isTeacherPaced = timerType === "teacher";
  const isLastQuestion = questionIndex === questions.length - 1;

  const [quizEnded, setQuizEnded] = useState(false);

  const [quizRemainingTime, setQuizRemainingTime] = useState(null);
  // useEffect(() => {
  //   if (timerType === "quiz" && Number.isFinite(timeLimit)) {
  //     setQuizRemainingTime(timeLimit);
  //   }
  // }, [timerType, timeLimit]);


  useEffect(() => {
    localStorage.setItem("quiz_q_index", questionIndex);
  }, [questionIndex]);

  // set เวลาเริ่มข้อ แค่ตอนเปลี่ยนข้อ
  // useEffect(() => {
  //   if (!isQuizTimer) return;
  //   if (!Number.isFinite(quizRemainingTime)) return;

  //   setQuestionStartTime(quizRemainingTime);

  // }, [questionIndex]); // ❗ เอา quizRemainingTime ออก


  /* ================= SAVE META FOR REFRESH ================= */

  useEffect(() => {
    if (!activitySessionId) return;

    localStorage.setItem(
      "quiz_meta",
      JSON.stringify({
        questions,
        totalQuestions,
        timeLimit,
        timerType,
        activitySessionId,
        quizId,
        studentId,
      })
    );

  }, [activitySessionId]);

  /* ================= SAVE QUESTION INDEX ================= */

  // useEffect(() => {
  //   localStorage.setItem("quiz_q_index", questionIndex);
  //   if (!isQuizTimer) return;
  //   if (!Number.isFinite(quizRemainingTime)) return;

  //   setQuestionStartTime(quizRemainingTime);

  // }, [questionIndex,quizRemainingTime]);

  /* ================= SAVE PHASE ================= */

  useEffect(() => {
    localStorage.setItem("quiz_phase", localPhase);
  }, [localPhase]);

  /* ================= JOIN ACTIVITY ================= */

  useEffect(() => {
    if (!activitySessionId) return;

    socket.emit("join_activity", {
      activitySessionId: Number(activitySessionId),
      studentId,
    });

  }, [activitySessionId]);

  /* ================= TEACHER START QUESTION ================= */

  useEffect(() => {
    if (!isTeacherPaced) return;

    const handler = ({ index }) => {
      setQuestionIndex(index);
      setLocalPhase("question");
      setIsCorrect(null);
    };

    socket.on("start_question", handler);
    return () => socket.off("start_question", handler);

  }, [isTeacherPaced]);

  /* ================= QUIZ TIMER ================= */
  useEffect(() => {
    if (!isQuizTimer) return;
    if (quizRemainingTime === null) return;

    const key = `quiz_q_start_remaining_${questionIndex}`;
    localStorage.setItem(key, quizRemainingTime);

    console.log("🟢 question start remaining =", quizRemainingTime);

  }, [questionIndex, quizRemainingTime]);


  useEffect(() => {
    if (isQuizTimer) {
      setQuestionStartTime(Date.now());
    }
  }, [questionIndex]);

  useEffect(() => {
    if (timerType === "manual") {
      setManualStartTime(Date.now());
      console.log("🟢 manual start =", Date.now());
    }
  }, [questionIndex, timerType]);

  useEffect(() => {
    if (!isQuizTimer) return;
    if (!quizStartTime || !Number.isFinite(timeLimit)) return;

    const endTime = quizStartTime + timeLimit * 1000;

    const updateTime = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setQuizRemainingTime(remaining);

      if (remaining <= 0) {
        socket.emit("force_submit", { activitySessionId });
        socket.emit("end_quiz", { activitySessionId });
      }
    };

    updateTime(); // ยิงทันที
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);

  }, [quizStartTime, timeLimit, isQuizTimer]);
  





  // useEffect(() => {
  //   if (localPhase !== "question") return;
  //   if (timerType !== "quiz" && timerType !== "manual") return;

  //   const key = `question_start_ts_${questionIndex}`;

  //   // 🔥 สำคัญ: reset เฉพาะตอน "เปลี่ยนข้อจริง ๆ"
  //   if (!localStorage.getItem(key)) {
  //     const now = Date.now();
  //     localStorage.setItem(key, now);
  //     console.log("🟢 SET start timestamp =", now);
  //   }

  // }, [questionIndex]);
  useEffect(() => {
    if (localPhase !== "question") return;
    if (timerType !== "quiz" && timerType !== "manual") return;

    const key = `question_start_ts_${questionIndex}`;
    const now = Date.now();

    localStorage.setItem(key, now);

    console.log("🟢 FORCE RESET timestamp =", now);

  }, [questionIndex]);
  /* ================= RECEIVE ANSWER RESULT ================= */

  useEffect(() => {
    const handler = ({ isCorrect }) => {
      setIsCorrect(isCorrect);
      setLocalPhase("solution");
    };

    socket.on("answer_result", handler);
    return () => socket.off("answer_result", handler);

  }, []);

  useEffect(() => {
    const handler = ({ studentId: sid, scoreForThis, totalScore }) => {
      if (Number(sid) !== Number(studentId)) return;
      setPointForThis(scoreForThis);
      setCurrentPoint(totalScore);
    };

    socket.on("student_result", handler);
    return () => socket.off("student_result", handler);

  }, [studentId]);

  // useEffect(() => {
  //   socket.on("my_rank_update", ({ rank }) => {
  //     setRank(rank);
  //   });

  //   return () => socket.off("my_rank_update");
  // }, []);

  /* ================= QUIZ ENDED ================= */

  useEffect(() => {
    const handleQuizEnd = () => {
      setQuizEnded(true);
    };

    socket.on("quiz_ended", handleQuizEnd);
    return () => socket.off("quiz_ended", handleQuizEnd);

  }, []);

  useEffect(() => {
    if (!quizEnded) return;

    localStorage.removeItem("quiz_meta");
    localStorage.removeItem("quiz_q_index");
    localStorage.removeItem("quiz_phase");
    localStorage.removeItem("quiz_remaining_time");
    localStorage.removeItem("quiz_end_time");
    localStorage.removeItem("manual_start_time");

    navigate(
      `/class/${joinCode}/lobby/quiz/${activitySessionId}/end`,
      {
        state: { activitySessionId, studentId }
      }
    );

  }, [quizEnded]);

  useEffect(() => {
    if (!activitySessionId) return;

    // 🔥 ถ้า activitySessionId เปลี่ยน แปลว่า quiz ใหม่
    const savedSession = localStorage.getItem("quiz_session_id");

    if (savedSession !== String(activitySessionId)) {

      Object.keys(localStorage)
      .filter(k => k.startsWith("question_start_ts_"))
      .forEach(k => localStorage.removeItem(k));

      // 🧹 ล้าง state เก่า
      localStorage.removeItem("quiz_phase");
      localStorage.removeItem("quiz_q_index");
      localStorage.removeItem("quiz_remaining_time");
      localStorage.removeItem("quiz_end_time");

      setLocalPhase("question");
      setQuestionIndex(0);
      setIsCorrect(null);

      localStorage.setItem("quiz_session_id", activitySessionId);
    }

  }, [activitySessionId]);


  /* ================= REFRESH CHECK ANSWER ================= */

  useEffect(() => {
    if (!question) return;

    setAnswerLoading(true);

    socket.emit("check_answer_status", {
      activitySessionId,
      questionId: question.Question_ID,
      studentId,
      questionType: question.Question_Type
    });

    const handler = (data) => {

      if (data.questionId !== question.Question_ID) return;

      if (data.alreadyAnswered) {
        setIsCorrect(data.isCorrect);
        setPointForThis(data.scoreForThis);
        setCurrentPoint(data.totalScore);
        setLastTimeSpent(data.timeSpent);
        setRank(data.rank);
        setLocalPhase("solution");
      }

      setAnswerLoading(false);
    };

    socket.on("answer_status", handler);
    return () => socket.off("answer_status", handler);

  }, [questionIndex]);


  /* ================= ACTION ================= */

  const submitAnswer = ({ selectedIds, timeSpent, questionType }) => {

    let finalTimeSpent = 0;

    if (timerType === "quiz" || timerType === "manual") {

      const key = `question_start_ts_${questionIndex}`;
      const startTsRaw = localStorage.getItem(key);
      const startTs = Number(startTsRaw);
      const now = Date.now();

      if (
        startTsRaw &&
        Number.isFinite(startTs) &&
        startTs > 0 &&
        now > startTs
      ) {
        finalTimeSpent = Math.floor((now - startTs) / 1000);
      } else {
        finalTimeSpent = 0;
      }

    } else {
      finalTimeSpent = timeSpent ?? 0;
    }

    setLastTimeSpent(finalTimeSpent);

    socket.emit("submit_answer", {
      activitySessionId,
      quizId,
      questionId: question.Question_ID,
      studentId,
      questionType,
      choiceIds: selectedIds,
      timeSpent: finalTimeSpent,
      currentQuestionIndex: questionIndex + 1,
      totalQuestions,
    });
  };

  const goNextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(i => i + 1);
      setLocalPhase("question");
      setIsCorrect(null);
    } else {
      setQuizEnded(true);
    }
  };

  useEffect(() => {
    if (!isTeacherPaced) return;

    socket.on("go_to_ranking", () => {
      setLocalPhase("ranking");
    });

    socket.on("start_question", ({ index }) => {
      setQuestionIndex(index);
      setLocalPhase("question");
      setIsCorrect(null);
    });

    return () => {
      socket.off("go_to_ranking");
      socket.off("start_question");
    };

  }, [isTeacherPaced]);

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

  /* ================= RENDER ================= */

  if (!questions.length) {
    return <div className="p-10 text-center">Loading quiz...</div>;
  }

  if (localPhase === "ranking") {
    return (
      <RankingPage
        activitySessionId={activitySessionId}
        studentId={studentId}
        username="Aka"
      />
    );
  }

  if (localPhase === "solution") {

    if (answerLoading) {
      return <div className="p-10 text-center">Loading result...</div>;
    }

    return (
      <AnswerResultPage
          isTeacherPaced={isTeacherPaced}
          isCorrect={isCorrect}
          pointForThis={pointForThis}
          currentPoint={currentPoint}
          timeSpent={lastTimeSpent}
          username="Aka"
          showNext={!isTeacherPaced}
          onNext={goNextQuestion}
          isLastQuestion={isLastQuestion}
          isQuizTimer={isQuizTimer}
          quizRemainingTime={quizRemainingTime}
        />
    );
  }

  if (!question) {
    return <div className="p-10 text-center">No question</div>;
  }

  if (question.Question_Type === "single") {
    return (
      <OneAnsQuizPage
        question={question}
        timeLimit={
          isQuizTimer
            ? quizRemainingTime
            : isQuestionTimer
              ? timeLimit
              : null
        }
        isQuizTimer={isQuizTimer}
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        onSubmit={(selectedIds, timeSpent) =>
          submitAnswer({
            selectedIds,
            timeSpent,
            questionType: "single",
          })
        }
      />
    );
  }

  if (question.Question_Type === "multiple") {
    return (
      <MultiAnsQuizPage
        question={question}
        timeLimit={
          isQuizTimer
            ? quizRemainingTime
            : isQuestionTimer
              ? timeLimit
              : null
        }
        isQuizTimer={isQuizTimer}
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        onSubmit={(selectedIds, timeSpent) =>
          submitAnswer({
            selectedIds,
            timeSpent,
            questionType: "multiple",
          })
        }
      />
    );
  }

  if (question.Question_Type === "ordering") {
    return (
      <Activity_quiz_ordering
        question={question}
        current={questionIndex + 1}
        total={totalQuestions}
        timeLimit={
          isQuizTimer
            ? quizRemainingTime
            : isQuestionTimer
              ? timeLimit
              : null
        }
        onNext={(orderedAnswers, actualTimeSpent) =>
          submitAnswer({
            selectedIds: orderedAnswers,
            timeSpent: actualTimeSpent,
            questionType: "ordering",
          })
        }
        onTimeUp={(orderedAnswers, actualTimeSpent) =>
          submitAnswer({
            selectedIds: orderedAnswers,
            timeSpent: actualTimeSpent,
            questionType: "ordering",
          })
        }
      />
    );
  }

  return <div>Unsupported question type</div>;
}

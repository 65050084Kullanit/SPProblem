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


//   useEffect(() => {
//     if (!activitySessionId) return;

//     socket.emit("join_activity", {
//       activitySessionId: Number(activitySessionId),
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




//   /* ================= RECEIVE ANSWER RESULT ================= */

//   useEffect(() => {
//     const handler = ({ isCorrect }) => {
//       setIsCorrect(isCorrect);
//       setLocalPhase("solution");
//     };

//     socket.on("answer_result", handler);
//     return () => socket.off("answer_result", handler);
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
//         isCorrect={isCorrect}
//         pointForThis={100}        // mock
//         currentPoint={500}        // mock
//         timeSpent={lastTimeSpent}
//         rank={null}
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
//         timeLimit={
//           timerType === "quiz" ? quizRemainingTime : timeLimit
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
//           timerType === "quiz" ? quizRemainingTime : timeLimit
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
//         timeLimit={
//           timerType === "quiz" ? quizRemainingTime : timeLimit
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

export default function QuizPage() {
  const { state } = useLocation();
  const safeState = state ?? {};
  const { joinCode } = useParams();
  const [rank, setRank] = useState(null);


  const {
    questions = [],
    totalQuestions = 0,
    timeLimit = null,
    timerType,
    activitySessionId,
    quizId,
    studentId,
  } = safeState;

  /* ================= STATE ================= */

  const [questionIndex, setQuestionIndex] = useState(0);
  const [localPhase, setLocalPhase] = useState("question"); // question | solution
  const [isCorrect, setIsCorrect] = useState(null);
  const [lastTimeSpent, setLastTimeSpent] = useState(0);
  const navigate = useNavigate();
  

  const question = questions[questionIndex];
  const isTeacherPaced = timerType === "teacher";
  const [quizEnded, setQuizEnded] = useState(false);
  const isLastQuestion = questionIndex === questions.length - 1;

  const [pointForThis, setPointForThis] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);



  useEffect(() => {
    if (!activitySessionId) return;

    socket.emit("join_activity", {
      activitySessionId: Number(activitySessionId),
      studentId, // ✅ ส่ง studentId ด้วย
      
    });
    console.log("sending join_activity:", {
      activitySessionId,
      studentId
    });


    console.log("👨‍🎓 student joined activity room:", activitySessionId);
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

  //===============QuizTimer=======================================================
  const isQuizTimer = timerType === "quiz";
  const isQuestionTimer = timerType === "question" || timerType === "teacher";
  const isManualEnd = timerType === "manual";

  const [quizRemainingTime, setQuizRemainingTime] = useState(() =>
    isQuizTimer && Number.isFinite(timeLimit)
      ? timeLimit
      : null
  );

  // useEffect(() => {
  //   if (!isQuizTimer) return;
  //   if (!Number.isFinite(timeLimit)) return;

  //   setQuizRemainingTime(timeLimit);
  // }, [isQuizTimer, timeLimit]);

  

  useEffect(() => {
    if (!isQuizTimer) return;
    if (!Number.isFinite(quizRemainingTime)) return;

    if (quizRemainingTime <= 0) {
      socket.emit("force_submit", { activitySessionId });
      socket.emit("end_quiz", { activitySessionId });
      return;
    }

    const id = setInterval(() => {
      setQuizRemainingTime(t => (Number.isFinite(t) ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [quizRemainingTime, isQuizTimer]);


  console.log({
    timerType,
    timeLimit,
    quizRemainingTime
  });

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
      console.log("📥 student_result received:", sid, scoreForThis, totalScore);

      if (Number(sid) !== Number(studentId)) return;

      setPointForThis(scoreForThis);
      setCurrentPoint(totalScore);
    };

    socket.on("student_result", handler);
    return () => socket.off("student_result", handler);
  }, [studentId]);


  useEffect(() => {
    socket.on("my_rank_update", ({ rank }) => {
      setRank(rank);
    });

    return () => socket.off("my_rank_update");
  }, []);



/* ================= Quiz Ended ================= */
  useEffect(() => {
    const handleQuizEnd = () => {
      console.log("🟢 quiz_ended received (student)");
      setQuizEnded(true);
    };

    socket.on("quiz_ended", handleQuizEnd);
    return () => socket.off("quiz_ended", handleQuizEnd);
  }, []);

  useEffect(() => {
    if (!quizEnded) return;

    navigate(
      `/class/${joinCode}/lobby/quiz/${activitySessionId}/end`,
      {
        state: { activitySessionId, studentId }
      }
    );

  }, [quizEnded, navigate, activitySessionId, studentId]);


  //refresh
  useEffect(() => {
    if (!question) return;

    socket.emit("check_answer_status", {
      activitySessionId,
      questionId: question.Question_ID,
      studentId,
      questionType: question.Question_Type
    });


    const handler = ({
      alreadyAnswered,
      isCorrect,
      scoreForThis,
      totalScore,
      timeSpent,
      rank
    }) => {

      if (alreadyAnswered) {
        setIsCorrect(isCorrect);
        setPointForThis(scoreForThis);
        setCurrentPoint(totalScore);
        setLastTimeSpent(timeSpent);
        setRank(rank);
        setLocalPhase("solution");
      }
    };



    socket.on("answer_status", handler);

    return () => socket.off("answer_status", handler);

  }, [questionIndex]);


  /* ================= ACTION ================= */

  const submitAnswer = ({ selectedIds, timeSpent,questionType }) => {
    setLastTimeSpent(timeSpent);

    console.log(studentId)

    socket.emit("submit_answer", {
      activitySessionId,
      quizId,
      questionId: question.Question_ID,
      studentId,
      questionType,
      choiceIds: selectedIds,
      timeSpent,
      currentQuestionIndex: questionIndex + 1,   // ✅ เพิ่ม
      totalQuestions,  
    });
  };

  const goNextQuestion = () => {
    if (questionIndex + 1 < questions.length
    ) {
      setQuestionIndex(i => i + 1);
      setLocalPhase("question");
      setIsCorrect(null);
    } else {
      console.log("🎉 Quiz finished");
      setQuizEnded(true);
    }
  };

  /* ================= RENDER: LOADING ================= */

  if (!questions.length) {
    return <div className="p-10 text-center">Loading quiz...</div>;
  }

  /* ================= RENDER: SOLUTION ================= */

  if (localPhase === "solution") {
    return (
      <AnswerResultPage
        isTeacherPaced={isTeacherPaced}
        isCorrect={isCorrect}
        pointForThis={pointForThis}
        currentPoint={currentPoint}
        timeSpent={lastTimeSpent}
        rank={rank}
        username="Aka"
        showNext={!isTeacherPaced}
        onNext={goNextQuestion}
        isLastQuestion={isLastQuestion}
        isQuizTimer={timerType === "quiz"}
        quizRemainingTime={quizRemainingTime}
      />
    );
  }

  if (!question) {
    return <div className="p-10 text-center">No question</div>;
  }
  /* ================= RENDER: QUESTION ================= */

  if (question.Question_Type === "single") {
    return (
      <OneAnsQuizPage
        question={question}
        // timeLimit={
        //   timerType === "quiz" ? quizRemainingTime : timeLimit
        // }
        timeLimit={
          isQuizTimer
            ? quizRemainingTime
            : isQuestionTimer
              ? timeLimit
              : null
        }
        isQuizTimer={timerType === "quiz"}
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        // onSubmit={(selectedIds, timeSpent) =>
        //   submitAnswer({ selectedIds, timeSpent })
        // }
        onSubmit={(selectedIds, timeSpent) =>
          submitAnswer({
            selectedIds,
            timeSpent,
            questionType: "single",   // หรือ "multiple"
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
        isQuizTimer={timerType === "quiz"}
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        // onSubmit={(selectedIds, timeSpent) =>
        //   submitAnswer({ selectedIds, timeSpent })
        // }
        onSubmit={(selectedIds, timeSpent) =>
          submitAnswer({
            selectedIds,
            timeSpent,
            questionType: "multiple",   // หรือ "multiple"
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
        // timeLimit={
        //   timerType === "quiz" ? quizRemainingTime : timeLimit
        // }
        timeLimit={
          isQuizTimer
            ? quizRemainingTime
            : isQuestionTimer
              ? timeLimit
              : null
        }
        onNext={(orderedAnswers,actualTimeSpent) => {
          // orderedAnswers = [{ optionId, order }, ...]
          submitAnswer({
            selectedIds: orderedAnswers,
            timeSpent: actualTimeSpent,
            questionType: "ordering", 
          });
        }}
        onTimeUp={(orderedAnswers, actualTimeSpent) => {
          submitAnswer({
            selectedIds: orderedAnswers,
            timeSpent: actualTimeSpent,
            questionType: "ordering",
          });
      }}
      />
    );
  }



  return <div>Unsupported question type</div>;
}

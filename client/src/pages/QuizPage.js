import { useLocation } from "react-router-dom";
import { useState } from "react";
import { socket } from "../socket";

import OneAnsQuizPage from "./OneAnsQuizPage";
import MultiAnsQuizPage from "./MultiAnsQuizPage";

export default function QuizPage() {
  const { state } = useLocation();

  const [questionIndex, setQuestionIndex] = useState(0);

  // 🛡 guard
  if (!state || !state.questions) {
    return <div className="p-10 text-center">Loading quiz...</div>;
  }

  const {
    questions,
    totalQuestions,
    timeLimit,
    activitySessionId,
  } = state;

  const question = questions[questionIndex];

  const goNext = (selectedIds) => {
    // (optional) ส่งคำตอบไว้เฉย ๆ ก่อน
    socket.emit("submit_answer", {
      activitySessionId,
      questionId: question.Question_ID,
      selectedOptionIds: selectedIds,
    });

    // 👉 ไปข้อถัดไปทันที
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((i) => i + 1);
    } else {
      console.log("🎉 Quiz finished");
      // TODO: ไปหน้า summary / finished
    }
  };

  /* ================= QUESTION PAGE ================= */

  if (question.Question_Type === "single") {
    return (
      <OneAnsQuizPage
        question={question}
        timeLimit={timeLimit}
        timerType={state.timerType} 
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        onSubmit={(selectedIds) => goNext(selectedIds)}
      />
    );
  }

  if (question.Question_Type === "multiple") {
    return (
      <MultiAnsQuizPage
        question={question}
        timeLimit={timeLimit}
        currentQuestion={questionIndex + 1}
        totalQuestions={totalQuestions}
        onSubmit={(selectedIds) => goNext(selectedIds)}
      />
    );
  }

  return <div>Unsupported question type</div>;
}

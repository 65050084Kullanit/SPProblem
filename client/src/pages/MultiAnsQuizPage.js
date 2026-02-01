import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { socket } from "../socket";

function MultiAnsQuizPage({
  question,
  timeLimit,
  currentQuestion,
  totalQuestions,
  onSubmit,
}) {
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [timer, setTimer] = useState(timeLimit);
  const [locked, setLocked] = useState(false);

  /* ⏱ TIMER */
  useEffect(() => {
    if (!timeLimit) return;
    if (locked) return;

    if (timer <= 0) {
      autoSubmit();
      return;
    }

    const i = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(i);
  }, [timer, locked, timeLimit]);

  /* 🔄 RESET เมื่อเปลี่ยนคำถาม */
  useEffect(() => {
    setTimer(timeLimit);
    setLocked(false);
    setSelectedChoices([]);
  }, [question.Question_ID, timeLimit]);

  /* 👩‍🏫 ครูกดตัดข้อ */
  useEffect(() => {
    socket.on("force_submit", autoSubmit);
    return () => socket.off("force_submit", autoSubmit);
  }, []);

  const toggle = (id) => {
    if (locked) return;

    setSelectedChoices((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const autoSubmit = () => {
    if (locked) return;

    setLocked(true);
    onSubmit(selectedChoices); // ✅ ส่ง array ตรง ๆ
  };

  useEffect(() => {
    socket.on("force_submit", () => {
      autoSubmit();   // 🔥 ตัดจบข้อทันที
    });

    return () => socket.off("force_submit");
  }, []);


  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
      <Navbar />

      <div className="bg-gray-300 px-6 py-2 rounded-xl self-end">
        Now Question {currentQuestion}/{totalQuestions}
      </div>

      <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg">
        {question.Question_Text}
      </div>

      <div className="w-11/12 space-y-3 mt-4">
        {question.choices.map((c) => (
          <button
            key={c.Option_ID}
            onClick={() => toggle(c.Option_ID)}
            disabled={locked}
            className={`w-full py-4 rounded-2xl transition ${
              selectedChoices.includes(c.Option_ID)
                ? "bg-green-300"
                : "bg-gray-300"
            } ${locked ? "opacity-50" : ""}`}
          >
            {c.Option_Text}
          </button>
        ))}
      </div>

      <div className="w-11/12 flex justify-between mt-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-gray-300">
          {timer}s
        </div>

        <button
          disabled={locked || selectedChoices.length === 0}
          onClick={autoSubmit}
          className="bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MultiAnsQuizPage;

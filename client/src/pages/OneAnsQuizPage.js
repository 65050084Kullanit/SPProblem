import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Maximize2 } from "lucide-react";
import { socket } from "../socket";

function OneAnsQuizPage({
  question,
  timeLimit,
  timerType,
  currentQuestion,
  totalQuestions,
  onSubmit,
}) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timer, setTimer] = useState(timeLimit);
  const [locked, setLocked] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!timeLimit) return;
    if (locked) return;

    if (timer <= 0) {
      autoSubmit();
      return;
    }

    const i = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(i);
  }, [timer, locked]);



  useEffect(() => {
    setTimer(timeLimit);
    setLocked(false);
  }, [question.Question_ID, timeLimit]);


  const autoSubmit = () => {
    if (locked) return;

    setLocked(true);

    onSubmit(
      selectedChoice !== null ? [selectedChoice] : []
    );
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

      <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg mt-4">
        {question.Question_Text}
      </div>

      {question.Question_Image && (
        <div className="w-[300px] h-[300px] bg-gray-300 mt-4 relative rounded-lg">
          <img
            src={question.Question_Image}
            className="w-full h-full object-contain"
            alt=""
          />
          <button
            onClick={() => setShowImage(true)}
            className="absolute bottom-2 right-2 bg-black text-white p-1 rounded"
          >
            <Maximize2 />
          </button>
        </div>
      )}

      <div className="w-11/12 space-y-3 mt-6">
        {question.choices.map((c) => (
          <button
            key={c.Option_ID}
            onClick={() => setSelectedChoice(c.Option_ID)}
            className={`w-full py-4 rounded-2xl ${
              selectedChoice === c.Option_ID
                ? "bg-gray-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {c.Option_Text}
          </button>
        ))}
      </div>

      <div className="w-11/12 flex justify-between mt-10">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
          {timer}s
        </div>

        <button
          disabled={locked || selectedChoice === null}
          onClick={autoSubmit}
          className="bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setShowImage(false)}
        >
          <img
            src={question.Question_Image}
            className="max-w-[90%] max-h-[90%]"
            alt=""
          />
        </div>
      )}
    </div>
  );
}

export default OneAnsQuizPage;

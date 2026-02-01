import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Maximize2 } from "lucide-react";
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";


function OneAnsQuizPage() {
  const [currentQuestion] = useState(25);
  const [totalQuestions] = useState(30);
  // const [choices] = useState(["choice 1", "choice 2", "choice 3", "choice 4"]);

  const [showImage, setShowImage] = useState(false); // เปิดปิด modal
  // const [selectedChoice, setSelectedChoice] = useState(null); // เก็บ choice ที่เลือก
  // const [timer, setTimer] = useState(30); // ตัวนับเวลาเริ่มต้น 30 วินาที

  const location = useLocation();
  const navigate = useNavigate();
  const {
    activitySessionId,
    timerType,
    timeLimit
  } = location.state || {};

  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [timer, setTimer] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);

  //ฟัง question_started
  useEffect(() => {
    socket.on("question_started", (payload) => {
      console.log("📝 question_started", payload);

      setQuestion(payload.question);
      setChoices(payload.question.choices);
      setSelectedChoice(null);

      if (timerType !== "teacher") {
        setTimer(payload.timeLimit);
      }
    });

    return () => socket.off("question_started");
  }, [timerType]);


  // ใช้ useEffect สำหรับนับถอยหลัง
  useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) {
      handleSubmit();
      return; // ถ้าเวลาถึง 0 หยุด interval
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component unmount
  }, [timer]);

  const handleSubmit = () => {
    socket.emit("submit_answer", {
      activitySessionId,
      questionId: question.Question_ID,
      selectedOptionIds: selectedChoice !== null ? [selectedChoice] : []
    });

    navigate("/answer-result");
  };


  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-6 pt-[80px]">
      <Navbar />

      {/* Progress Box */}
      <div className="bg-gray-300 px-6 py-2 rounded-xl shadow mb-6 self-end">
        <p className="font-medium">
          Now Question {currentQuestion}/{totalQuestions}
        </p>
      </div>

      {/* Question */}
      <div className="w-11/12 bg-gray-300 py-10 text-center font-semibold text-xl rounded-lg mb-4">
        {question?.Question_Text}
      </div>

      {/* Picture Box */}
      <div className="w-[300px] h-[300px] bg-gray-300 flex flex-col items-center justify-center rounded-lg mb-4 relative">
        <img
          src="/assets/question.png"
          alt="question image"
          className="w-full h-full object-contain"
        />

        {/* ปุ่มดูรูปใหญ่ */}
        <button
          onClick={() => setShowImage(true)}
          className="bg-black text-white px-4 py-1 rounded-lg absolute bottom-2 right-2 text-sm opacity-80 hover:opacity-100"
        >
          <Maximize2 className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Choose text */}
      <p className="text-gray-700 mb-3">choose 1 choice</p>

      {/* Choices */}
      <div className="w-11/12 space-y-3">
        {choices.map((c) => (
          <button
            key={c.Option_ID}
            onClick={() => setSelectedChoice(c.Option_ID)}
            className={`w-full py-4 rounded-2xl font-medium ${
              selectedChoice === c.Option_ID
                ? "bg-gray-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {c.Option_Text}
          </button>
        ))}

      </div>

      {/* Footer */}
      <div className="w-11/12 flex justify-between items-center mt-10">
        <div className="flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
              timer <= 5 ? "bg-red-400 text-white" : "bg-gray-300"
            }`}
          >
            {timer}s
          </div>
        </div>

        <button 
        onClick={handleSubmit}
        className="bg-gray-400 text-white px-10 py-3 rounded-2xl text-lg hover:bg-gray-500">
          Next
        </button>
      </div>

      {/* ⭐ FULLSCREEN IMAGE MODAL ⭐ */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setShowImage(false)}
        >
          <img
            src="/assets/question.png"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
            alt="full"
          />
        </div>
      )}
    </div>
  );
}

export default OneAnsQuizPage;

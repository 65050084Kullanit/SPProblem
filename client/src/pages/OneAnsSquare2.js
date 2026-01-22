import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Maximize2 } from "lucide-react";

function OneAnsSquare2() {
  const [currentQuestion] = useState(25);
  const [totalQuestions] = useState(30);
  const [choices] = useState([
    "กินข้าว แล้วหรือยังคะ แล้วหรือยังคะ แล้วหรือยังคะแล้วหรือยังคะ",
    "กินปลา แล้วหรือยังคะ แล้วหรือยังคะแล้วหรือยังคะแล้วหรือยังคะ ",
    "ไม่หิว แล้วหรือยังคะ",
    "กินขนมแล้วหรือยังคะ",
  ]);

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ⭐ กำหนดจำนวน column ตามจำนวน choice
  const getGridCols = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2"; // 2 + 2
    if (count === 5 || count === 6) return "grid-cols-3";
    return "grid-cols-4"; // 7
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-6 pt-[80px]">
      <Navbar />

      {/* Progress */}
      <div className="bg-gray-300 px-6 py-2 rounded-xl shadow mb-6 self-end">
        Now Question {currentQuestion}/{totalQuestions}
      </div>

      {/* Question */}
      <div className="w-11/12 bg-gray-300 py-10 text-center font-semibold text-xl rounded-lg mb-4">
        question ในปี พ.ศ. 2566 ประเทศไทยได้มีการปรับปรุงกฎหมายด้านสิ่งแวดล้อมหลายฉบับเพื่อส่งเสริมการลดการใช้พลาสติก แต่ผลกระทบต่อเศรษฐกิจในภาคอุตสาหกรรมจะเป็นอย่างไร?
      </div>

      {/* Image */}
      <div className="w-[300px] h-[300px] bg-gray-300 rounded-lg mb-4 relative">
        <img
          src="/assets/question.png"
          alt="question"
          className="w-full h-full object-contain"
        />
        <button
          onClick={() => setShowImage(true)}
          className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-lg"
        >
          <Maximize2 />
        </button>
      </div>

      <p className="text-gray-700 mb-3">choose 1 choice</p>

      {/* ⭐ Choices */}
      <div
        className={`
          w-11/12
          grid
          ${getGridCols(choices.length)}
          gap-4
          items-stretch
          auto-rows-fr
        `}
      >
        {choices.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedChoice(idx)}
            className={`
              h-full
              min-h-[120px]
              px-6 py-5
              flex items-center justify-center
              text-center
              rounded-2xl
              font-medium
              text-base md:text-lg
              leading-relaxed
              transition-all duration-200
              ${
                selectedChoice === idx
                  ? "bg-gray-500 text-white scale-[1.03]"
                  : "bg-gray-300 hover:bg-gray-400"
              }
            `}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="w-11/12 flex justify-between items-center mt-10">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
            timer <= 5 ? "bg-red-400 text-white" : "bg-gray-300"
          }`}
        >
          {timer}s
        </div>

        <button className="bg-gray-400 text-white px-10 py-3 rounded-2xl text-lg">
          Next
        </button>
      </div>

      {/* Fullscreen Image */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowImage(false)}
        >
          <img
            src="/assets/question.png"
            className="max-w-[90%] max-h-[90%]"
            alt="full"
          />
        </div>
      )}
    </div>
  );
}

export default OneAnsSquare2;

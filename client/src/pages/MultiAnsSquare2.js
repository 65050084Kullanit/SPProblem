import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Maximize2 } from "lucide-react";

function MultiAnsSquare2() {
  const [currentQuestion] = useState(12);
  const [totalQuestions] = useState(30);
  const [timer, setTimer] = useState(45);

  const [choices] = useState([
    "ในปี พ.ศ. 2566 ประเทศไทยได้มีการปรับปรุงกฎหมายด้านสิ่งแวดล้อมหลายฉบับเพื่อส่งเสริมการลดการใช้พลาสติก แต่ผลกระทบต่อเศรษฐกิจในภาคอุตสาหกรรมจะเป็นอย่างไร",
    "choice 2",
    "choice 3",
    "choice 4",
    "choice 5",
  ]);

  const [selectedChoices, setSelectedChoices] = useState([]);
  const [showImage, setShowImage] = useState(false);

  const toggleChoice = (index) => {
    if (selectedChoices.includes(index)) {
      setSelectedChoices(selectedChoices.filter((i) => i !== index));
    } else {
      setSelectedChoices([...selectedChoices, index]);
    }
  };

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
          className="w-full h-full object-contain"
          alt="question"
        />
        <button
          onClick={() => setShowImage(true)}
          className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-lg"
        >
          <Maximize2 />
        </button>
      </div>

      <p className="text-gray-700 mb-3">select all correct choices</p>

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
        {choices.map((c, idx) => {
          const isSelected = selectedChoices.includes(idx);

          return (
            <button
              key={idx}
              onClick={() => toggleChoice(idx)}
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
                  isSelected
                    ? "bg-green-300 border border-green-600 scale-[1.03]"
                    : "bg-gray-300 hover:bg-gray-400"
                }
              `}
            >
              {c}
            </button>
          );
        })}
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

        <button
          onClick={() => console.log("ส่งคำตอบ:", selectedChoices)}
          disabled={timer <= 0}
          className={`bg-gray-400 text-white px-10 py-3 rounded-2xl text-lg ${
            timer <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
          }`}
        >
          Next
        </button>
      </div>

      {/* Fullscreen Image */}
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

export default MultiAnsSquare2;

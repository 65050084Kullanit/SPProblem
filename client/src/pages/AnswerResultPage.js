// import { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import { Crown } from "lucide-react";

// // function AnswerResultPage() {
// //   // mock data
// //   const isCorrect = true; // true = ถูก, false = ผิด
// //   const pointForThis = 87;

// //   const currentPoint = 120;         // คะแนนก่อนตอบ
// //   const newPoint = isCorrect ? currentPoint + pointForThis : currentPoint;

// //   const [displayPoint, setDisplayPoint] = useState(currentPoint);

// //   useEffect(() => {
// //     if (!isCorrect) {
// //       // ❌ ผิด → ไม่ต้องวิ่ง
// //       setDisplayPoint(currentPoint);
// //       return;
// //     }

// //     // ✔ ถูก → ให้ตัวเลขวิ่งจาก currentPoint → newPoint
// //     let start = currentPoint;
// //     const end = newPoint;
// //     const duration = 800; 
// //     const increment = Math.ceil(pointForThis / (duration / 16)); 

// //     const counter = setInterval(() => {
// //       start += increment;
// //       if (start >= end) {
// //         start = end;
// //         clearInterval(counter);
// //       }
// //       setDisplayPoint(start);
// //     }, 16);

// //     return () => clearInterval(counter);
// //   }, [isCorrect, pointForThis, currentPoint, newPoint]);


// //   return (
// //     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
// //       <Navbar />

// //       <h1 className="text-3xl font-bold mt-6">Answer</h1>

// //       {/* Circle with effect */}
// //       <div
// //         className={`
// //           w-[220px] h-[220px] rounded-full mt-4 flex items-center justify-center relative
// //           transition-all duration-300
// //           ${
// //             isCorrect
// //               ? "bg-green-400 shadow-[0_0_25px_6px_rgba(0,255,0,0.5)] animate-shake"
// //               : "bg-red-400 animate-shake"
// //           }
// //         `}
// //       >
// //         <p className="text-5xl font-bold">{isCorrect ? "✔" : "✖"}</p>
// //       </div>

// //       {/* Point */}
// //       <h2 className="text-3xl font-bold mt-10">Point</h2>
// //       <p className="text-xl mt-2">
// //         correct answer : <span className="font-bold">{pointForThis}</span>
// //       </p>

// //       {/* Current point */}
// //       <h2 className="text-3xl font-bold mt-10">current point</h2>
// //       <p className="text-4xl mt-1 font-semibold transition-all duration-500">
// //         {displayPoint}
// //       </p>

// //       {/* Avatar + bouncing crown */}
// //       <div className="w-[220px] h-[220px] bg-gray-300 rounded-full mt-10 flex items-center justify-center relative">
// //         <Crown className="w-14 h-14 absolute -top-6 left-6 text-black animate-bounce" />
// //       </div>

// //       <p className="text-xl mt-4">Aka</p>

// //       <h2 className="text-3xl font-bold mt-6">rank</h2>
// //       <div className="flex items-center gap-2 mt-1">
// //         <Crown className="w-6 h-6" />
// //         <p className="text-xl font-medium">on podium</p>
// //       </div>

// //       <button className="
// //         mt-10 bg-gray-800 text-white px-14 py-3 rounded-2xl text-lg
// //         hover:bg-black transition-all duration-300 active:scale-95
// //       ">
// //         Next
// //       </button>
// //     </div>
// //   );
// // }

// // export default AnswerResultPage;
// function AnswerResultPage({
//   isCorrect,
//   pointForThis,
//   currentPoint,
//   onNext
// }) {
//   const newPoint = isCorrect ? currentPoint + pointForThis : currentPoint;
//   const [displayPoint, setDisplayPoint] = useState(currentPoint);

//   useEffect(() => {
//     if (!isCorrect) return;

//     let start = currentPoint;
//     const end = newPoint;
//     const duration = 800;
//     const increment = Math.ceil(pointForThis / (duration / 16));

//     const counter = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         start = end;
//         clearInterval(counter);
//       }
//       setDisplayPoint(start);
//     }, 16);

//     return () => clearInterval(counter);
//   }, [isCorrect, pointForThis, currentPoint, newPoint]);

//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
//       <Navbar />

//       <h1 className="text-3xl font-bold mt-6">Answer</h1>

//       <div
//         className={`w-[220px] h-[220px] rounded-full mt-4 flex items-center justify-center
//           ${isCorrect ? "bg-green-400" : "bg-red-400"}`}
//       >
//         <p className="text-5xl font-bold">{isCorrect ? "✔" : "✖"}</p>
//       </div>

//       <h2 className="text-3xl font-bold mt-10">Point</h2>
//       <p className="text-xl mt-2">
//         correct answer : <b>{pointForThis}</b>
//       </p>

//       <h2 className="text-3xl font-bold mt-10">current point</h2>
//       <p className="text-4xl mt-1 font-semibold">{displayPoint}</p>

//       {/* <button
//         onClick={onNext}
//         className="mt-10 bg-gray-800 text-white px-14 py-3 rounded-2xl text-lg"
//       >
//         Next
//       </button> */}
//     </div>
//   );
// }

// export default AnswerResultPage;




import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Crown } from "lucide-react";

function AnswerResultPage({
  isCorrect,
  pointForThis,
  currentPoint,
  timeSpent,       // 👈 เวลา (วินาที)
  rank = null,     // (optional) อันดับ
  username = "You", // (optional) ชื่อ
  showNext = false,
  onNext,
  isLastQuestion = false,
  // ✅ เพิ่มสองบรรทัดนี้
  isQuizTimer = false,
  quizRemainingTime = null,

}) {
  const newPoint = isCorrect ? currentPoint + pointForThis : currentPoint;
  const [displayPoint, setDisplayPoint] = useState(currentPoint);

  console.log("AnswerResultPage props:", {
    isQuizTimer,
    quizRemainingTime,
  });

  /* 🎯 animate คะแนน */
  useEffect(() => {
    if (!isCorrect) {
      setDisplayPoint(currentPoint);
      return;
    }

    let start = currentPoint;
    const end = newPoint;
    const duration = 800;
    const increment = Math.ceil(pointForThis / (duration / 16));

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayPoint(start);
    }, 16);

    return () => clearInterval(counter);
  }, [isCorrect, pointForThis, currentPoint, newPoint]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px] pb-16">
      <Navbar />

      {isQuizTimer && Number.isFinite(quizRemainingTime) && (
        <div
          className={`
            px-4 py-2 rounded-full text-lg font-bold
            ${quizRemainingTime < 5
              ? "bg-red-500 text-white animate-pulse"
              : quizRemainingTime <= 15
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-white"}
          `}
        >
          ⏱ {quizRemainingTime}s
        </div>
      )}


      <h1 className="text-3xl font-bold mt-6">Answer</h1>

      {/* Circle with effect */}
      <div
        className={`
          w-[220px] h-[220px] rounded-full mt-4 flex items-center justify-center relative
          transition-all duration-300
          ${
            isCorrect
              ? "bg-green-400 shadow-[0_0_25px_6px_rgba(0,255,0,0.5)] animate-shake"
              : "bg-red-400 animate-shake"
          }
        `}
      >
        <p className="text-5xl font-bold">
          {isCorrect ? "✔" : "✖"}
        </p>
      </div>

      {/* Point */}
      <h2 className="text-3xl font-bold mt-10">Point</h2>
      <p className="text-xl mt-2">
        correct answer : <span className="font-bold">{pointForThis}</span>
      </p>

      {/* Time spent */}
      <h2 className="text-3xl font-bold mt-8">Time</h2>
      <p className="text-xl mt-1">
        used time : <span className="font-bold">{timeSpent}s</span>
      </p>

      {/* Current point */}
      <h2 className="text-3xl font-bold mt-10">current point</h2>
      <p className="text-4xl mt-1 font-semibold transition-all duration-500">
        {displayPoint}
      </p>

      {/* Avatar + bouncing crown */}
      <div className="w-[220px] h-[220px] bg-gray-300 rounded-full mt-10 flex items-center justify-center relative">
        <Crown className="w-14 h-14 absolute -top-6 left-6 text-black animate-bounce" />
      </div>

      <p className="text-xl mt-4">{username}</p>

      {/* Rank */}
      <h2 className="text-3xl font-bold mt-6">rank</h2>
      <div className="flex items-center gap-2 mt-1">
        <Crown className="w-6 h-6" />
        <p className="text-xl font-medium">
          {rank ? `#${rank}` : "1st place"}
        </p>
      </div>

      {/* Action */}
      {showNext ? (
        <button
          onClick={onNext}
          className="
            mt-10 bg-gray-800 text-white px-14 py-3 rounded-2xl text-lg
            hover:bg-black transition-all duration-300 active:scale-95
          "
        >
          {isLastQuestion ? "Finish" : "Next"}
        </button>
      ) : (
        <p className="mt-10 text-gray-500 italic">
          Waiting for teacher to continue…
        </p>
      )}
    </div>
  );
}

export default AnswerResultPage;

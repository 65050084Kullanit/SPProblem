// import { useEffect, useState } from "react";
// import Navbar from "../Navbar";
// import { Maximize2 } from "lucide-react";
// import { socket } from "../socket";

// function OneAnsQuizPage({
//   question,
//   timeLimit,
//   currentQuestion,
//   totalQuestions,
//   onSubmit,
// }) {
//   const [selectedChoice, setSelectedChoice] = useState(null);
//   const [timer, setTimer] = useState(
//     typeof timeLimit === "number" ? timeLimit : 0
//   );

//   const [locked, setLocked] = useState(false);
//   const [showImage, setShowImage] = useState(false);
//   const [startTime, setStartTime] = useState(Date.now());


//   /* ⏱ reset เมื่อเปลี่ยนข้อ */
//   useEffect(() => {
//     setTimer(timeLimit);
//     setLocked(false);
//     setSelectedChoice(null);
//     setStartTime(Date.now());
//   }, [question.Question_ID, timeLimit]);

//   /* ⏱ timer */
//   useEffect(() => {
//     if (!timeLimit || locked) return;

//     if (timer <= 0) {
//       autoSubmit();
//       return;
//     }

//     const i = setInterval(() => {
//       setTimer(t => t - 1);
//     }, 1000);

//     return () => clearInterval(i);
//   }, [timer, locked, timeLimit]);

//   /* 👩‍🏫 ครู force submit */
//   useEffect(() => {
//     socket.on("force_submit", autoSubmit);
//     return () => socket.off("force_submit", autoSubmit);
//   }, [locked, selectedChoice]);

//   const autoSubmit = () => {
//     if (locked) return;
//     setLocked(true);

//     const timeSpent = Math.floor((Date.now() - startTime) / 1000);
//     onSubmit(
//       selectedChoice !== null ? [selectedChoice] : [],
//       timeSpent
//     );
//   };


//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
//       <Navbar />

//       <div className="bg-gray-300 px-6 py-2 rounded-xl self-end">
//         Now Question {currentQuestion}/{totalQuestions}
//       </div>

//       <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg mt-4">
//         {question.Question_Text}
//       </div>

//       {question.Question_Image && (
//         <div className="w-[300px] h-[300px] bg-gray-300 mt-4 relative rounded-lg">
//           <img
//             src={question.Question_Image}
//             className="w-full h-full object-contain"
//             alt=""
//           />
//           <button
//             onClick={() => setShowImage(true)}
//             className="absolute bottom-2 right-2 bg-black text-white p-1 rounded"
//           >
//             <Maximize2 />
//           </button>
//         </div>
//       )}

//       <div className="w-11/12 space-y-3 mt-6">
//         {question.choices.map((c) => (
//           <button
//             key={c.Option_ID}
//             onClick={() => setSelectedChoice(c.Option_ID)}
//             className={`w-full py-4 rounded-2xl ${
//               selectedChoice === c.Option_ID
//                 ? "bg-gray-500 text-white"
//                 : "bg-gray-300"
//             }`}
//           >
//             {c.Option_Text}
//           </button>
//         ))}
//       </div>

//       <div className="w-11/12 flex justify-between mt-10">
//         <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
//           {timer}s
//         </div>

//         <button
//           disabled={locked || selectedChoice === null}
//           onClick={autoSubmit}
//           className="bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {showImage && (
//         <div
//           className="fixed inset-0 bg-black/80 flex items-center justify-center"
//           onClick={() => setShowImage(false)}
//         >
//           <img
//             src={question.Question_Image}
//             className="max-w-[90%] max-h-[90%]"
//             alt=""
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default OneAnsQuizPage;

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Maximize2 } from "lucide-react";
import { socket } from "../socket";

function OneAnsQuizPage({
  question,
  timeLimit,
  isQuizTimer,
  currentQuestion,
  totalQuestions,
  onSubmit,
}) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timer, setTimer] = useState(() =>
    Number.isFinite(timeLimit) ? timeLimit : null
  );


  const [locked, setLocked] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());


  /* ⏱ reset เมื่อเปลี่ยนข้อ (เฉพาะที่ไม่ใช่ quiztimer)*/
  useEffect(() => {
    if (isQuizTimer) return;   // ❗ ห้าม reset
    //  if (typeof timeLimit !== "number" || Number.isNaN(timeLimit)) return;
    setTimer(timeLimit);
    setLocked(false);
    setSelectedChoice(null);
    setStartTime(Date.now());
  }, [question.Question_ID]);

  //countdown (เฉพาะที่ไม่ใช่ quiztimer)
  useEffect(() => {
    if (isQuizTimer) return;
    if (locked) return;
    if (!Number.isFinite(timer)) return;

    if (timer <= 0) {
      autoSubmit();
      return;
    }

    const i = setInterval(() => {
      setTimer(t => (Number.isFinite(t) ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(i);
  }, [timer, locked, isQuizTimer]);

  //sync Quiz Timer (แสดงอย่างเดียว)
  useEffect(() => {
    if (!isQuizTimer) return;
    if (!Number.isFinite(timeLimit)) return;

    setTimer(timeLimit);
  }, [timeLimit, isQuizTimer]);



  /* 👩‍🏫 ครู force submit */
  useEffect(() => {
    socket.on("force_submit", autoSubmit);
    return () => socket.off("force_submit", autoSubmit);
  }, [locked, selectedChoice]);

  const autoSubmit = () => {
    if (locked) return;
    setLocked(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(
      selectedChoice !== null ? [selectedChoice] : [],
      timeSpent
    );
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "";

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };



  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
      <Navbar />

      <div className="bg-gray-300 px-6 py-2 rounded-xl self-end">
        Now Question {currentQuestion}/{totalQuestions}
      </div>

      <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg mt-4">
        {question.Question_Text}
      </div>

      {/* Choose text */}
      <p className="text-gray-700 mb-3">choose 1 choice</p>

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
            // onClick={() => setSelectedChoice(c.Option_ID)}
            onClick={() => {
              if (locked) return;

              setSelectedChoice(c.Option_ID);

              const timeSpent = Math.floor((Date.now() - startTime) / 1000);
              setLocked(true);

              onSubmit([c.Option_ID], timeSpent);
            }}

            className={`w-full py-4 rounded-2xl ${selectedChoice === c.Option_ID
                ? "bg-gray-500 text-white"
                : "bg-gray-300"
              }`}
          >
            {c.Option_Text}
          </button>
        ))}
      </div>

      <div className="w-11/12 grid grid-cols-3 items-center mt-10">
  
        {/* ซ้าย */}
        <div>
          {Number.isFinite(timer) && (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
              {formatTime(timer)}
            </div>
          )}
        </div>

        {/* กลาง (เว้นที่ไว้เสมอ) */}
        <div></div>

        {/* ขวา */}
        {/* <div className="flex justify-end">
          <button
            disabled={locked || selectedChoice === null}
            onClick={autoSubmit}
            className="w-72 bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
          >
            Next
          </button>
        </div> */}

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
// import { useState, useEffect } from "react";
// import Navbar from "../Navbar";
// import { socket } from "../socket";

// function MultiAnsQuizPage({
//   question,
//   timeLimit,
//   currentQuestion,
//   totalQuestions,
//   onSubmit,
// }) {
//   const [selectedChoices, setSelectedChoices] = useState([]);
//   const [timer, setTimer] = useState(
//     typeof timeLimit === "number" ? timeLimit : 0
//   );

//   const [locked, setLocked] = useState(false);
//   const [startTime, setStartTime] = useState(Date.now());

//   useEffect(() => {
//     setStartTime(Date.now());
//   }, [question.Question_ID, timeLimit]);

//   const autoSubmit = () => {
//     if (locked) return;
//     setLocked(true);

//     const timeSpent = Math.floor((Date.now() - startTime) / 1000);
//     onSubmit(selectedChoices, timeSpent);
//   };

//   /* ⏱ TIMER */
//   useEffect(() => {
//     if (!timeLimit || locked) return;

//     if (timer <= 0) {
//       autoSubmit();
//       return;
//     }

//     const i = setInterval(() => {
//       setTimer((t) => t - 1);
//     }, 1000);

//     return () => clearInterval(i);
//   }, [timer, locked, timeLimit]);

//   /* 🔄 RESET เมื่อเปลี่ยนคำถาม */
//   useEffect(() => {
//     setTimer(timeLimit);
//     setLocked(false);
//     setSelectedChoices([]);
//   }, [question.Question_ID, timeLimit]);

//   /* 👩‍🏫 ครูกดตัดข้อ */
//   useEffect(() => {
//     socket.on("force_submit", autoSubmit);
//     return () => socket.off("force_submit", autoSubmit);
//   }, []);

//   const toggle = (id) => {
//     if (locked) return;

//     setSelectedChoices((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   return (
//     <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
//       <Navbar />

//       <div className="bg-gray-300 px-6 py-2 rounded-xl self-end">
//         Now Question {currentQuestion}/{totalQuestions}
//       </div>

//       <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg">
//         {question.Question_Text}
//       </div>

//       <div className="w-11/12 space-y-3 mt-4">
//         {question.choices.map((c) => (
//           <button
//             key={c.Option_ID}
//             onClick={() => toggle(c.Option_ID)}
//             disabled={locked}
//             className={`w-full py-4 rounded-2xl transition ${
//               selectedChoices.includes(c.Option_ID)
//                 ? "bg-green-300"
//                 : "bg-gray-300"
//             } ${locked ? "opacity-50" : ""}`}
//           >
//             {c.Option_Text}
//           </button>
//         ))}
//       </div>

//       <div className="w-11/12 flex justify-between mt-10">
//         <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-gray-300">
//           {timer}s
//         </div>

//         <button
//           disabled={locked || selectedChoices.length === 0}
//           onClick={autoSubmit}
//           className="bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MultiAnsQuizPage;




import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { socket } from "../socket";
import { Maximize2 } from "lucide-react";


function MultiAnsQuizPage({
  question,
  timeLimit,
  isQuizTimer,
  currentQuestion,
  totalQuestions,
  onSubmit,
}) {
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [timer, setTimer] = useState(() =>
    Number.isFinite(timeLimit) ? timeLimit : 0
  );

  const [locked, setLocked] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showImage, setShowImage] = useState(false);


  const autoSubmit = () => {
    if (locked) return;
    setLocked(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(selectedChoices, timeSpent);
  };

  /* ⏱ reset เมื่อเปลี่ยนข้อ (เฉพาะที่ไม่ใช่ quiztimer)*/
  useEffect(() => {
    if (isQuizTimer) return;   // ❗ ห้าม reset
    //  if (typeof timeLimit !== "number" || Number.isNaN(timeLimit)) return;
    setTimer(timeLimit);
    setLocked(false);
    setSelectedChoices([]);
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

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center pt-[80px]">
      <Navbar />

      <div className="bg-gray-300 px-6 py-2 rounded-xl self-end">
        Now Question {currentQuestion}/{totalQuestions}
      </div>

      <div className="w-11/12 bg-gray-300 py-10 text-center text-xl rounded-lg">
        {question.Question_Text}
      </div>

      {/* Choose text */}
      <p className="text-gray-700 mb-3">select all correct choices</p>



    {/* 🖼 Image (ถ้ามี) */}
      {question.Question_Image && (
        <div className="w-[300px] h-[300px] bg-gray-300 rounded-lg mb-4 relative">
          <img
            src={question.Question_Image}
            alt="question"
            className="w-full h-full object-contain"
          />

          <button
            onClick={() => setShowImage(true)}
            className="bg-black text-white px-3 py-1 rounded-lg absolute bottom-2 right-2 opacity-80"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Fullscreen Image */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setShowImage(false)}
        >
          <img
            src={question.Question_Image}
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
            alt="full"
          />
        </div>
      )}

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

      <div className="w-11/12 grid grid-cols-3 items-center mt-10">

        {/* ซ้าย */}
        <div>
          {!isQuizTimer && Number.isFinite(timer) && (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-gray-300">
              {timer}s
            </div>
          )}
        </div>

        {/* กลาง spacer */}
        <div></div>

        {/* ขวา */}
        <div className="flex justify-end">
          <button
            disabled={locked || selectedChoices.length === 0}
            onClick={autoSubmit}
            className="w-72 bg-gray-600 text-white px-10 py-3 rounded-2xl disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

    </div>
  );
}

export default MultiAnsQuizPage;

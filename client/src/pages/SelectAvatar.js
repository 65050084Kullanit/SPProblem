// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function SelectAvatar() {
//   const { code, studentId } = useParams();
//   const [name, setName] = useState("");
//   const navigate = useNavigate();

//   // เก็บ state ของ avatar ที่เลือก
//   const [selectedHat, setSelectedHat] = useState(null);
//   const [selectedFace, setSelectedFace] = useState(null);
//   const [selectedClothes, setSelectedClothes] = useState(null);

//   // state เก็บ category ปัจจุบัน
//   const [selectedCategory, setSelectedCategory] = useState("face");

//   // ตัวอย่าง asset (สมมติใช้ emoji แทนรูปจริง)
//   const hatOptions = ["🎩", "⛑️", "👒", "🧢", "👑"];
//   const faceOptions = ["😀", "😎", "🤓", "🥳", "😇"];
//   const clothesOptions = [
//     "👕", "🥼", "👔", "👗", "🧥", "👘", "🥻", "🦺", "🎽"
//   ];

//   const getOptions = () => {
//     switch (selectedCategory) {
//       case "hat":
//         return hatOptions;
//       case "clothes":
//         return clothesOptions;
//       default:
//         return faceOptions;
//     }
//   };

//   const handleSelect = (item) => {
//     if (selectedCategory === "hat") setSelectedHat(item);
//     if (selectedCategory === "face") setSelectedFace(item);
//     if (selectedCategory === "clothes") setSelectedClothes(item);
//   };

//   const handleConfirm = () => {
//     const finalName = name.trim() !== "" ? name : studentId;

//     // สร้าง object ของผู้เล่น
//     const playerData = {
//       code: code,
//       studentId: studentId,
//       stageName: finalName,
//       avatar: {
//         hat: selectedHat || null,
//         face: selectedFace || "👤",
//         clothes: selectedClothes || null,
//       },
//     };

//     // เปลี่ยนหน้าไป Lobby พร้อมส่ง state
//     navigate(`/class/${code}/lobby`, { state: { playerData } });
//   };

//   return (
//     <div className="flex-wrap flex flex-col items-center justify-center h-screen p-4">
//       <h1 className="text-base mb-6">Do you want to change a stage name?</h1>

//       {/* Input box */}
//       <input
//         type="text"
//         placeholder={studentId}
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="text-sm text-black w-[252px] h-[61px] px-4 py-2 placeholder-gray-700 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none mb-6"
//       />

//       {/* Avatar Preview */}
//         <div className="relative w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-4xl">
//         {/* Base face */}
//         <span className="absolute">{selectedFace || "👤"}</span>

//         {/* Hat (ซ้อนด้านบนหัว) */}
//         {selectedHat && (
//             <span className="absolute -top-2">{selectedHat}</span>
//         )}

//         {/* Clothes (ซ้อนด้านล่าง) */}
//         {selectedClothes && (
//             <span className="absolute bottom-0">{selectedClothes}</span>
//         )}
//         </div>

//       {/* Category Selectors */}
//       <div className="flex gap-4 mt-6">
//         <button
//             onClick={() => setSelectedCategory("hat")}
//             className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "hat" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//             🎩
//         </button>
//         <button
//             onClick={() => setSelectedCategory("face")}
//             className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "face" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//             😀
//         </button>
//         <button
//             onClick={() => setSelectedCategory("clothes")}
//             className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "clothes" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//             👕
//         </button>
//       </div>

//       {/* Options Grid */}
//       <div className="grid grid-cols-3 gap-3 mt-6 border p-4 rounded-lg mb-4">
//         {getOptions().map((item) => (
//           <div
//             key={item}
//             onClick={() => handleSelect(item)}
//             className={`w-[70px] h-[70px] rounded-full flex items-center justify-center text-2xl cursor-pointer
//               ${
//                 selectedHat === item ||
//                 selectedFace === item ||
//                 selectedClothes === item
//                   ? "border-2 border-blue-500"
//                   : "bg-gray-300"
//               }`}
//           >
//             {item}
//           </div>
//         ))}
//       </div>

//       {/* Finish Button */}
//       <button
//         onClick={handleConfirm}
//         className="text-base w-[196px] h-[46px] py-3 mb-3 bg-gray-300 text-black rounded-md hover:bg-gray-700 transition self-center"
//       >
//         I'am already!
//       </button>
//     </div>
//   );
// }

// export default SelectAvatar;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// function SelectAvatar() {
//   const { code, studentId } = useParams();
//   const navigate = useNavigate();
//   const [name, setName] = useState("");

//   const [accessoryOptions, setAccessoryOptions] = useState([]);
//   const [maskOptions, setMaskOptions] = useState([]);
//   const [costumeOptions, setCostumeOptions] = useState([]);
//   const [bodyOptions, setBodyOptions] = useState([]);

//   const [selectedAccessory, setSelectedAccessory] = useState(null);
//   const [selectedMask, setSelectedMask] = useState(null);
//   const [selectedCostume, setSelectedCostume] = useState(null);
//   const [selectedBody, setSelectedBody] = useState(null);

//   const [selectedCategory, setSelectedCategory] = useState("face");

//   // Fetch asset จาก server
//   useEffect(() => {
//     async function fetchAssets() {
//       try {
//         const res = await axios.get("http://localhost:4000/api/avatars/options");

//         const noneOption = { id: null, path: "" };

//         setAccessoryOptions([noneOption, ...(res.data?.accessories || [])]);
//         setMaskOptions([noneOption, ...(res.data?.masks || [])]);
//         setCostumeOptions([noneOption, ...(res.data?.costumes || [])]);
//         setBodyOptions([noneOption, ...(res.data?.bodies || [])]);
//       } catch (err) {
//         console.error(err);
//         setAccessoryOptions([]);
//         setMaskOptions([]);
//         setCostumeOptions([]);
//         setBodyOptions([]);
//       }
//     }
//     fetchAssets();
//   }, []);


  

//   const getOptions = () => {
//     switch (selectedCategory) {
//       case "accessories":
//         return accessoryOptions;
//       case "costumes":
//         return costumeOptions;
//       case "masks":
//         return maskOptions;
//       default:
//         return bodyOptions;
//     }
//   };

//   const handleSelect = (item) => {
//     if (selectedCategory === "accessories") setSelectedAccessory(item);
//     if (selectedCategory === "masks") setSelectedMask(item);
//     if (selectedCategory === "costumes") setSelectedCostume(item);
//     if (selectedCategory === "bodies") setSelectedBody(item);
//   };

//   const handleConfirm = async () => {
//     try {
//       const res = await axios.post("http://localhost:4000/api/avatars", {
//         studentNumber: studentId,
//         classId: code,
//         stageName: name.trim() || studentId,
//         maskId: selectedMask?.id || null,
//         costumeId: selectedCostume?.id || null,
//         bodyId: selectedBody?.id || null,
//         accessoryId: selectedAccessory?.id || null
//       });

//       const avatarId = res.data.avatarId;

//       const playerData = {
//         code,
//         studentId,
//         stageName: name.trim() || studentId,
//         avatarId,
//         avatar: {
//           maskId: selectedMask?.id || null,
//           costumeId: selectedCostume?.id || null,
//           bodyId: selectedBody?.id || null,
//           accessoryId: selectedAccessory?.id || null
//         },
//       };

//       navigate(`/class/${code}/lobby`, { state: { playerData } });
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   return (
//     <div className="flex flex-col items-center justify-center h-screen p-4">
//       <h1 className="text-base mb-6">Do you want to change a stage name?</h1>

//       {/* Input box */}
//       <input
//         type="text"
//         placeholder={studentId}
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="text-sm text-black w-[252px] h-[61px] px-4 py-2 placeholder-gray-700 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none mb-6"
//       />

//       {/* Avatar Preview */}
//       <div className="relative w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-4xl">
//         {selectedBody && (
//           <img
//             src={selectedBody.path}
//             alt="bodies"
//             className="absolute w-full bottom-0 object-contain"
//           />
//         )}
//         {selectedMask && (
//           <img
//             src={selectedMask.path}
//             alt="masks"
//             className="absolute w-full h-full object-cover rounded-full"
//           />
//         )}
//         {selectedAccessory && (
//           <img
//             src={selectedAccessory.path}
//             alt="accessories"
//             className="absolute w-1/2 top-0 left-1/4 object-contain"
//           />
//         )}
//         {selectedCostume && (
//           <img
//             src={selectedCostume.path}
//             alt="costumes"
//             className="absolute w-full bottom-0 object-contain"
//           />
//         )}
//       </div>

//       {/* Category Selectors */}
//       <div className="flex gap-4 mt-6">
//         <button
//           onClick={() => setSelectedCategory("bodies")}
//           className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "body" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//           😀
//         </button>
//         <button
//           onClick={() => setSelectedCategory("accessories")}
//           className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "accessory" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//           🎩
//         </button>
//         <button
//           onClick={() => setSelectedCategory("masks")}
//           className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "mask" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//           😀
//         </button>
//         <button
//           onClick={() => setSelectedCategory("costumes")}
//           className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
//             ${selectedCategory === "costume" ? "border-2 border-blue-500" : "bg-gray-200"}`}
//         >
//           👕
//         </button>
//       </div>

//       {/* Options Grid */}
//       {/* <div className="grid grid-cols-3 gap-3 mt-6 border p-4 rounded-lg mb-4">
//         {getOptions().map((item) => (
//           <div
//             key={item.id}
//             onClick={() => handleSelect(item)}
//             className={`w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer
//               ${
//                 (selectedCategory === "bodies" && selectedBody?.id === item.id) ||
//                 (selectedCategory === "accessories" && selectedAccessory?.id === item.id) ||
//                 (selectedCategory === "masks" && selectedMask?.id === item.id) ||
//                 (selectedCategory === "costumes" && selectedCostume?.id === item.id)
//                   ? "border-2 border-blue-500"
//                   : "bg-gray-300"
//               }`}
//           >

//             <img
//               src={item.path}
//               alt="option"
//               className="w-full h-full object-cover rounded-full"
//             />
//           </div>
//         ))}
//       </div> */}
//       <div className="grid grid-cols-3 gap-3 mt-6 border p-4 rounded-lg mb-4">
//         {getOptions().map((item, index) => (
//           <div
//             key={item.id}
//             onClick={() => {
//               if (index === 0) {
//                 handleSelect(null); // เลือกอันแรก → ไม่เอาหมวดนั้น
//               } else {
//                 handleSelect(item);
//               }
//             }}
//             className={`w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer
//               ${
//                 (selectedCategory === "bodies" && selectedBody?.id === item?.id) ||
//                 (selectedCategory === "accessories" && selectedAccessory?.id === item?.id) ||
//                 (selectedCategory === "masks" && selectedMask?.id === item?.id) ||
//                 (selectedCategory === "costumes" && selectedCostume?.id === item?.id)
//                   ? "border-2 border-blue-500"
//                   : "bg-gray-300"
//               }`}
//           >
//             {index === 0 ? (
//               <img
//                 src="/assets/no_option.png" // <-- path ของรูปห้าม
//                 alt="no option"
//                 className="w-1/2 h-1/2 object-contain"
//               />
//             ) : (
//               <img
//                 src={item.path}
//                 alt="option"
//                 className="w-full h-full object-cover rounded-full"
//               />
//             )}
//           </div>
//         ))}
//       </div>




//       {/* Finish Button */}
//       <button
//         onClick={handleConfirm}
//         className="text-base w-[196px] h-[46px] py-3 mb-3 bg-gray-300 text-black rounded-md hover:bg-gray-700 transition self-center"
//       >
//         I'am already!
//       </button>
//     </div>
//   );
// }

// export default SelectAvatar;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SelectAvatar() {
  const { code, studentId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const [accessoryOptions, setAccessoryOptions] = useState([]);
  const [maskOptions, setMaskOptions] = useState([]);
  const [costumeOptions, setCostumeOptions] = useState([]);
  const [bodyOptions, setBodyOptions] = useState([]);

  const [selectedAccessory, setSelectedAccessory] = useState({ id: 0 });
  const [selectedMask, setSelectedMask] = useState({ id: 0 });
  const [selectedCostume, setSelectedCostume] = useState({ id: 0 });
  const [selectedBody, setSelectedBody] = useState({ id: 0 });

  const [selectedCategory, setSelectedCategory] = useState("bodies"); // default เป็น bodies

  // Fetch asset จาก server
  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await axios.get("http://localhost:4000/api/avatars/options");

        // const sortZeroFirst = (arr) => {
        //   if (!arr) return [];
        //   const zero = arr.find((a) => a.id === 0);
        //   const others = arr.filter((a) => a.id !== 0);
        //   return zero ? [zero, ...others] : others;
        // };
        const sortZeroFirst = (arr) => {
          if (!arr) return [];
          return arr.slice().sort((a, b) => (a.id === 0 ? -1 : b.id === 0 ? 1 : 0));
        };


        setAccessoryOptions(sortZeroFirst(res.data?.accessories));
        setMaskOptions(sortZeroFirst(res.data?.masks));
        setCostumeOptions(sortZeroFirst(res.data?.costumes));
        setBodyOptions(sortZeroFirst(res.data?.bodies));
      } catch (err) {
        console.error(err);
        setAccessoryOptions([]);
        setMaskOptions([]);
        setCostumeOptions([]);
        setBodyOptions([]);
      }
    }
    fetchAssets();
  }, []);

  const getOptions = () => {
    switch (selectedCategory) {
      case "accessories":
        return accessoryOptions;
      case "costumes":
        return costumeOptions;
      case "masks":
        return maskOptions;
      default:
        return bodyOptions;
    }
  };

  const handleSelect = (item) => {
    if (!item) item = { id: 0 };
    if (selectedCategory === "accessories") setSelectedAccessory(item);
    if (selectedCategory === "masks") setSelectedMask(item);
    if (selectedCategory === "costumes") setSelectedCostume(item);
    if (selectedCategory === "bodies") setSelectedBody(item);
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/avatars", {
        studentNumber: studentId,
        classId: code,
        stageName: name.trim() || studentId,
        maskId: selectedMask.id,
        costumeId: selectedCostume.id,
        bodyId: selectedBody.id,
        accessoryId: selectedAccessory.id,
      });

      const avatarId = res.data.avatarId;

      const playerData = {
        code,
        studentId,
        stageName: name.trim() || studentId,
        avatarId,
        avatar: {
          maskId: selectedMask.id,
          costumeId: selectedCostume.id,
          bodyId: selectedBody.id,
          accessoryId: selectedAccessory.id,
        },
      };

      navigate(`/class/${code}/lobby`, { state: { playerData } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-base mb-6">Do you want to change a stage name?</h1>

      {/* Input box */}
      <input
        type="text"
        placeholder={studentId}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-sm text-black w-[252px] h-[61px] px-4 py-2 placeholder-gray-700 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none mb-6"
      />

      {/* Avatar Preview */}
      <div className="relative w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-4xl">
        {selectedBody.id !== 0 && (
          <img
            src={selectedBody.path}
            alt="bodies"
            className="absolute w-full bottom-0 object-contain"
          />
        )}
        {selectedMask.id !== 0 && (
          <img
            src={selectedMask.path}
            alt="masks"
            className="absolute w-full h-full object-cover rounded-full"
          />
        )}
        {selectedAccessory.id !== 0 && (
          <img
            src={selectedAccessory.path}
            alt="accessories"
            className="absolute w-1/2 top-0 left-1/4 object-contain"
          />
        )}
        {selectedCostume.id !== 0 && (
          <img
            src={selectedCostume.path}
            alt="costumes"
            className="absolute w-full bottom-0 object-contain"
          />
        )}
      </div>

      {/* Category Selectors */}
      <div className="flex gap-4 mt-6">
        {["bodies", "accessories", "masks", "costumes"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg cursor-pointer
              ${
                selectedCategory === cat
                  ? "bg-gray-400 border-2 border-blue-500"
                  : "bg-gray-200"
              }`}
          >
            {cat === "bodies" && "😀"}
            {cat === "accessories" && "🎩"}
            {cat === "masks" && "😷"}
            {cat === "costumes" && "👕"}
          </button>
        ))}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-3 gap-3 mt-6 border p-4 rounded-lg mb-4">
        {getOptions().map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer
              ${
                item.id !== 0 &&
                ((selectedCategory === "bodies" && selectedBody?.id === item.id) ||
                  (selectedCategory === "accessories" && selectedAccessory?.id === item.id) ||
                  (selectedCategory === "masks" && selectedMask?.id === item.id) ||
                  (selectedCategory === "costumes" && selectedCostume?.id === item.id))
                  ? "border-2 border-blue-500"
                  : "bg-gray-300"
              }`}
          >
            <img
              src={item.path}
              alt="option"
              className={`w-full h-full object-cover rounded-full`}
            />
          </div>
        ))}
      </div>

      {/* Finish Button */}
      <button
        onClick={handleConfirm}
        className="text-base w-[196px] h-[46px] py-3 mb-3 bg-gray-300 text-black rounded-md hover:bg-gray-700 transition self-center"
      >
        I'am already!
      </button>
    </div>
  );
}

export default SelectAvatar;

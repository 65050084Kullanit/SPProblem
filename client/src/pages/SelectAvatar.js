import { useEffect, useState } from "react";
import { useLocation,useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";
import { Shirt, Scissors, Smile, Palette } from "lucide-react";

function SelectAvatar() {
  const { joinCode, studentId } = useParams();
  const location = useLocation();
  const { studentNumber } = location.state || {};


  
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

  const API_URL = process.env.REACT_APP_SERVER_URL;

  // Fetch asset จาก server
  // useEffect(() => {
  //   async function fetchAssets() {
  //     try {
  //       const res = await axios.get(`${API_URL}/avatars/options`);

  //       // const sortZeroFirst = (arr) => {
  //       //   if (!arr) return [];
  //       //   const zero = arr.find((a) => a.id === 0);
  //       //   const others = arr.filter((a) => a.id !== 0);
  //       //   return zero ? [zero, ...others] : others;
  //       // };
  //       const sortZeroFirst = (arr) => {
  //         if (!arr) return [];
  //         return arr.slice().sort((a, b) => (a.id === 0 ? -1 : b.id === 0 ? 1 : 0));
  //       };


  //       setAccessoryOptions(sortZeroFirst(res.data?.accessories));
  //       setMaskOptions(sortZeroFirst(res.data?.masks));
  //       setCostumeOptions(sortZeroFirst(res.data?.costumes));
  //       setBodyOptions(sortZeroFirst(res.data?.bodies));
  //     } catch (err) {
  //       console.error(err);
  //       setAccessoryOptions([]);
  //       setMaskOptions([]);
  //       setCostumeOptions([]);
  //       setBodyOptions([]);
  //     }
  //   }
  //   fetchAssets();
  // }, [API_URL]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await axios.get(`${API_URL}/avatars/options`);

        const sortZeroFirst = (arr) => {
          if (!arr) return [];
          return arr.slice().sort((a, b) =>
            a.id === 0 ? -1 : b.id === 0 ? 1 : a.id - b.id
          );
        };

        const accessories = sortZeroFirst(res.data?.accessories);
        const masks = sortZeroFirst(res.data?.masks);
        const costumes = sortZeroFirst(res.data?.costumes);
        const bodies = sortZeroFirst(res.data?.bodies);

        setAccessoryOptions(accessories);
        setMaskOptions(masks);
        setCostumeOptions(costumes);
        setBodyOptions(bodies);

        // ✅ set default = id 0
        setSelectedAccessory(accessories.find(a => a.id === 0) || accessories[0]);
        setSelectedMask(masks.find(a => a.id === 0) || masks[0]);
        setSelectedCostume(costumes.find(a => a.id === 0) || costumes[0]);
        setSelectedBody(bodies.find(a => a.id === 0) || bodies[0]);

      } catch (err) {
        console.error(err);
      }
    }

    fetchAssets();
  }, [API_URL]);


  if (!studentId) {
    console.error("❌ studentId missing");
    return null;
  }

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
    // if (!item) item = { id: 0 };
    if (selectedCategory === "accessories") setSelectedAccessory(item);
    if (selectedCategory === "masks") setSelectedMask(item);
    if (selectedCategory === "costumes") setSelectedCostume(item);
    if (selectedCategory === "bodies") setSelectedBody(item);
  };


  const handleConfirm = async () => {
    try {

      const displayName = name.trim() || String(studentNumber) || "Guest"

      console.log("POST BODY:", {
        studentId: Number(studentId),
        joinCode,
        studentNumber,
        stageName: displayName,
        maskId: selectedMask.id,
        costumeId: selectedCostume.id,
        bodyId: selectedBody.id,
        accessoryId: selectedAccessory.id,
      });


      const res = await axios.post(`${API_URL}/avatars`, {
        studentId: Number(studentId),            // 🔥 ต้องมี
        joinCode,
        studentNumber,   
        stageName: displayName,
        maskId: selectedMask.id,
        costumeId: selectedCostume.id,
        bodyId: selectedBody.id,
        accessoryId: selectedAccessory.id,
      });

      const avatarId = res.data.avatarId;

      const playerData = {
        studentId: Number(studentId),
        studentNumber,
        joinCode,
        stageName: displayName,
        avatarId,
        avatar: {
          maskId: selectedMask.id,
          costumeId: selectedCostume.id,
          bodyId: selectedBody.id,
          accessoryId: selectedAccessory.id,
        },
      };

      if (!studentId) {
        console.error("studentId missing");
        return;
      }

      localStorage.setItem("student_meta", JSON.stringify(playerData));

      socket.emit("update-player", {
        joinCode, 
        studentId: Number(studentId),
        stageName: displayName,
        avatar: {
          maskId: selectedMask.id,
          costumeId: selectedCostume.id,
          bodyId: selectedBody.id,
          accessoryId: selectedAccessory.id,
        }
      });

      socket.emit("join-room", {
        joinCode,
        player: {
          studentId: Number(studentId)
        },
        role: "student"
      });
      navigate(`/class/${joinCode}/lobby`, {
        state: {
          playerData,
          joinCode,
        },
      });

    } catch (err) {
      console.error(err);
    }
  };


  const categories = [
    { key: "bodies", icon: <Palette size={20} />, label: "Skin" },
    { key: "accessories", icon: <Scissors size={20} />, label: "Hair" },
    { key: "masks", icon: <Smile size={20} />, label: "Face" },
    { key: "costumes", icon: <Shirt size={20} />, label: "Costume" },
  ];


  
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-base mb-6">Do you want to change a stage name?</h1>

      {/* Input box */}
      <input
        type="text"
        placeholder={studentNumber}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-sm text-black w-[252px] h-[61px] px-4 py-2 placeholder-gray-700 bg-gray-300 border border-gray-500 rounded-md focus:ring-1 focus:ring-gray-700 outline-none mb-6"
      />

      {/* Avatar Preview */}
      {/* <div className="relative w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center text-4xl">
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
      </div> */}

      {/* <div className="relative w-[100px] h-[100px]">
        <img src={selectedBody?.path} alt="body" className="absolute inset-0 w-full h-full" />
        <img src={selectedCostume?.path} alt="costume" className="absolute inset-0 w-full h-full" />
        <img src={selectedMask?.path} alt="mask" className="absolute inset-0 w-full h-full" />
        <img src={selectedAccessory?.path} alt="accessory" className="absolute inset-0 w-full h-full" />
      </div> */}

      <div className="relative w-[200px] h-[200px]">
        <img
          src={selectedBody?.path}
          alt="body"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={selectedCostume?.path}
          alt="costume"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={selectedMask?.path}
          alt="mask"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={selectedAccessory?.path}
          alt="accessory"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Category Selectors */}
      {/* <div className="flex gap-4 mt-6">
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
      </div> */}

      {/* Category Selectors */}
      <div className="flex gap-6 mt-6">
        {categories.map((cat) => (
          <div key={cat.key} className="flex flex-col items-center">
            <button
              onClick={() => setSelectedCategory(cat.key)}
              className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-200
                ${
                  selectedCategory === cat.key
                    ? "bg-blue-500 text-white scale-110 shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {cat.icon}
            </button>

            <span className="text-xs mt-1 text-gray-600">
              {cat.label}
            </span>
          </div>
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
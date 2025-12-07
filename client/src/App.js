import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import StudentID from "./pages/StudentID";
import SelectAvatar from "./pages/SelectAvatar";
import Lobby from "./pages/Lobby";


import OneAnsQuizPage from "./pages/OneAnsQuizPage";
import MultiAnsQuizPage from "./pages/MultiAnsQuizPage";
import AnswerResultPage from "./pages/AnswerResultPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/class/:code" element={<StudentID />} />
        <Route path="/class/:code/student/:studentId/avatar" element={<SelectAvatar />} />
        <Route path="/class/:code/lobby" element={<Lobby />} />

        <Route path="/1quiz" element={<OneAnsQuizPage />} />
        <Route path="/mquiz" element={<MultiAnsQuizPage />} />
        <Route path="/ansresult" element={<AnswerResultPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;

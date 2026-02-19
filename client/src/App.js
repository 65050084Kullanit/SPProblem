import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import StudentID from "./pages/StudentID";
import SelectAvatar from "./pages/SelectAvatar";
import Lobby from "./pages/Lobby";
import QuizPage from "./pages/QuizPage";
import EndQuizPage from "./pages/EndQuizPage";
import GameAnalysis from "./pages/GameAnalysis";


import OneAnsQuizPage from "./pages/OneAnsQuizPage3";
import MultiAnsQuizPage from "./pages/MultiAnsQuizPage";
import AnswerResultPage from "./pages/AnswerResultPage";
import RankingPage from "./pages/RankingPage";
// import GameAnalysis from "./pages/GameAnalysis";
import Poll from "./pages/Poll";
import OpenChat from "./pages/OpenChat";

import OneSquare from "./pages/OneAnsSquare";
import OneSquare2 from "./pages/OneAnsSquare2";
import MultiSquare from "./pages/MultiAnsSquare";
import MultiSquare2 from "./pages/MultiAnsSquare2";







function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/class/:joinCode" element={<StudentID />} />
        <Route path="/class/:joinCode/student/:studentId/avatar" element={<SelectAvatar />} />
        <Route path="/class/:joinCode/lobby" element={<Lobby />} />
        <Route path="/class/:joinCode/lobby/quiz/:activitySessionId" element={<QuizPage />} />
        <Route path="/class/:joinCode/lobby/quiz/:activitySessionId/end" element={<EndQuizPage />} />
        <Route path="/class/:joinCode/lobby/quiz/:activitySessionId/end/analysis" element={<GameAnalysis />} />


        <Route path="/1quiz" element={<OneAnsQuizPage />} />
        <Route path="/mquiz" element={<MultiAnsQuizPage />} />
        <Route path="/ansresult" element={<AnswerResultPage />} />
        <Route path="/endquiz" element={<EndQuizPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/analysis" element={<GameAnalysis />} />
        <Route path="/poll" element={<Poll />} />
        <Route path="/chat" element={<OpenChat />} />
        <Route path="/1square" element={<OneSquare />} />
        <Route path="/1square2" element={<OneSquare2 />} />
        <Route path="/msquare" element={<MultiSquare />} />
        <Route path="/msquare2" element={<MultiSquare2 />} />



        
      </Routes>
    </Router>
  );
}

export default App;

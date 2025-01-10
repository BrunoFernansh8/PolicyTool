import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import ConcernsPage from './pages/ConcernsPage';
import RiskPriorityPage from './pages/RiskPriorityPage';
import RiskAssessment from './pages/RiskAssessment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/concerns" element={<ConcernsPage />} />
        <Route path="/risk-priority" element={<RiskPriorityPage />} />
        <Route path="/risk" element={<RiskAssessment />} />
      </Routes>
    </Router>
  );
}

export default App;

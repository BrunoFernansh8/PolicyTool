import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RiskAssessment from './pages/RiskAssessment';
import PolicyGenerator from './pages/PolicyGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/risk" element={<RiskAssessment />} />
        <Route path="/policy" element={<PolicyGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;

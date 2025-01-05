import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="welcome-page">
      <h1>Welcome to Cloud Security Tool</h1>
      <p>Your partner in managing cloud security risks and creating policies.</p>
      <Link to="/login">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default WelcomePage;

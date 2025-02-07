import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to PolicyTool</h1>
      <p>Perform digital risk assessments for cloud computing security.</p>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
    </div>
  );
};

export default HomePage;

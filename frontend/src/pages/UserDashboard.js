import React from "react";
import RiskForm from "../components/Risk/RiskForm.js";
import RiskPriority from "../components/Risk/RiskPriority.js";

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <RiskForm />
      <RiskPriority />
    </div>
  );
};

export default UserDashboard;

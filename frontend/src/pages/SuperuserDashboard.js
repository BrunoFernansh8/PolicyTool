import React from "react";
import RiskList from "../components/Risk/RiskList.js";
import PolicyGenerator from "../components/Policy/PolicyGenerator.js";

const SuperuserDashboard = () => {
  return (
    <div>
      <h1>Superuser Dashboard</h1>
      <RiskList />
      <PolicyGenerator />
    </div>
  );
};

export default SuperuserDashboard;

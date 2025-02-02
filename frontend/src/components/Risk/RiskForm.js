import React, { useState } from "react";
import { api } from "../../services/api";

const RiskForm = () => {
  const [riskData, setRiskData] = useState({ description: "" });

  const handleChange = (e) => {
    setRiskData({ ...riskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/risks", riskData);
      alert("Risk added successfully!");
    } catch (error) {
      console.error("Error submitting risk", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="description" onChange={handleChange} required />
      <button type="submit">Submit Risk</button>
    </form>
  );
};

export default RiskForm;

import React, { useState } from "react";
import { api } from "../../services/api";

const PolicyGenerator = () => {
  const [policy, setPolicy] = useState("");

  const generatePolicy = async () => {
    try {
      const response = await api.get("/policies/generate");
      setPolicy(response.data.policyText);
    } catch (error) {
      console.error("Error generating policy", error);
    }
  };

  return (
    <div>
      <button onClick={generatePolicy}>Generate Policy</button>
      {policy && <pre>{policy}</pre>}
    </div>
  );
};

export default PolicyGenerator;

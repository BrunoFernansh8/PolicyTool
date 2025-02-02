import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const RiskList = () => {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const response = await api.get("/risks");
        setRisks(response.data);
      } catch (error) {
        console.error("Error fetching risks", error);
      }
    };

    fetchRisks();
  }, []);

  return (
    <ul>
      {risks.map((risk) => (
        <li key={risk.id}>{risk.description}</li>
      ))}
    </ul>
  );
};

export default RiskList;

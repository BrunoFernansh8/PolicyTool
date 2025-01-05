import React, { useState } from 'react';
import axios from '../api/api';

function RiskAssessment() {
  const [concern, setConcern] = useState('');
  const [analysis, setAnalysis] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/risk/analyze', { concern });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Risk Assessment</h1>
      <textarea
        value={concern}
        onChange={(e) => setConcern(e.target.value)}
        placeholder="Any concerns regarding the use of cloud computing environments?"
      />
      <button onClick={handleSubmit}>Analyze</button>
      {analysis && <div><h3>Analysis</h3><p>{analysis}</p></div>}
    </div>
  );
}

export default RiskAssessment;

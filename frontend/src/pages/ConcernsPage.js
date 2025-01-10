import React, { useState, useEffect } from 'react';
import axios from '../api/api';

function ConcernsPage() {
  const [concerns, setConcerns] = useState([]); // Existing concerns
  const [newConcern, setNewConcern] = useState(''); // Input for new concern
  const [analyzeResult, setAnalyzeResult] = useState(''); // Result of concern analysis
  const [analyzeError, setAnalyzeError] = useState(''); // Error during analysis
  const [concernToAnalyze, setConcernToAnalyze] = useState(''); // Input for concern analysis

  // Fetch existing concerns on component mount
  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const response = await axios.get('/api/risk');
        setConcerns(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConcerns();
  }, []);

  // Handle adding a new concern
  const handleAddConcern = async () => {
    try {
      const response = await axios.post('/api/risk', { description: newConcern });
      setConcerns([...concerns, response.data]);
      setNewConcern('');
    } catch (error) {
      console.error('Error adding concern:', error);
    }
  };

  // Handle analyzing a concern
  const handleAnalyzeConcern = async () => {
    setAnalyzeError('');
    setAnalyzeResult('');

    if (!concernToAnalyze.trim()) {
      setAnalyzeError('Please enter a concern to analyze.');
      return;
    }

    try {
      const response = await axios.post('/api/risk/analyze', { concern: concernToAnalyze });
      setAnalyzeResult(response.data.analyzedConcern);
    } catch (error) {
      setAnalyzeError('Error analyzing concern. Please try again.');
      console.error('Error analyzing concern:', error);
    }
  };

  return (
    <div className="concerns-page">
      <h1>Current Concerns</h1>
      <ul>
        {concerns.map((concern, index) => (
          <li key={index}>{concern.description}</li>
        ))}
      </ul>

      <h2>Log New Concern</h2>
      <input
        type="text"
        placeholder="Enter your concern"
        value={newConcern}
        onChange={(e) => setNewConcern(e.target.value)}
      />
      <button onClick={handleAddConcern}>Add Concern</button>

      <h2>Analyze Concern</h2>
      <textarea
        placeholder="Enter a concern to analyze"
        value={concernToAnalyze}
        onChange={(e) => setConcernToAnalyze(e.target.value)}
        rows="4"
        cols="50"
      />
      <button onClick={handleAnalyzeConcern}>Analyze Concern</button>

      {analyzeError && <p style={{ color: 'red' }}>{analyzeError}</p>}
      {analyzeResult && (
        <div>
          <h3>Analysis Result</h3>
          <p>{analyzeResult}</p>
        </div>
      )}
    </div>
  );
}

export default ConcernsPage;

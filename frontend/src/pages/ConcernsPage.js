import React, { useState, useEffect } from 'react';
import axios from '../api/api';

function ConcernsPage() {
  const [concerns, setConcerns] = useState([]);
  const [newConcern, setNewConcern] = useState('');

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

  const handleAddConcern = async () => {
    try {
      const response = await axios.post('/api/risk', { description: newConcern });
      setConcerns([...concerns, response.data]);
      setNewConcern('');
    } catch (error) {
      console.error('Error adding concern:',error);
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
    </div>
  );
}

export default ConcernsPage;

import React, { useState } from "react";
import axios from "axios";
import '../../styles/PolicyRequirements.css';

const API_URL = "http://localhost:8000"; // Adjust based on your backend

const PolicyRequirements = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    addressLine1: "",
    state: "",
    country: "",
    zipCode: "",
    policyName: "",
    frameworks: "",
    environment: "",
    specialRequirements: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/policies`, formData); // Adjust endpoint to match your backend
      setSuccessMessage("Policy requirements submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting policy requirements:", error);
    }
  };

  return (
    <div className="policy-form">
      <h1>Policy Requirements</h1>
      <form onSubmit={handleSubmit}>
        <h2>Basic Company Information</h2>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="companySize"
          placeholder="Company Size"
          value={formData.companySize}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line-1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />

        <h2>Policy Details</h2>
        <input
          type="text"
          name="policyName"
          placeholder="Policy Name"
          value={formData.policyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="frameworks"
          placeholder="Frameworks"
          value={formData.frameworks}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="environment"
          placeholder="Environment/Infrastructure"
          value={formData.environment}
          onChange={handleChange}
          required
        />
        <textarea
          name="specialRequirements"
          placeholder="Special Requirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
console.log("Policy Requirements Component Loaded");


export default PolicyRequirements;

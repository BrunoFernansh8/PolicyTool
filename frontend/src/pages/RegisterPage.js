import React, { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [userData, setUserData] = useState({ username: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="user">User</option>
        <option value="superuser">Superuser</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;

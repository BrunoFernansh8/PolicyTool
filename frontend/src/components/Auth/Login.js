import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";
import { loginUser } from "../../services/auth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(credentials);
      login(userData);
      navigate(userData.role === "superuser" ? "/superuser" : "/user");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

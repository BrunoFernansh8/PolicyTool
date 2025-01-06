import React, { useState } from 'react';
import axios from '../api/api';

function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(endpoint, { username, password });
      alert(`Success: ${response.data.message}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <h1>{isSignUp ? 'Sign Up' : 'Log In'}</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>{isSignUp ? 'Sign Up' : 'Log In'}</button>
      <p>
        {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}
        <span onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? ' Log In' : ' Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default LoginPage;

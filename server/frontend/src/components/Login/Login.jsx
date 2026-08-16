import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/djangoapp/login', {
        userName: username,
        password: password
      });

      if (response.data.status === 'Authenticated') {
        localStorage.setItem('username', username);
        setUser(username);
        alert('Login successful!');
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="auth-submit-btn">Login</button>
      </form>
      <div className="auth-switch">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

export default Login;

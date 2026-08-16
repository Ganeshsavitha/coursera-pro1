import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/djangoapp/register', {
        userName: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
      });

      if (response.data.status === 'Authenticated') {
        localStorage.setItem('username', username);
        setUser(username);
        alert('Registration successful!');
        navigate('/');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
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
            placeholder="Choose a secure password"
            required
          />
        </div>
        <button type="submit" className="auth-submit-btn">Register</button>
      </form>
      <div className="auth-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
}

export default Register;

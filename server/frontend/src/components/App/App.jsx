import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Dealers from '../Dealers/Dealers';
import DealerDetails from '../Dealers/DealerDetails';
import Register from '../Register/Register';
import ReviewForm from '../Review/ReviewForm';
import Login from '../Login/Login';

function App() {
  const [user, setUser] = useState(null);

  // Check if session is already active
  useEffect(() => {
    // Standard session check or read local storage
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/djangoapp/logout');
      localStorage.removeItem('username');
      setUser(null);
      alert('Logged out successfully!');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      // Fallback
      localStorage.removeItem('username');
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">Antigravity Motors</Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              
              {user ? (
                <>
                  <li className="nav-user-info">Logged in as: <strong>{user}</strong></li>
                  <li>
                    <a href="#" onClick={handleLogout} className="nav-btn logout-btn">Logout</a>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="nav-btn">Login</Link></li>
                  <li><Link to="/register" className="nav-btn">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Main Content Mount */}
        <main className="container">
          <Routes>
            <Route path="/" element={<Dealers user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/dealer/:id" element={<DealerDetails user={user} />} />
            <Route path="/postreview/:id" element={<ReviewForm user={user} />} />
          </Routes>
        </main>

        <footer class="footer">
          <p>&copy; 2026 Antigravity Motors. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

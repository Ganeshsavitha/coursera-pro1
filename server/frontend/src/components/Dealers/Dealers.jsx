import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dealers({ user }) {
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch dealers
  useEffect(() => {
    fetchDealers();
  }, [selectedState]);

  const fetchDealers = async () => {
    setLoading(true);
    try {
      let url = '/djangoapp/get_dealers';
      if (selectedState !== 'All') {
        url = `/djangoapp/get_dealers/${selectedState}`;
      }
      const response = await axios.get(url);
      if (response.data && response.data.dealers) {
        setDealers(response.data.dealers);

        // Populate unique states dropdown list once initially
        if (states.length === 0) {
          // If we loaded all, extract states
          const allResponse = await axios.get('/djangoapp/get_dealers');
          if (allResponse.data && allResponse.data.dealers) {
            const uniqueStates = [...new Set(allResponse.data.dealers.map(d => d.state))];
            setStates(uniqueStates);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="hero-section">
        <h1>Welcome to Antigravity Motors</h1>
        <p className="hero-subtitle">Browse through our verified nationwide premium car dealerships. Filter by state to find one near you.</p>
      </section>

      {/* Filter and Table Container */}
      <div className="filter-container">
        <label htmlFor="state-filter" style={{ fontWeight: 600, color: '#ffffff' }}>Filter by State: </label>
        <select
          id="state-filter"
          className="state-select"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="All">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading dealerships...</div>
      ) : dealers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>No dealerships found.</div>
      ) : (
        <div className="dealers-table-container">
          <table className="dealers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dealer Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Zip Code</th>
                <th>State</th>
                {user && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {dealers.map(dealer => (
                <tr key={dealer.id}>
                  <td>{dealer.id}</td>
                  <td>
                    <Link to={`/dealer/${dealer.id}`} style={{ fontWeight: 600, color: '#3b82f6' }}>
                      {dealer.full_name}
                    </Link>
                  </td>
                  <td>{dealer.city}</td>
                  <td>{dealer.address}</td>
                  <td>{dealer.zip}</td>
                  <td>{dealer.state}</td>
                  {user && (
                    <td>
                      <Link to={`/postreview/${dealer.id}`} className="email-btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                        Review Dealer
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dealers;

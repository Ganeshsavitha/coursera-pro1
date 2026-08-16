import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReviewForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dealerName, setDealerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [purchase, setPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');

  const [carsList, setCarsList] = useState([]);
  const [makesList, setMakesList] = useState([]);
  const [modelsList, setModelsList] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !localStorage.getItem('username')) {
      alert('You must be logged in to post a review.');
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch dealer name and cars inventory
  useEffect(() => {
    fetchDealerAndCars();
  }, [id]);

  const fetchDealerAndCars = async () => {
    setLoading(true);
    try {
      // 1. Get dealer name
      const dealerRes = await axios.get(`/djangoapp/dealer/${id}`);
      if (dealerRes.data && dealerRes.data.dealer && dealerRes.data.dealer.length > 0) {
        setDealerName(dealerRes.data.dealer[0].full_name);
      }

      // 2. Get cars list
      const carsRes = await axios.get('/djangoapp/get_cars');
      if (carsRes.data && carsRes.data.cars) {
        setCarsList(carsRes.data.cars);
        
        // Extract unique car makes
        const uniqueMakes = [...new Set(carsRes.data.cars.map(c => c.car_make))];
        setMakesList(uniqueMakes);
      }
    } catch (err) {
      console.error('Error fetching review metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically update models based on selected make
  useEffect(() => {
    if (carMake) {
      const filteredModels = carsList
        .filter(c => c.car_make === carMake)
        .map(c => c.car_model);
      const uniqueModels = [...new Set(filteredModels)];
      setModelsList(uniqueModels);
      setCarModel(''); // reset selection
    } else {
      setModelsList([]);
      setCarModel('');
    }
  }, [carMake, carsList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewText) {
      setError('Please provide review text.');
      return;
    }

    if (purchase && (!purchaseDate || !carMake || !carModel || !carYear)) {
      setError('Please provide purchase details (Date, Make, Model, and Year).');
      return;
    }

    try {
      const payload = {
        dealer: parseInt(id),
        name: localStorage.getItem('username') || 'Anonymous',
        review: reviewText,
        purchase: purchase,
        purchase_date: purchase ? purchaseDate : '',
        car_make: purchase ? carMake : '',
        car_model: purchase ? carModel : '',
        car_year: purchase ? parseInt(carYear) : null
      };

      const response = await axios.post('/djangoapp/add_review', payload);

      if (response.data.status === 200) {
        alert('Review added successfully!');
        navigate(`/dealer/${id}`);
      } else {
        setError(response.data.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during submission.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Loading review form...</div>;
  }

  return (
    <div className="review-form-container">
      <h2>Add a Review for <span style={{ color: '#3b82f6' }}>{dealerName || `Dealer #${id}`}</span></h2>
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="static-form">
        <div className="form-group">
          <label htmlFor="review-text">Review Text *</label>
          <textarea
            id="review-text"
            rows="5"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="purchase"
            checked={purchase}
            onChange={(e) => setPurchase(e.target.checked)}
          />
          <label htmlFor="purchase" style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
            Has purchased a car from this dealer?
          </label>
        </div>

        {purchase && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1rem' }}>Purchase Details</h3>
            
            <div className="form-group">
              <label htmlFor="purchase-date">Purchase Date</label>
              <input
                type="date"
                id="purchase-date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required={purchase}
              />
            </div>

            <div className="form-group">
              <label htmlFor="car-make">Car Make</label>
              <select
                id="car-make"
                className="state-select"
                style={{ width: '100%', padding: '0.75rem 1rem' }}
                value={carMake}
                onChange={(e) => setCarMake(e.target.value)}
                required={purchase}
              >
                <option value="">-- Select Car Make --</option>
                {makesList.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="car-model">Car Model</label>
              <select
                id="car-model"
                className="state-select"
                style={{ width: '100%', padding: '0.75rem 1rem' }}
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                required={purchase}
                disabled={!carMake}
              >
                <option value="">-- Select Car Model --</option>
                {modelsList.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="car-year">Car Year</label>
              <input
                type="number"
                id="car-year"
                min="2015"
                max="2030"
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                placeholder="2022"
                required={purchase}
              />
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn" style={{ marginTop: '1.5rem' }}>Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DealerDetails({ user }) {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealerAndReviews();
  }, [id]);

  const fetchDealerAndReviews = async () => {
    setLoading(true);
    try {
      // 1. Get dealer info
      const dealerRes = await axios.get(`/djangoapp/dealer/${id}`);
      if (dealerRes.data && dealerRes.data.dealer && dealerRes.data.dealer.length > 0) {
        setDealer(dealerRes.data.dealer[0]);
      }

      // 2. Get reviews
      const reviewsRes = await axios.get(`/djangoapp/reviews/dealer/${id}`);
      if (reviewsRes.data && reviewsRes.data.reviews) {
        setReviews(reviewsRes.data.reviews);
      }
    } catch (err) {
      console.error('Error fetching dealer details/reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
      default:
        return '😐';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>Loading dealer details...</div>;
  }

  if (!dealer) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#ef4444' }}>Dealer not found.</div>;
  }

  return (
    <div>
      {/* Dealer Header */}
      <div className="dealer-header">
        <h1>{dealer.full_name}</h1>
        <div className="dealer-meta">
          <p><strong>Address:</strong> {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>
          <p><strong>Coordinates:</strong> Lat: {dealer.lat}, Long: {dealer.long}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2 style={{ color: '#ffffff' }}>Customer Reviews</h2>
          {user ? (
            <Link to={`/postreview/${dealer.id}`} className="submit-btn" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
              Write a Review
            </Link>
          ) : (
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Please <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Login</Link> to post a review.
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '10px', textAlign: 'center', color: '#94a3b8' }}>
            No reviews yet for this dealership. Be the first to add one!
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`sentiment-badge ${review.sentiment || 'neutral'}`}>
                      {review.sentiment} {getSentimentEmoji(review.sentiment)}
                    </span>
                    {review.purchase && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="review-text">"{review.review}"</p>
                </div>
                <div className="review-meta">
                  <p><strong>Reviewed by:</strong> {review.name}</p>
                  {review.purchase && (
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Bought a {review.car_make} {review.car_model} ({review.car_year}) on {review.purchase_date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DealerDetails;

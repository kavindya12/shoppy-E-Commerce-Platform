import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useStore } from '../store/store';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { state } = useStore();

  useEffect(() => {
    // Fetch reviews for product
    api.get(`/reviews/${productId}`)
      .then(res => {
        // Sort reviews by date, newest first, and show all
        const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sorted);
      })
      .catch(err => console.error(err));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.user) {
      alert('Please login to submit a review');
      return;
    }
    try {
      await api.post(`/reviews/${productId}`, newReview);
      alert('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      // Refresh reviews
      const res = await api.get(`/reviews/${productId}`);
      setReviews(res.data || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review');
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={`text-gray-700 ${review.rating < 3 ? 'text-red-500' : ''}`}>{review.comment}</p>
              <div className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {state.user && (
        <form onSubmit={handleSubmit} className="mt-6">
          <h3 className="font-semibold mb-2">Write a Review</h3>
          <div className="mb-2">
            <label>Rating:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="ml-2 border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your review..."
            className="w-full border rounded p-2 mb-2"
            rows="4"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;


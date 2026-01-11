import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Utility function to get auth header
const getAuthHeaders = () => {
    return {
        headers: {
            'x-auth-token': localStorage.getItem('token'),
        },
    };
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  // 1. Function to Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to view your bookings.');
            setLoading(false);
            // Optional: Redirect to login if token is missing
            return navigate('/login');}
    try {
      const res = await axios.get(
        'http://localhost:5000/api/bookings/me', 
        getAuthHeaders() // Pass JWT token
      );
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);

      // If the error is 401 (Unauthorized), clear the token and redirect to login
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return setMessage('Session expired or unauthorized. Please log in again.');
            }
      setMessage('Failed to load your bookings. Please log in again.');
      setLoading(false);
    }
  }, [navigate]); // Add navigate to dependency array

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


  // 2. Function to Cancel Booking
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    setMessage('');
    
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`, 
        {}, // PUT body is often empty for cancellations
        getAuthHeaders()
      );
      
      // Update state immediately to reflect the change
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'canceled' } : booking
      ));

      setMessage(res.data.msg || 'Booking successfully canceled.');

    } catch (err) {
      // 🟢 STEP 6: Error Handling - Display user-friendly message
      const errorMsg = err.response?.data?.msg || 'Failed to cancel the booking.';
      setMessage(`Cancellation failed: ${errorMsg}`);
      console.error(err);
    }
  };


  if (loading) return <h2>Loading My Bookings...</h2>;

  return (
    <div className="my-bookings-container">
      <h1>My Current Bookings</h1>

      {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}

      {bookings.length === 0 ? (
        <p>You have no current bookings.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className={`booking-card status-${booking.status}`}>
              
              {/* Service Details are populated by the backend */}
              <h3>{booking.service ? booking.service.name : 'Service Deleted'}</h3>
              
              <p>Status: <span className={`status-badge`}>{booking.status.toUpperCase()}</span></p>
              
              <p>Date: **{new Date(booking.date).toLocaleDateString()}**</p>
              <p>Time: **{booking.time}**</p>
              <p>Duration: {booking.service?.durationMinutes} minutes</p>

              {/* Cancel Button Logic */}
              {booking.status === 'booked' && (
                <button 
                  onClick={() => handleCancel(booking._id)} 
                  className="btn-cancel"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Utility function to get auth header
const getAuthHeaders = () => {
    return {
        headers: {
            'x-auth-token': localStorage.getItem('token'),
        },
    };
};

const BookingFormPage = () => {
  // Get serviceId from the URL parameter
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fetch Service Details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${serviceId}`);
        setService(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load service details.');
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const onChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 2. Handle Booking Submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { date, time } = formData;
    if (!date || !time) {
        return setMessage('Please select both a date and a time.');
    }

    try {
      const payload = { 
        serviceId, 
        date, 
        time 
      };

      await axios.post(
        'http://localhost:5000/api/bookings', 
        payload, 
        getAuthHeaders() // Pass JWT token
      );
      
      setMessage('Booking successful! Redirecting to My Bookings...');
      setTimeout(() => navigate('/my-bookings'), 1500); 

    } catch (err) {
      // 🟢 STEP 6: Error Handling
      // This is crucial for catching the 409 Conflict (double booking) from the backend
      const errorMsg = err.response?.data?.msg || 'An unknown error occurred during booking.';
      setMessage(`Booking failed: ${errorMsg}`);
      console.error(err);
    }
  };

  if (loading) return <h2>Loading Service Details...</h2>;
  if (message.includes('Failed to load')) return <h2 style={{color: 'red'}}>{message}</h2>;
  if (!service) return <h2>Service not found.</h2>;


  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form-container">
      <h1>Book: {service.name}</h1>
      <p>Duration: **{service.durationMinutes} minutes**</p>
      <p>Price: **${service.price.toFixed(2)}**</p>
      
      <form onSubmit={onSubmit} className="booking-form">
        
        {/* Date Selector */}
        <div className="form-group">
          <label htmlFor="date">Select Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            min={today} // Prevent booking in the past
            required
          />
        </div>

        {/* Time Selector (Simple String input for HH:MM) */}
        <div className="form-group">
          <label htmlFor="time">Select Time (e.g., 10:30)</label>
          <input
            type="text" // Using text for simplicity, could be type="time" but browser compatibility varies
            name="time"
            value={formData.time}
            onChange={onChange}
            placeholder="HH:MM (e.g., 14:00)"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Confirm Booking
        </button>
      </form>
      
      {/* Message Area */}
      {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}

      <p style={{marginTop: '20px'}}>
        <button onClick={() => navigate('/')} className="btn-book" style={{backgroundColor: '#6c757d'}}>
          &larr; Back to Services
        </button>
      </p>
    </div>
  );
};

export default BookingFormPage;
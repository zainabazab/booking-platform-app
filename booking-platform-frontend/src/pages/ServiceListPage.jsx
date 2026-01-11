import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // NOTE: Assume backend runs on port 5000
        const res = await axios.get('http://localhost:5000/api/services'); 
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load services.');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <h2>Loading Services...</h2>;
  if (error) return <h2 style={{color: 'red'}}>{error}</h2>;

  return (
    <div className="service-list">
      <h1>Available Services</h1>
      {services.length === 0 ? (
        <p>No services are currently available.</p>
      ) : (
        <div className="service-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p>Duration: **{service.durationMinutes} min**</p>
              <p>Price: **${service.price.toFixed(2)}**</p>
              {/* Link to the protected booking form */}
              <Link to={`/book/${service._id}`} className="btn-book">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;
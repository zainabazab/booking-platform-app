import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister ? formData : { email, password };
    
    try {
      // NOTE: Backend URL assumed to be http://localhost:5000
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      // 1. Success: Store the JWT token
      localStorage.setItem('token', res.data.token);
      
      // 2. Display success message
      setMessage(`${isRegister ? 'Registration' : 'Login'} successful! Redirecting...`);
      
      // 3. Navigate to the main service list page
      setTimeout(() => navigate('/'), 1000); 

    } catch (err) {
      // 🟢 STEP 6: Error Handling - Display user-friendly messages
      const errorMsg = err.response?.data?.msg || 'Authentication failed. Please check your inputs.';
      setMessage(errorMsg);
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isRegister ? 'Create Account' : 'Sign In'}</h1>
      <form onSubmit={onSubmit} className="auth-form">
        {/* Name field (only for Registration) */}
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
        )}

        {/* Email field (for both) */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>

        {/* Password field (for both) */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength={6} // Enforce minimum length from backend model
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      
      {/* Message Area */}
      {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}

      {/* Toggle between Register/Login */}
      <p className="toggle-auth">
        {isRegister ? 'Already have an account?' : 'Need an account?'} 
        <button type="button" onClick={() => {
          setIsRegister(!isRegister);
          setMessage('');
        }}>
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
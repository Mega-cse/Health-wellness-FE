import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const response = await axios.post(
        'https://health-wellness-be-3.onrender.com/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
  
      if (response.data && response.data.success) {
        const user = response.data.user;
        setUser(user);
  
        const redirectPath = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err); // Log the error
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="signup-prompt">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;

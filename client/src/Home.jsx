// src/HomePage.jsx
import React from 'react';
import './HomePage.css'; // Optional: for custom styling

const HomePage = () => {
  const handleLoginClick = () => {
    // Redirect to the login page or trigger a login action
    window.location.href = '/login';
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Crop Disease Prediction and Management System</h1>
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
    </div>
  );
};

export default HomePage;

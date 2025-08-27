import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h2>Welcome to Habit Tracker!</h2>
      <p>Track your good habits and break your bad ones.</p>
      <p>Sign up or log in to start your journey.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

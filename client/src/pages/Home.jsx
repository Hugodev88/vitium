import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <h2>Welcome to Habit Tracker!</h2>
      <p>Track your good habits and break your bad ones.</p>
      <p>Sign up or log in to start your journey.</p>
      <div className={styles.buttonContainer}>
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

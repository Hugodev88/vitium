import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return <h2 className={styles.container}>User not found.</h2>;
  }

  return (
    <div className={styles.container}>
      <h2>User Profile</h2>
      <div className={styles.card}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more profile details or an edit form here */}
        <button onClick={() => navigate('/achievements')} className={`btn ${styles.button}`}>View Achievements</button>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return <h2 className="text-center">User not found.</h2>;
  }

  return (
    <div className="text-center">
      <h2>User Profile</h2>
      <div className="card" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more profile details or an edit form here */}
        <button onClick={() => navigate('/achievements')} className="btn" style={{ marginTop: '20px' }}>View Achievements</button>
      </div>
    </div>
  );
};

export default Profile;

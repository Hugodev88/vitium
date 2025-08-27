import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector(state => state.auth);

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
      </div>
    </div>
  );
};

export default Profile;

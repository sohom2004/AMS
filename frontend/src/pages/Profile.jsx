// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data); // Save retrieved user data to state
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Role:</strong> {userData.role}</p>
      {userData.role === 'Staff' && (
        <p><strong>Domain:</strong> {userData.domain}</p>
      )}
    </div>
  );
};

export default Profile;

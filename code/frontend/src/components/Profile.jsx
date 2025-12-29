import React from 'react';

const Profile = () => {
  // Placeholder content
  const user = JSON.parse(localStorage.getItem('tutormi_user')) || {};

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Profile</h1>
      </div>
      <section className="dashboard-section">
        <div className="profile-details">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User Type:</strong> {user.userType}</p>
          {/* Add more profile details as needed */}
        </div>
      </section>
    </main>
  );
};

export default Profile;

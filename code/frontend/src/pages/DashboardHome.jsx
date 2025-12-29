import { useNavigate } from 'react-router-dom';

function DashboardHome() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType') || 'student';

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {userType === 'tutor' ? 'Tutor' : 'Student'}!</h1>
        <p className="dashboard-subtitle">Access your lesson plans and stay updated with announcements</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card" onClick={() => navigate(`/${userType}/lessons`)}>
          <div className="action-icon lessons-icon"></div>
          <span>View All Lessons</span>
        </div>
        <div className="action-card" onClick={() => navigate(`/${userType}/announcements`)}>
          <div className="action-icon announcements-icon"></div>
          <span>View Announcements</span>
        </div>
        {userType === 'tutor' && (
          <>
            <div className="action-card" onClick={() => navigate('/tutor/requests')}>
              <div className="action-icon"></div>
              <span>Student Requests</span>
            </div>
            <div className="action-card" onClick={() => navigate('/tutor/students')}>
              <div className="action-icon"></div>
              <span>My Students</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default DashboardHome;

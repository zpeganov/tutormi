import { useNavigate, useLocation } from 'react-router-dom'

function Navbar({ userType = 'student' }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname.endsWith(path)

  const handleDashboard = () => {
    navigate(userType === 'tutor' ? '/tutor' : '/student')
  }

  const handleLogout = () => {
    localStorage.removeItem('userType')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        Tutormi
      </div>
      <div className="navbar-links">
        <span
          className={`navbar-link ${location.pathname === `/${userType}` ? 'active' : ''}`}
          onClick={handleDashboard}
        >
          {userType === 'tutor' ? 'Dashboard' : 'Dashboard'}
        </span>
        <span
          className={`navbar-link ${isActive('/lessons') ? 'active' : ''}`}
          onClick={() => navigate(`/${userType}/lessons`)}
        >
          Lesson Plans
        </span>
        <span
          className={`navbar-link ${isActive('/announcements') ? 'active' : ''}`}
          onClick={() => navigate(`/${userType}/announcements`)}
        >
          Announcements
        </span>
        {userType === 'tutor' && (
          <span
            className={`navbar-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={() => navigate('/tutor/settings')}
          >
            Settings
          </span>
        )}
      </div>
      <div className="navbar-actions">
        <span className="navbar-user-type">{userType === 'tutor' ? 'Tutor' : 'Student'}</span>
        <button className="btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar

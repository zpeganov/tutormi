import { useNavigate } from 'react-router-dom'
import '../App.css'
import studentImage from '../assets/images/student_image.png'
import tutorImage from '../assets/images/tutor_image.png'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      {/* Logo */}
      <div className="logo">Tutormi</div>

      {/* Content Wrapper - keeps tagline aligned with cards */}
      <div className="content-wrapper">
        {/* Tagline */}
        <h1 className="tagline">
          Do Re <span className="tutormi">Tutormi</span>, Your <span className="bold">All in One</span> for Student<br />
          Access to Tutor Resources
        </h1>

        {/* Cards */}
        <div className="cards-section">
          <div className="card" onClick={() => navigate('/login/student')}>
            <div className="card-row">
              <div className="card-image">
                <img src={studentImage} alt="Student" />
              </div>
              <div className="vertical-text">STUDENT</div>
            </div>
            <div className="card-label">Student</div>
          </div>

          <div className="card" onClick={() => navigate('/login/tutor')}>
            <div className="card-row">
              <div className="vertical-text-left">TUTOR</div>
              <div className="card-image">
                <img src={tutorImage} alt="Tutor" />
              </div>
            </div>
            <div className="card-label-right">Tutor</div>
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <p className="bottom-tagline">
        Made by tutors, <span className="for-tutors">for TUTORS</span>
      </p>

      {/* Navigation Circles */}
      <div className="nav-circles">
        <div className="nav-item" onClick={() => navigate('/about')}>
          <div className="circle about"></div>
          <span>About</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/announcements')}>
          <div className="circle news"></div>
          <span>News</span>
        </div>
        <div className="nav-item">
          <div className="circle contact"></div>
          <span>Contact</span>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

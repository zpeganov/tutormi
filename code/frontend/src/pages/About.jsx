import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function About() {
  const navigate = useNavigate()

  // Get user type from localStorage (set during login)
  const userType = localStorage.getItem('userType') || 'student'

  return (
    <div className="dashboard-container">
      <Navbar userType={userType} />
      
      <main className="dashboard-content">
        <div className="about-page">
          <div className="about-header">
            <h1 className="about-title">About <span className="tutormi-text">Tutormi</span></h1>
            <p className="about-tagline">Your All in One for Student Access to Tutor Resources</p>
          </div>

          <div className="about-content">
            <section className="about-section">
              <h2>Our Mission</h2>
              <p>
                Tutormi was created with one goal in mind: to bridge the gap between tutors and students. 
                We believe that quality education should be accessible, organized, and easy to navigate.
              </p>
            </section>

            <section className="about-section">
              <h2>What We Offer</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon"></div>
                  <h3>Comprehensive Lesson Plans</h3>
                  <p>Access detailed lesson plans and materials for all your subjects.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"></div>
                  <h3>Stay Updated</h3>
                  <p>Receive important announcements and updates from your tutors.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"></div>
                  <h3>Expert Tutors</h3>
                  <p>Learn from experienced and dedicated tutors who are passionate about teaching.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"></div>
                  <h3>Easy Navigation</h3>
                  <p>Find exactly what you need with our intuitive interface and search functionality.</p>
                </div>
              </div>
            </section>

            <section className="about-section">
              <h2>Made by Tutors, for Tutors</h2>
              <p>
                We understand the challenges both tutors and students face because we've been there. 
                Tutormi was built by educators who wanted to create a better way to share knowledge 
                and keep students informed.
              </p>
            </section>

            <div className="about-cta">
              <p>Ready to get started?</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => navigate('/student')}>
                  I'm a Student
                </button>
                <button className="btn-secondary" onClick={() => navigate('/tutor')}>
                  I'm a Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

function TutorRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    subject: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tutorId, setTutorId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const data = await authAPI.registerTutor({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        subject: formData.subject,
      })
      setTutorId(data.user.tutorId)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h1>Registration Complete!</h1>
          <p>Your tutor account has been created successfully.</p>
          
          <div className="tutor-id-display">
            <label>Your Unique Tutor ID</label>
            <div className="tutor-id-value">{tutorId}</div>
            <span className="tutor-id-hint">
              Share this ID with your students so they can register under you.
            </span>
          </div>

          <button className="btn-primary auth-btn" onClick={() => navigate('/login/tutor')}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo" onClick={() => navigate('/')}>Tutormi</div>
          <h1>Tutor Registration</h1>
          <p>Create an account to manage your students and lessons.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First name"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Primary Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            >
              <option value="">Select your primary subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Languages">Languages</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Tutor Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login/tutor">Sign in here</Link></p>
          <p className="auth-switch">Are you a student? <Link to="/register/student">Student Registration</Link></p>
        </div>
      </div>
    </div>
  )
}

export default TutorRegister

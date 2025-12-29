import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

function StudentRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    tutorId: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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

    if (!formData.tutorId.trim()) {
      setError('Please enter a valid Tutor ID')
      return
    }

    setLoading(true)

    try {
      await authAPI.registerStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        tutorId: formData.tutorId,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed. Please check the Tutor ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h1>Registration Request Sent!</h1>
          <p>Your registration request has been sent to the tutor.</p>
          <p className="success-detail">
            You will receive an email notification once your tutor accepts your request. 
            After approval, you can log in and access all lesson materials.
          </p>
          <button className="btn-primary auth-btn" onClick={() => navigate('/login/student')}>
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
          <h1>Student Registration</h1>
          <p>Create an account to access your tutor's lessons.</p>
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

          <div className="form-group tutor-id-group">
            <label>Tutor ID</label>
            <input
              type="text"
              value={formData.tutorId}
              onChange={(e) => setFormData({ ...formData, tutorId: e.target.value.toUpperCase() })}
              placeholder="Enter your tutor's ID (e.g., TUT-ABC123)"
              required
            />
            <span className="form-hint">
              Ask your tutor for their unique ID to register under them.
            </span>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Sending Request...' : 'Send Registration Request'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login/student">Sign in here</Link></p>
          <p className="auth-switch">Are you a tutor? <Link to="/register/tutor">Tutor Registration</Link></p>
        </div>
      </div>
    </div>
  )
}

export default StudentRegister

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyStudents } from '../services/api' // Assuming an API function to get students

function MyStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    // Fetch students from the backend
    const fetchStudents = async () => {
      try {
        const response = await getMyStudents();
        setStudents(response.students || []); // Use response.students and fallback to empty array
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]); // Set to empty array on error
      }
    };

    fetchStudents();
  }, [])

  const filteredStudents = (students || []).filter((student) => { // Add guard here
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || student.email.toLowerCase().includes(query);
  })

  const handleRemoveClick = (student) => {
    setSelectedStudent(student)
    setShowRemoveModal(true)
  }

  const handleRemoveConfirm = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id))
    setShowRemoveModal(false)
    setSelectedStudent(null)
    // TODO: Send removal to backend
  }

  return (
    <div className="my-students-section">
      <div className="section-header">
        <h2 className="section-title">My Students</h2>
        <p className="section-subtitle">
          You have {students.length} student{students.length !== 1 ? 's' : ''} enrolled
        </p>
      </div>

      {/* Search and Stats */}
      <div className="students-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="students-stats">
          <div className="stat-item">
            <span className="stat-value">{students.length}</span>
            <span className="stat-label">Total Students</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {students.filter(s => s.lastActive === 'Today').length}
            </span>
            <span className="stat-label">Active Today</span>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="students-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <div className="student-avatar">
                  {student.firstName && student.lastName ? `${student.firstName[0]}${student.lastName[0]}` : '?'}
                </div>
                <div className="student-details">
                  <h3>{student.firstName} {student.lastName}</h3>
                  <p className="student-email">{student.email}</p>
                </div>
              </div>
              
              <div className="student-stats">
                <div className="student-stat">
                  <span className="stat-number">{student.lessonsViewed}</span>
                  <span className="stat-text">Lessons Viewed</span>
                </div>
                <div className="student-stat">
                  <span className="stat-number">{student.lastActive}</span>
                  <span className="stat-text">Last Active</span>
                </div>
                <div className="student-stat">
                  <span className="stat-number">{student.joinedDate}</span>
                  <span className="stat-text">Joined</span>
                </div>
              </div>

              <div className="student-actions">
                <button 
                  className="btn-remove"
                  onClick={() => handleRemoveClick(student)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            {searchQuery ? (
              <p>No students found matching "{searchQuery}"</p>
            ) : (
              <>
                <p>You don't have any students yet.</p>
                <p className="empty-hint">Share your Tutor ID with students so they can register under you.</p>
                <button className="btn-primary" onClick={() => navigate('/tutor/requests')}>
                  View Pending Requests
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Remove Student</h2>
              <button className="modal-close" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong> from your students?</p>
              <p className="modal-warning">This student will no longer have access to your lesson plans and announcements.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleRemoveConfirm}>
                Remove Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyStudents

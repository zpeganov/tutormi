
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getMyCourses } from '../services/api';
import { NewCourseCard } from '../components';

function DashboardHome() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType') || 'student';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // for future use
  const [selectedCourse, setSelectedCourse] = useState(null); // for future use
  const joinSectionRef = useRef(null);

  useEffect(() => {
    if (userType !== 'student') return;
    setLoading(true);
    getMyCourses()
      .then((res) => setCourses(res.courses || []))
      .catch((err) => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, [userType]);

  const handleScrollToJoin = () => {
    if (joinSectionRef.current) {
      joinSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {userType === 'tutor' ? 'Tutor' : 'Student'}!</h1>
        <p className="dashboard-subtitle">Access your lesson plans and stay updated with announcements</p>
      </div>

      {userType === 'student' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>My Courses</h2>
          <div className="cards-grid">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <NewCourseCard key={course.id} course={course} hideEdit />
              ))
            ) : (
              <div className="course-card blank-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
                <span style={{ fontSize: '1.2rem', color: '#888', marginBottom: 12 }}>You are not enrolled in any courses yet.</span>
                <button className="add-course-btn" onClick={handleScrollToJoin} style={{ marginTop: 8 }}>Join a Course</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions (still show for both) */}
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

      {/* Join Course Section */}
      {userType === 'student' && (
        <section ref={joinSectionRef} id="join-course-section" style={{ marginTop: 48, padding: 32, background: '#f9fafb', borderRadius: 12 }}>
          <h2 style={{ marginBottom: 16 }}>Join a Course</h2>
          <form className="join-course-form">
            <div>
              <label htmlFor="tutorId">Tutor ID</label>
              <input id="tutorId" name="tutorId" type="text" placeholder="Enter Tutor ID (e.g. TUT001)" required />
            </div>
            <div>
              <label htmlFor="courseCode">Course Code</label>
              <input id="courseCode" name="courseCode" type="text" placeholder="Enter Course Code (e.g. ALG101)" required />
            </div>
            <button type="submit">Join Course</button>
          </form>
        </section>
      )}
    </main>
  );
}

export default DashboardHome;

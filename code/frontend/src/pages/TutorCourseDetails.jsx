import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import './TutorCourseDetails.css';
import '../components/Components.css'; // For AnnouncementCard styles

// Mock Data
const mockAnnouncements = [
  { id: 1, title: 'Welcome to the course!', content: 'Please review the syllabus and course materials.', date: '2025-12-20' },
  { id: 2, title: 'Midterm Exam Schedule', content: 'The midterm exam will be held on January 15th.', date: '2025-12-22' },
];

const mockLessons = [
  { id: 1, title: 'Introduction to Algebra', description: 'Basic concepts and operations.' },
  { id: 2, title: 'Linear Equations', description: 'Solving single and multiple variable equations.' },
];

const mockStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

function TutorCourseDetails() {
  const { id } = useParams();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [lessons, setLessons] = useState(mockLessons);
  const [students, setStudents] = useState(mockStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({ title: '', content: '' });

  // Dummy data for now
  const course = {
    id: id,
    name: 'Sample Course',
    description: 'This is a sample course description.',
  };

  const openNewAnnouncementModal = () => {
    setEditingAnnouncement(null);
    setAnnouncementFormData({ title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEditAnnouncementModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementFormData({ title: announcement.title, content: announcement.content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setAnnouncementFormData({ title: '', content: '' });
  };

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (editingAnnouncement) {
      // Edit existing announcement
      setAnnouncements(announcements.map(ann =>
        ann.id === editingAnnouncement.id ? { ...ann, ...announcementFormData } : ann
      ));
    } else {
      // Create new announcement
      const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
      const newAnnouncement = {
        id: newId,
        ...announcementFormData,
        date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    closeModal();
  };

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncements(announcements.filter(a => a.id !== announcementId));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{course.name}</h1>
          <p className="dashboard-subtitle">{course.description}</p>
        </div>

        {/* Announcements Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Announcements</h2>
            <button onClick={openNewAnnouncementModal} className="btn-primary">New Announcement</button>
          </div>
          <div className="announcements-list">
            {announcements.map(announcement => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-header">
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <div className="announcement-actions">
                    <button onClick={() => openEditAnnouncementModal(announcement)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="btn-decline">Delete</button>
                  </div>
                </div>
                <p className="announcement-content">{announcement.content}</p>
                <div className="announcement-footer">
                  <span className="announcement-date">{announcement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Plans Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Lesson Plans</h2>
            <button className="btn-primary">New Lesson Plan</button>
          </div>
          <div className="cards-grid">
            {lessons.map(lesson => (
              <div key={lesson.id} className="lesson-card">
                <h3 className="lesson-title">{lesson.title}</h3>
                <p className="lesson-description">{lesson.description}</p>
                <div className="lesson-footer">
                  <button className="btn-primary">Edit</button>
                  <button className="btn-decline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Enrolled Students</h2>
          </div>
          <div className="students-list">
            {students.map(student => (
              <div key={student.id} className="student-card">
                <span className="student-name">{student.name}</span>
                <span className="student-email">{student.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <form onSubmit={handleAnnouncementSubmit}>
            <h2>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={announcementFormData.title}
                onChange={handleAnnouncementChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={announcementFormData.content}
                onChange={handleAnnouncementChange}
                rows="5"
                required
              ></textarea>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editingAnnouncement ? 'Save Changes' : 'Post Announcement'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default TutorCourseDetails;

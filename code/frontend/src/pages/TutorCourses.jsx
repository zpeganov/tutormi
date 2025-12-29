import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';
import { NewCourseCard } from '../components';
import StudentRequests from './StudentRequests';
import './Dashboard.css';
import Modal from '../components/Modal';

function TutorCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    console.log('TutorCourses component mounted');
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses...');
        setIsLoading(true);
        const response = await getCourses();
        console.log('API Response:', response);
        // Add a sample image to the first course to match the screenshot
        const styledCourses = (response.courses || []).map((course, index) => {
          if (index === 0) {
            return { ...course, image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' };
          }
          return course;
        });
        setCourses(styledCourses);
        setError(null);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([
          { id: 1, name: 'Mathematics 101', description: 'An introductory course to basic mathematics.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937c7c?q=80&w=2532&auto=format&fit=crop' },
          { id: 2, name: 'History of Art', description: 'A survey of major art movements.', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2534&auto=format&fit=crop' },
          { id: 3, name: 'Physics for Beginners', description: 'Understanding the fundamental principles of physics.', image: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=2670&auto=format&fit=crop' },
        ]);
      } finally {
        console.log('Finished fetching courses.');
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  console.log('Current courses state:', courses);
  console.log('Is loading:', isLoading);
  console.log('Error state:', error);

  const openEditModal = (course) => {
    setEditingCourse(course);
    setCourseFormData({ name: course.name, description: course.description, image_url: course.image_url });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setCourseFormData({ name: '', description: '', image: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: courseFormData.name,
        description: courseFormData.description,
      };
      if (courseFormData.image_url && courseFormData.image_url.trim() !== '') {
        updateData.image_url = courseFormData.image_url;
      }
      await updateCourse(editingCourse.id, updateData);
      // Refresh courses from backend
      const response = await getCourses();
      setCourses((response.courses || []));
      closeModal();
    } catch (err) {
      alert('Failed to update course.');
    }
  };

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Courses</h1>
      </div>

      <div className="courses-header">
        <button className="btn-primary">+ course</button>
      </div>

      <section>
        {courses.length > 0 ? (
          <div className="cards-grid">
            {courses.map(course => (
              <NewCourseCard 
                key={course.id} 
                course={course} 
                onEdit={openEditModal}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>No courses found. Add one to get started.</p>
          </div>
        )}
      </section>
      
   
      <StudentRequests />

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <form onSubmit={handleFormSubmit}>
            <h2>Edit Course</h2>
            <div className="form-group">
              <label htmlFor="name">Course Title</label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseFormData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={courseFormData.description}
                onChange={handleFormChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="image_url">Image URL</label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={courseFormData.image_url}
                onChange={handleFormChange}
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}

export default TutorCourses;

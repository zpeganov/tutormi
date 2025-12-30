import React, { useState } from 'react';
import api from '../services/api';

const JoinCourseForm = ({ onJoin }) => {
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Call backend to join course
      const res = await api.post('/students/join-course', { courseId });
      if (res.data.success) {
        onJoin && onJoin(courseId);
      } else {
        setError(res.data.message || 'Could not join course.');
      }
    } catch (err) {
      setError('Invalid course ID or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="join-course-form">
      <label htmlFor="courseId">Enter Course ID:</label>
      <input
        type="text"
        id="courseId"
        value={courseId}
        onChange={e => setCourseId(e.target.value)}
        maxLength={7}
        required
      />
      <button type="submit" disabled={loading}>Join Course</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default JoinCourseForm;

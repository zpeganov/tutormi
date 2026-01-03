import React, { useState } from 'react';
import { joinCourse } from '../services/api';

const JoinCourseForm = ({ onJoin }) => {
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId.trim()) {
      setError('Course ID cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await joinCourse(courseId);
      if (onJoin) {
        onJoin(courseId);
      }
      setCourseId(''); // Clear input on success
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid course ID or server error.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="join-course-form">
      <div>
        <label htmlFor="courseId">Course Code</label>
        <input
          id="courseId"
          name="courseId"
          type="text"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter 7-character course code"
          required
          maxLength="7"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Joining...' : 'Join Course'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </form>
  );
};

export default JoinCourseForm;

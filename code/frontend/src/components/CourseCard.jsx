import React from 'react';
import './Components.css';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const { name, description, image_url, student_count } = course;

  const handleEdit = () => {
    onEdit(course);
  };

  const handleDelete = () => {
    onDelete(course.id);
  };

  return (
    <div className="course-card">
      <img src={image_url || 'https://placehold.co/600x400'} alt={name} className="course-image" />
      <div className="course-content">
        <h3 className="course-title">{name}</h3>
        <p className="course-description">{description}</p>
        <div className="course-footer">
          <span className="student-count">{student_count} student{student_count !== 1 ? 's' : ''}</span>
          <div className="course-actions">
            <button onClick={handleEdit} className="btn-edit">Edit</button>
            <button onClick={handleDelete} className="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

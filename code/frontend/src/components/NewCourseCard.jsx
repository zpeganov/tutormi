import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewCourseCard.css';

function NewCourseCard({ course, onEdit }) {
  const navigate = useNavigate();
  const { id, name, image, description } = course;

  const handleCardClick = () => {
    navigate(`/tutor/courses/${id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    onEdit(course);
  };

  return (
    <div className="new-course-card" onClick={handleCardClick}>
      <button className="new-course-card-edit-btn" onClick={handleEditClick}>
        Edit
      </button>
      <div className="new-course-card-image">
        <img src={image || 'https://placehold.co/600x400'} alt={name} />
      </div>
      <div className="new-course-card-content">
        <h3 className="new-course-card-title">{name}</h3>
        <p className="new-course-card-description">{description}</p>
      </div>
    </div>
  );
};

export default NewCourseCard;

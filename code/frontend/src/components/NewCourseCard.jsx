import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewCourseCard.css';

function NewCourseCard({ course, onEdit, hideEdit }) {
  const navigate = useNavigate();
  const { id, name, image_url, description } = course;

  const handleCardClick = () => {
    navigate(`/tutor/courses/${id}`);
  };

  return (
    <div className="new-course-card" onClick={handleCardClick}>
      {!hideEdit && (
        <button className="new-course-card-edit-btn" onClick={e => { e.stopPropagation(); onEdit(course); }}>
          Edit
        </button>
      )}
      <div className="new-course-card-image">
        <img src={image_url || 'https://placehold.co/600x400'} alt={name} />
      </div>
      <div className="new-course-card-content">
        <h3 className="new-course-card-title">{name}</h3>
        <p className="new-course-card-description">{description}</p>
      </div>
    </div>
  );
}

export default NewCourseCard;

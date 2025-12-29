function LessonCard({ lesson }) {
  return (
    <div className="lesson-card">
      <div className="lesson-card-header">
        <span className="lesson-subject">{lesson.subject}</span>
        <span className="lesson-date">{lesson.date}</span>
      </div>
      <h3 className="lesson-title">{lesson.title}</h3>
      <p className="lesson-description">{lesson.description}</p>
      <div className="lesson-footer">
        <span className="lesson-tutor">By {lesson.tutor.firstName} {lesson.tutor.lastName}</span>
        <button className="btn-view">View Details</button>
      </div>
    </div>
  )
}

export default LessonCard

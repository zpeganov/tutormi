function AnnouncementCard({ announcement }) {
  return (
    <div className={`announcement-card ${announcement.priority === 'high' ? 'priority-high' : ''}`}>
      <div className="announcement-header">
        <h3 className="announcement-title">{announcement.title}</h3>
        {announcement.priority === 'high' && (
          <span className="priority-badge">Important</span>
        )}
      </div>
      <p className="announcement-content">{announcement.content}</p>
      <div className="announcement-footer">
        <span className="announcement-tutor">Posted by {announcement.tutor.firstName} {announcement.tutor.lastName}</span>
        <span className="announcement-date">{announcement.date}</span>
      </div>
    </div>
  )
}

export default AnnouncementCard

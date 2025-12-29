import { useState, useEffect } from 'react'
import LessonCard from '../components/LessonCard'
import { getLessons } from '../services/api'
import './Dashboard.css';

function LessonPlans() {
  const [lessons, setLessons] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch lessons from the backend API
    const fetchLessons = async () => {
      try {
        console.log('Fetching lessons...')
        const response = await getLessons()
        console.log('API Response:', response)
        setLessons(response.lessons || []) // Use empty array as fallback
      } catch (error) {
        console.error('Error fetching lessons:', error)
      }
    }

    fetchLessons()
  }, [])

  console.log('Current lessons state:', lessons)

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject = selectedSubject === 'All' || lesson.subject === selectedSubject
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchLower) ||
      (lesson.tutor && `${lesson.tutor.firstName} ${lesson.tutor.lastName}`.toLowerCase().includes(searchLower)) ||
      lesson.description.toLowerCase().includes(searchLower)
    return matchesSubject && matchesSearch
  })

  console.log('Filtered lessons:', filteredLessons)

  const subjects = ['All', ...new Set(lessons.map((lesson) => lesson.subject))]

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Lesson Plans</h1>
        <p className="dashboard-subtitle">Browse all available lesson plans from our tutors</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="subject-filters">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            {selectedSubject === 'All' ? 'All Lessons' : selectedSubject}
            <span className="count">({filteredLessons.length})</span>
          </h2>
        </div>
        {filteredLessons.length > 0 ? (
          <div className="cards-grid">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No lessons found matching your criteria.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default LessonPlans

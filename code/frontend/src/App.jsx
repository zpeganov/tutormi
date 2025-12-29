import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import TutorDashboard from './pages/TutorDashboard'
import LessonPlans from './pages/LessonPlans'
import Announcements from './pages/Announcements'
import StudentLogin from './pages/StudentLogin'
import TutorLogin from './pages/TutorLogin'
import StudentRegister from './pages/StudentRegister'
import TutorRegister from './pages/TutorRegister'
import StudentRequests from './pages/StudentRequests'
import MyStudents from './pages/MyStudents'
import DashboardHome from './pages/DashboardHome'
import TutorCourses from './pages/TutorCourses'
import TutorCourseDetails from './pages/TutorCourseDetails'
import Profile from './components/Profile' // Corrected import path
import TutorLayout from './TutorLayout' // Import TutorLayout
import Settings from './pages/Settings' // Import Settings directly

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Auth Routes */}
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/tutor" element={<TutorLogin />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/tutor" element={<TutorRegister />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="lessons" element={<LessonPlans />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Tutor Dashboard */}
        <Route path="/tutor" element={<TutorLayout />}>
          <Route index element={<TutorCourses />} /> {/* Set as the new index */}
          <Route path="lessons" element={<LessonPlans />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses/:id" element={<TutorCourseDetails />} />
          <Route path="settings" element={<Settings />} /> {/* Fixed Settings route */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App


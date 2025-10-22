import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { HomePage } from './pages/HomePage'
import { StudentLogin } from './pages/StudentLogin'
import { TutorLogin } from './pages/TutorLogin'
import { StudentSignup } from './pages/StudentSignup'
import { TutorDashboard } from './pages/TutorDashboard'
import { TutorSignup } from './pages/TutorSignup'
import { StudentDashboard } from './pages/StudentDashboard'
import { ProfilePage } from './pages/ProfilePage';
import { TutorProfilePage } from './pages/TutorProfilePage';
import { TutorLessonPlans } from './components/TutorLessonPlans';

function App() {

  return (
    <>
      <head>
        <style>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Secular+One&display=swap" rel="stylesheet" />
        </style>

      </head>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/student-login' element={<StudentLogin />} />
          <Route path='/tutor-login' element={<TutorLogin />} />
          <Route path='/student-signup' element={<StudentSignup />} />
          <Route path='/tutor-signup' element={<TutorSignup />} />

          <Route path='/student-dashboard' element={<StudentDashboard />}>
            <Route path="profile" element={<ProfilePage />} />
            {/* Other dashboard routes can be added here */}
          </Route>
          <Route path='/tutor-dashboard' element={<TutorDashboard />}>
            <Route path="profile" element={<TutorProfilePage />} />
            <Route path = "lesson-plans" element={<TutorLessonPlans />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

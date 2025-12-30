import { Outlet, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentSettings from './StudentSettings';
import DashboardHome from './DashboardHome';
import LessonPlans from './LessonPlans';
import Announcements from './Announcements';
import StudentCourseDetails from './StudentCourseDetails';


function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <Navbar userType="student" />
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="lesson-plans" element={<LessonPlans />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        <Route path="*" element={<Outlet />} />
      </Routes>
    </div>
  );
}

export default StudentDashboard;

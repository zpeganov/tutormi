
import { Outlet, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentSettings from './StudentSettings';
import DashboardHome from './DashboardHome';
import LessonPlans from './LessonPlans';
import Announcements from './Announcements';


function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <Navbar userType="student" />
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="lesson-plans" element={<LessonPlans />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="*" element={<Outlet />} />
      </Routes>
    </div>
  );
}

export default StudentDashboard;

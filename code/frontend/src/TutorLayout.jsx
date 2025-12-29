import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import './pages/Dashboard.css';

function TutorLayout() {
  return (
    <div className="dashboard-container">
      <Navbar userType="tutor" />
      <div className="dashboard-main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default TutorLayout;

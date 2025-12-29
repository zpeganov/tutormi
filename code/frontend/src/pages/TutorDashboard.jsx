import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function TutorDashboard() {
  return (
    <div className="dashboard-container">
      <Navbar userType="tutor" />
      <Outlet />
    </div>
  )
}

export default TutorDashboard

import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <Navbar userType="student" />
      <Outlet />
    </div>
  )
}

export default StudentDashboard

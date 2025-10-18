import { Link } from 'react-router-dom';
import './SideNav.css';

export function SideNav() {
  return (
    <nav className="side-nav">
      <div className="nav-title">Student Dashboard</div>
      <ul>
        <li><Link to="profile">Profile</Link></li>
        <li><a href="#">Submit Survey Feedback</a></li>
        <li><a href="#">My Tutors</a></li>
        <li><a href="#">Lessons Plans</a></li>
      </ul>
    </nav>
  );
}

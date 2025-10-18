import { Link } from 'react-router-dom';
import './TutorSideNav.css';

export function TutorSideNav() {
  return (
    <nav className="side-nav">
      <div className="nav-title">Tutor Dashboard</div>
      <ul>
        <li><Link to="profile">Profile</Link></li>
        <li><a href="#">My Students</a></li>
        <li><a href="#">My Lesson Plans</a></li>
      </ul>
    </nav>
  );
}

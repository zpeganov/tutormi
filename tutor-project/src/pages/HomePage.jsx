import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { HomeHeader } from '../components/HomeHeader';
export function HomePage() {
    const navigate = useNavigate();

    const handleStudentClick = () => {
        navigate('/student-auth');
    };

    const handleTutorClick = () => {
        navigate('/tutor-auth');
    }

    return (
        <>
            <HomeHeader />
            <div className='main-container'>
                <div className='landing-title-container'>
                    <div className='main-title'>
                        Everything You Need to Be the
                        <br />
                        Best Tutor, <span>Right Here.</span>
                    </div>
                </div>

                <div className='student-or-tutor-container'>
                    <div className='main-prompt'>Are you a student or a tutor?</div>
                    <div className='buttons-container'>
                        <button
                            onClick={handleStudentClick}
                        >Student</button>
                        <button
                            onClick={handleTutorClick}
                        >Tutor</button>
                    </div>
                </div>
            </div>
            <div className="footer-links">
                <span>Survey Students after Tutoring Sessions</span> &middot;
                <span>Upload and View Lesson Plans</span> &middot;
                <span>Send and See Announcements</span>
            </div>
        </>
    );
}
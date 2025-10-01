import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
export function HomePage() {
    const navigate = useNavigate();

    const handleStudentClick = () => {
        navigate('/student-login');
    };

    return (
        <>
            <Header />
            <div className='main-container'>
                <div className='landing-title-container'>
                    <div className='main-title'>
                        Everything you need to be the
                        <br />
                        BEST tutor, right here.
                    </div>
                </div>

                <div className='student-or-tutor-container'>
                    <div className='main-prompt'>Are you a student or a tutor?</div>
                    <div className='buttons-container'>
                        <button
                            onClick={handleStudentClick}
                        >Student</button>
                        <button>Tutor</button>
                    </div>
                </div>
            </div>
        </>
    );
}
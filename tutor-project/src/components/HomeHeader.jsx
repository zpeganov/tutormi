import { useNavigate } from 'react-router-dom';
import './HomeHeader.css';
import headersvg from '../assets/Vector 5.svg';

export function HomeHeader() {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/');
    }
    return (
        <>
        <div className='curved-header'>
            <img src={headersvg} alt="Header SVG" />
        </div>
        <div className="text-container">
            <div className="left-section"
            onClick={handleClick}>TUTORMI</div>
            <div className="middle-section"
            ></div>
            <div className="right-section">
                <div>
                    About
                </div>
                <div>
                    Dashboard
                </div>
            </div>
        </div>
    </>
    );
}
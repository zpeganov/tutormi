import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/');
    }
    return (
        <>
        <div className="header">
            <div className="left-section"
            onClick={handleClick}>TUTORMI</div>
        </div>
    </>
    );
}
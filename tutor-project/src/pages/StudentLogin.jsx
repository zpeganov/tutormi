import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './StudentLogin.css';

export function StudentLogin() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/student-signup');
    }
    return(
        <>
        <Header />
        <div className="student-login-container">
            <div className="greeting-header">Hi there, Student</div>
            <h2>Student Login</h2>
            <form>
                <div className="email-container">
                    <div className="email">Email:</div>
                    <input type="email" name="email" required />
                </div>
                <div className="password-container">
                    <div className="password">Password:</div>
                    <input type="password" name="password" required />
                </div>
                <div className="no-account-container">
                    Don't have an account?
                    <button className="sign-up-button" onClick = {handleClick}>
                        Sign Up Here
                    </button>
                </div>
                <div className="button-container">
                    <button type="submit" className="submit-button">Login</button>
                </div>
            </form>
        </div>
        </>
    );
}

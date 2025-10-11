import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './StudentLogin.css';

export function StudentLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/student-signup');
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/api/auth/student-login', { email, password }, { withCredentials: true })
            .then(result => {
                navigate('/student-dashboard');
            }).catch(err => {
                console.error(err);
            });

    }
    return (
        <>
            <Header />
            <div className="student-login-container">
                <div className="greeting-header">Hi there, Student</div>
                <h2>Student Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="email-container">
                        <div className="email">Email:</div>
                        <input type="email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div className="password-container">
                        <div className="password">Password:</div>
                        <input type="password" value={password} onChange={handlePasswordChange} required />
                    </div>
                    <div className="no-account-container">
                        Don't have an account?
                        <button className="sign-up-button" onClick={handleClick}>
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

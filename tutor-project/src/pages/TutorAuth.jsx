import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './TutorAuth.css';

export function TutorAuth() {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage('');
        setName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        const endpoint = isLogin ? '/api/auth/tutor-login' : '/api/auth/tutor-signup';
        const payload = isLogin ? { email, password } : { name, email, password };

        axios.post(endpoint, payload, { withCredentials: true })
            .then(result => {
                if (isLogin) {
                    navigate('/tutor-dashboard');
                } else {
                    // On successful signup, switch to the login view
                    setIsLogin(true);
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else if (err.response && (err.response.status === 400 || err.response.status === 401)) {
                    setErrorMessage("Invalid credentials. Please try again.");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            });
    };

    return (
        <>
            <Header />
            <div className="tutor-auth-container">
                <div className="greeting-header">Hi there, Tutor</div>
                <h2>{isLogin ? 'Tutor Login' : 'Tutor Registration'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="name-container">
                            <div className="name">Name:</div>
                            <input 
                                type="text" 
                                name="name"
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                    )}
                    <div className="email-container">
                        <div className="email">Email:</div>
                        <input 
                            type="email" 
                            name="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="password-container">
                        <div className="password">Password:</div>
                        <input 
                            type="password" 
                            name="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {errorMessage && (
                        <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                            {errorMessage}
                        </div>
                    )}

                    <div className="button-container">
                        <button type="submit" className="submit-button">
                            {isLogin ? 'Login' : 'Sign up'}
                        </button>
                    </div>

                    <div className={isLogin ? "no-account-container" : "existing-account-container"}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" className={isLogin ? "sign-up-button" : "login-button"} onClick={toggleAuthMode}>
                            {isLogin ? 'Sign Up Here' : 'Log In Here'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

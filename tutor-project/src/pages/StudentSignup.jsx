import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import './StudentSignup.css';

export function StudentSignup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = () => {
        navigate('/student-login');
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/api/auth/student-signup', {name, email, password})
        .then(result =>{
            console.log(result);
        }).catch(err => {
            console.error(err);
        });
    }
    return (
        <>
            <Header />
            <div className="student-signup-container">
                <div className="greeting-header">Hi there, Student</div>
                <h2>Student Registration</h2>
                <form onSubmit={handleSubmit}>

                    <div className="name-container">
                        <div className="name">Name:</div>
                        <input type="text" name="name"
                            required onChange={handleNameChange} />
                    </div>
                    <div className="email-container">
                        <div className="email"
                        >Email:</div>
                        <input type="email" name="email" required onChange={handleEmailChange} />
                    </div>
                    <div className="password-container">
                        <div className="password"
                        >Password:</div>
                        <input type="password" name="password" required onChange={handlePasswordChange} />
                    </div>
                    <div className="existing-account-container">
                        Already have an account?
                        <button className="login-button" onClick={handleClick}>
                            Log In Here
                        </button>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="submit-button">Sign up</button>
                    </div>
                </form>
            </div>
        </>
    );
}
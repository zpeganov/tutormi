import axios from "axios";
import { useState, useEffect } from "react";
import './ProfilePage.css';
import { Header } from "../components/Header";

export function ProfilePage() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/student-profile', { withCredentials: true });
                setStudent(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>Error loading profile: {error.message}</p>;
    }

    return (
        <div className="profile-page">
            <h1>{student.name}'s Profile</h1>
            {student && (
                <div className="profile-details">
                    <div className="detail-item">
                        <strong>Name:</strong>
                        <span>{student.name}</span>
                    </div>
                    <div className="detail-item">
                        <strong>Email:</strong>
                        <span>{student.email}</span>
                    </div>
                    {/* Add more student details here as needed */}
                </div>
            )}
        </div>
    );
}

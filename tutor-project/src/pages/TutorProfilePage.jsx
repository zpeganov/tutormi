import axios from "axios";
import { useState, useEffect } from "react";
import './ProfilePage.css';

export function TutorProfilePage() {
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/tutor-profile', { withCredentials: true });
                setTutor(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorData();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>Error loading profile: {error.message}</p>;
    }

    return (
        <div className="profile-page">
            <h1>{tutor.name}'s Profile</h1>
            {tutor && (
                <div className="profile-details">
                    <div className="detail-item">
                        <strong>Name:</strong>
                        <span>{tutor.name}</span>
                    </div>
                    <div className="detail-item">
                        <strong>Email:</strong>
                        <span>{tutor.email}</span>
                    </div>
                    {/* Add more tutor details here as needed */}
                </div>
            )}
        </div>
    );
}

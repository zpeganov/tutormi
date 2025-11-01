import { useState, useEffect } from 'react';
import axios from 'axios';
import './TutorLessonPlans.css';

export function TutorLessonPlans() {
    const [lessonPlans, setLessonPlans] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Function to fetch lesson plans from the server
    const fetchLessonPlans = async () => {
        try {
            const response = await axios.get('/api/lesson-plans', { withCredentials: true });
            if (Array.isArray(response.data)) {
                setLessonPlans(response.data);
            } else {
                setError('Received invalid data from server.');
            }
        } catch (err) {
            setError('Failed to fetch lesson plans. Please ensure you are logged in.');
            console.error(err);
        }
    };

    // Fetch lesson plans when the component first loads
    useEffect(() => {
        fetchLessonPlans();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!file || !title) {
            setError('Please provide a title and select a file.');
            return;
        }

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            const response = await axios.post('/api/lesson-plans/upload', formData, {
                headers: {
                    // The browser will set the correct 'Content-Type' for multipart/form-data
                },
                withCredentials: true
            });
            
            setMessage(response.data.message);
            setTitle('');
            setFile(null);
            document.getElementById('lesson-content').value = ''; // Clear the file input
            
            // Refresh the list of lesson plans
            fetchLessonPlans(); 

        } catch (err) {
            setError(err.response?.data?.message || 'File upload failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="lesson-plans-container">
            <h1 className="managelessonplans-title">Manage Lesson Plans</h1>

            {/* Upload Form Section */}
            <div className="upload-section card">
                <h2>Upload New Lesson Plan</h2>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="lesson-title">Lesson Title:</label>
                        <input 
                            type="text" 
                            id="lesson-title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lesson-content">Lesson Content (PDF):</label>
                        <input 
                            type="file" 
                            id="lesson-content" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            required 
                        />
                    </div>
                    <div className="submit-input">
                        <button type="submit" className="submit-button">Upload Lesson Plan</button>
                    </div>
                </form>
            </div>

            {/* Display Uploaded Lesson Plans Section */}
            <div className="lesson-list-section card">
                <h2>Your Uploaded Plans</h2>
                {lessonPlans.length > 0 ? (
                    <ul className="lesson-list">
                        {lessonPlans.map((plan) => (
                            <li key={plan._id} className="lesson-item">
                                <span>{plan.title}</span>
                                <a href={plan.fileUrl} target="_blank" rel="noopener noreferrer" className="view-btn">
                                    View PDF
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You haven't uploaded any lesson plans yet.</p>
                )}
            </div>
        </div>
    );
}
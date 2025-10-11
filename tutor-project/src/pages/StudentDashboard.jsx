import axios from "axios";
import {useState, useEffect} from "react";
export function StudentDashboard() {
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
    return(
        <div>
            Welcome, Student {student ? student.name : 'Loading...'}
        </div>
    );
}
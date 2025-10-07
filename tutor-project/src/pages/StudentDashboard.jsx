import axios from "axios";
export function StudentDashboard() {

    const studentName = async () =>{

        const response = await axios.get('http://localhost:3000/api/auth/student-login');
        return response.data.name;
    }
    return(
        <div>
            Welcome, Student {studentName()}
        </div>
    );
}
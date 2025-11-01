import Student from "../models/Student.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const registerStudent = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const studentid = 'STUDENT' + Date.now();
        const tutorids = [];
        const student = new Student({ name, email, password: hashed, studentid, tutorids });
        await student.save();
        res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if student exists
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if passwords match
        const isMatch = await bcrypt.compare(password, student.password);
        if (isMatch) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("Generated Token:", token); // Debugging line
            res.cookie('token', token, { httpOnly: true });
            return res.json({ message: "Login successful", token });
        } else if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
} 

export const addTutorToStudent = async (req, res) => {
    try {
        const { studentId, tutorId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Avoid adding duplicate tutor IDs
        if (!student.tutorids.includes(tutorId)) {
            student.tutorids.push(tutorId);
            await student.save();
        }

        res.status(200).json({ message: "Tutor added to student successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

// The new, secure way to write getStudentProfile
export const getStudentProfile = async (req, res) => {
    // The 'protect' middleware has already fetched and validated the student.
    // We can just send the user object that the middleware attached to the request.
    res.status(200).json(req.student);
}
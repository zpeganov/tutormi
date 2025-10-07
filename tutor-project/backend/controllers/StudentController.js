import Student from "../models/Student.js";
import bcrypt from 'bcryptjs';
import {jwt} from 'jsonwebtoken';
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
        const student = new Student({ name, email, password: hashed });
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

// The new, secure way to write getStudentProfile
export const getStudentProfile = async (req, res) => {
    try {
        // The user's ID comes from the authenticated token, not the request body.
        const studentId = req.student.id; 
        
        const student = await Student.findById(studentId).select('-password');

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}
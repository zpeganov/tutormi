import Student from "../models/Student.js";
import bcrypt from 'bcryptjs';

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
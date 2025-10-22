import Tutor from "../models/Tutor.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerTutor = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingTutor = await Tutor.findOne({ email });
        if (existingTutor) {
            return res.status(400).json({ message: "Tutor already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const tutor = new Tutor({ name, email, password: hashed });
        await tutor.save();
        res.status(201).json({ message: "Tutor registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const loginTutor = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if tutor exists
        const tutor = await Tutor.findOne({ email });
        if (!tutor) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if passwords match
        const isMatch = await bcrypt.compare(password, tutor.password);
        if (isMatch) {
            const token = jwt.sign({ id: tutor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.cookie('tutor_token', token, { httpOnly: true });
            return res.json({ message: "Login successful", token });
        } else if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
} 

// The new, secure way to write getTutorProfile
export const getTutorProfile = async (req, res) => {
    // The 'protect' middleware has already fetched and validated the tutor.
    // We can just send the user object that the middleware attached to the request.
    res.status(200).json(req.tutor);
}


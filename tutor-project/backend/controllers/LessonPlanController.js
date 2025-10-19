import LessonPlan from '../models/LessonPlan.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '../config/s3.js';
import crypto from 'crypto';

const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

export const uploadLessonPlan = async (req, res) => {
    // The 'protectTutor' middleware attaches the authenticated tutor to req.tutor
    if (!req.tutor) {
        return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required." });
    }

    // 1. Send file to S3
    const imageName = randomImageName();
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    try {
        await s3Client.send(command);
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${imageName}`;

        // 2. Save LessonPlan to MongoDB
        const lessonPlan = new LessonPlan({
            title,
            fileUrl,
            tutor: req.tutor._id // Use the ID from the authenticated tutor
        });

        await lessonPlan.save();
        res.status(201).json({ message: "Lesson plan uploaded successfully", lessonPlan });

    } catch (error) {
        console.error("Error uploading lesson plan:", error);
        res.status(500).json({ message: "Error uploading lesson plan" });
    }
};

export const getLessonPlans = async (req, res) => {
    // The 'protectTutor' middleware attaches the authenticated tutor to req.tutor
    if (!req.tutor) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        // Fetch only the lesson plans belonging to the logged-in tutor
        const lessonPlans = await LessonPlan.find({ tutor: req.tutor._id });
        res.status(200).json(lessonPlans);
    } catch (error) {
        console.error("Error fetching lesson plans:", error);
        res.status(500).json({ message: "Error fetching lesson plans" });
    }
};


import LessonPlan from '../models/LessonPlan.js';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    const s3Key = randomImageName(); // Use s3Key to be more descriptive
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    try {
        await s3Client.send(command);

        // 2. Save LessonPlan to MongoDB with the S3 key
        const lessonPlan = new LessonPlan({
            title,
            s3Key, // Store the key instead of the full URL
            tutor: req.tutor._id // Use the ID from the authenticated tutor
        });

        await lessonPlan.save();
        // We'll send back the plan without the fileUrl, the frontend will get it from getLessonPlans
        const newPlan = { ...lessonPlan.toObject(), fileUrl: '' }; // Create a placeholder
        res.status(201).json({ message: "Lesson plan uploaded successfully", lessonPlan: newPlan });

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

        // Create pre-signed URLs for each lesson plan
        const plansWithUrls = await Promise.all(lessonPlans.map(async (plan) => {
            // Defensive check: If there's no s3Key, it's old data.
            // Return the plan without a fileUrl to prevent a crash.
            if (!plan.s3Key) {
                return { ...plan.toObject(), fileUrl: '#' }; // Return a placeholder
            }

            const getObjectParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: plan.s3Key,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
            
            // Return a new object combining plan data and the new fileUrl
            return { ...plan.toObject(), fileUrl: url };
        }));

        res.status(200).json(plansWithUrls);
    } catch (error) {
        console.error("Error fetching lesson plans:", error);
        res.status(500).json({ message: "Error fetching lesson plans" });
    }
};


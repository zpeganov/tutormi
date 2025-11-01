import mongoose from 'mongoose';

const TutorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tutorid: {
        type: String,
        required: true,
        unique: true
    },
    studentids: {
        type: [String],
        default: []
    }

}, { timestamps: true });

export default mongoose.model("TutorData", TutorSchema);
import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
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
    studentid: {
        type: String,
        required: true,
        unique: true
    },
    tutorids: {
        type: [String],
        default: []
    }

}, { timestamps: true });

export default mongoose.model("StudentData", StudentSchema);
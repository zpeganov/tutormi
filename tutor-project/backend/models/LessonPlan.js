import mongoose from 'mongoose';

const lessonPlanSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  // Stores the S3 object key, not the full URL
  s3Key: { 
    type: String, 
    required: true 
  },
  
  // Link to Tutor
  tutor: { 
    type: mongoose.Schema.Types.ObjectId, // Stores the tutor's _id
    ref: 'Tutor', // Tells Mongoose this refers to the 'Tutor' model
    required: true 
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const LessonPlan = mongoose.model('LessonPlan', lessonPlanSchema);
export default LessonPlan;

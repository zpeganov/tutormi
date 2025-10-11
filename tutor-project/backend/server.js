import express from 'express'; 
import StudentModel from './models/Student.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/StudentRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
});


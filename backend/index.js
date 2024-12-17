
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js'
import cors from 'cors';
import leaveRoutes from './routes/leaveRoutes.js'
import facerecogRoute from './routes/facerecogRoute.js'
import attendanceRoutes from './routes/attendanceRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,               
};

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/student-leavedetail', leaveRoutes)
app.use('/api/facerecognition', facerecogRoute);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

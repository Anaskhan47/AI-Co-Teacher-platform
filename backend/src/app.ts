import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import logger from './lib/logger.js';

import authRoutes from './routes/auth.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import curriculumRoutes from './routes/curriculum.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import materialRoutes from './routes/material.routes.js';
import messageRoutes from './routes/message.routes.js';
import examRoutes from './routes/exam.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import studentDashboardRoutes from './routes/student_dashboard.routes.js';
import parentDashboardRoutes from './routes/parent_dashboard.routes.js';
import studentRoutes from './routes/student.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// ---- Security & Core Middleware ----
app.use(helmet({
    contentSecurityPolicy: false, 
}));

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:5173,http://localhost:3000,http://localhost:8081').split(',');

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:')) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        
        if (NODE_ENV === 'production') {
            logger.warn(`[SECURITY] CORS Blocked: ${origin}`);
            return callback(new Error('Not allowed by CORS'));
        }
        callback(null, true);
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ---- ADVANCED LOGGING & REQUEST TRACKING ----
app.use((req, res, next) => {
    const start = Date.now();
    const requestId = Math.random().toString(36).substring(2, 11).toUpperCase();
    res.setHeader('X-Request-ID', requestId);

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        const logData = {
            requestId,
            method: req.method,
            path: req.originalUrl,
            status: statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        };

        if (statusCode >= 400) {
            logger.warn(`API_REQUEST_FAILURE: ${req.method} ${req.originalUrl}`, logData);
        } else if (NODE_ENV !== 'production') {
            logger.info(`API_REQUEST_SUCCESS: ${req.method} ${req.originalUrl}`, logData);
        }
    });
    next();
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/student-dashboard', studentDashboardRoutes);
app.use('/api/parent-dashboard', parentDashboardRoutes);
app.use('/api/ai', analysisRoutes);

app.get('/api/health', (_req, res) => res.json({ 
    success: true, 
    data: { status: 'ok', environment: NODE_ENV, uptime: process.uptime() } 
}));

// ---- ADVANCED GLOBAL ERROR HANDLER ----
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestId = res.getHeader('X-Request-ID') || 'INTERNAL';
    
    logger.error('UNHANDLED_SERVER_ERROR', {
        requestId,
        error: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(err.status || 500).json({ 
        success: false,
        data: null,
        error: NODE_ENV === 'production' 
            ? "An internal processing error occurred. Our engineers have been notified." 
            : err.message,
        requestId,
        timestamp: new Date().toISOString()
    });
});

export default app;

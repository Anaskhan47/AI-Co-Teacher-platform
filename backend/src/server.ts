import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import lessonRoutes from './routes/lesson.routes';
import attendanceRoutes from './routes/attendance.routes';
import curriculumRoutes from './routes/curriculum.routes';
import dashboardRoutes from './routes/dashboard.routes';
import assignmentRoutes from './routes/assignment.routes';
import quizRoutes from './routes/quiz.routes';
import materialRoutes from './routes/material.routes';
import messageRoutes from './routes/message.routes';
import examRoutes from './routes/exam.routes';
import uploadRoutes from './routes/upload.routes';
import studentDashboardRoutes from './routes/student_dashboard.routes';
import parentDashboardRoutes from './routes/parent_dashboard.routes';
import studentRoutes from './routes/student.routes';
import analysisRoutes from './routes/analysis.routes';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ---- Allowed origins ----
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:5173,http://localhost:3000,http://localhost:8081').split(',');

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl)
        if (!origin) return callback(null, true);
        
        // Match localhost with any port in development
        if (origin.startsWith('http://localhost:')) return callback(null, true);

        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const REDACT_KEYS = new Set([
    'password',
    'token',
    'authorization',
    'pdfText',
    'file',
    'content',
    'body',
]);

function redact(value: unknown, key?: string): unknown {
    if (key && REDACT_KEYS.has(key)) return '[REDACTED]';
    if (Array.isArray(value)) return value.map((v) => redact(v));
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            out[k] = redact(v, k);
        }
        return out;
    }
    if (typeof value === 'string' && value.length > 500) return `${value.substring(0, 500)}...[TRUNCATED]`;
    return value;
}

// LOGGING MIDDLEWARE (redacted, dev-focused)
app.use((req, _res, next) => {
    console.log(`\n[API] ${req.method} ${req.originalUrl}`);

    if (NODE_ENV !== 'production' && req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        try {
            console.log(`[BODY] ${JSON.stringify(redact(req.body))}`);
        } catch {
            console.log('[BODY] [unserializable]');
        }
    }

    next();
});

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

app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() }, error: null }));

// GLOBAL ERROR HANDLER
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("CRITICAL SERVER ERROR:", err.stack);
    res.status(500).json({ 
        success: false,
        data: null,
        error: err.message || "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
});

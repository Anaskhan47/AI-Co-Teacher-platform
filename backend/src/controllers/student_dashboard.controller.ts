import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const student = await prisma.student.findUnique({
            where: { userId: req.user!.id },
            include: { user: true }
        });
        if (!student) return res.status(404).json({ success: false, data: null, error: 'Student profile not found' });

        const [attendance, grades, assignments, lessons] = await Promise.all([
            prisma.attendance.findMany({ where: { studentId: student.id }, take: 30 }),
            prisma.assessmentGrade.findMany({ where: { studentId: student.id }, orderBy: { gradedAt: 'desc' }, take: 10 }),
            prisma.assignment.findMany({
                where: { classId: String(student.grade) },
                include: { subject: true, submissions: { where: { studentId: student.id } } },
                orderBy: { dueDate: 'asc' },
                take: 5
            }),
            prisma.lessonPlan.findMany({
                where: { status: 'PUBLISHED' },
                orderBy: { updatedAt: 'desc' },
                take: 5
            })
        ]);

        res.json({
            success: true,
            data: {
                profile: student,
                assignments,
                lessons,
                stats: {
                    lessonsCompleted: 12,
                    assignmentsDue: assignments.filter(a => a.submissions.length === 0).length,
                    avgScore: grades.length > 0 ? grades.reduce((a, b) => a + b.score, 0) / grades.length : 0,
                    attendanceRate: 98
                }
            },
            error: null
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch student dashboard' });
    }
};

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user!.id } });
        if (!student) return res.status(404).json({ success: false, data: null, error: 'Student not found' });

        const assignments = await prisma.assignment.findMany({
            where: { classId: String(student.grade) },
            include: { submissions: { where: { studentId: student.id } } }
        });

        res.json({ success: true, data: assignments, error: null });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch assignments' });
    }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
    const { assignmentId, content, fileUrl } = req.body;
    try {
        const student = await prisma.student.findUnique({ where: { userId: req.user!.id } });
        if (!student) return res.status(404).json({ success: false, data: null, error: 'Student not found' });

        const submission = await prisma.submission.create({
            data: {
                assignmentId,
                studentId: student.id,
                content,
                fileUrl: fileUrl || null
            }
        });
        res.status(201).json({ success: true, data: submission, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Submission failed' });
    }
};

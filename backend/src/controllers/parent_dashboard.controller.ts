import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getParentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const parentId = req.user!.id;

        // Find students linked to this parent
        const students = await prisma.student.findMany({
            where: { parentId },
            include: {
                user: { select: { name: true, email: true } },
                attendance: { orderBy: { date: 'desc' }, take: 10 },
                grades: { orderBy: { gradedAt: 'desc' }, take: 10 },
                submissions: {
                    orderBy: { submittedAt: 'desc' },
                    take: 5,
                    include: { assignment: true }
                }
            }
        });

        if (students.length === 0) {
            return res.status(404).json({ success: false, data: null, error: 'No children linked to this parent account.' });
        }

        const primaryChild = students[0];
        const presentCount = primaryChild.attendance.filter((a: any) => a.status === 'PRESENT').length;
        const totalAttendance = primaryChild.attendance.length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

        // Recently sent/received messages
        const messages = await prisma.message.findMany({
            where: {
                OR: [{ senderId: parentId }, { receiverId: parentId }]
            },
            include: {
                sender: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json({
            success: true,
            data: {
                children: students,
                stats: {
                    attendanceRate: Math.round(attendanceRate),
                    avgGrade: primaryChild.grades.length > 0
                        ? Math.round(primaryChild.grades.reduce((a: number, b: any) => a + (b.score / b.maxScore * 100), 0) / primaryChild.grades.length)
                        : 0,
                    pendingAssignments: primaryChild.submissions.filter((s: any) => !s.grade).length
                },
                recentMessages: messages
            },
            error: null
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch parent dashboard data' });
    }
};

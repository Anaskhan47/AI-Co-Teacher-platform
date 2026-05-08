import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getStudentsByClass = async (req: AuthRequest, res: Response) => {
    const { grade, section } = req.query;
    try {
        const students = await prisma.student.findMany({
            where: {
                grade: parseInt(grade as string),
                section: section as string
            },
            include: { user: true }
        });

        if (students.length === 0) {
            // Return Mock Data for Demo
            const mockData = [
                { id: "s1", userId: "u1", grade: 10, section: "A", rollNo: 101, user: { name: "Aarav Patel", email: "aarav@example.com" } },
                { id: "s2", userId: "u2", grade: 10, section: "A", rollNo: 102, user: { name: "Vihaan Singh", email: "vihaan@example.com" } },
                { id: "s3", userId: "u3", grade: 10, section: "A", rollNo: 103, user: { name: "Aditya Kumar", email: "aditya@example.com" } },
                { id: "s4", userId: "u4", grade: 10, section: "A", rollNo: 104, user: { name: "Diya Gupta", email: "diya@example.com" } },
                { id: "s5", userId: "u5", grade: 10, section: "A", rollNo: 105, user: { name: "Ananya Reddy", email: "ananya@example.com" } },
            ];
            return res.json({ success: true, data: mockData, error: null });
        }

        res.json({ success: true, data: students, error: null });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch students' });
    }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
    const { date, attendanceData, classId } = req.body;
    try {
        if (!date || !attendanceData || !classId) {
            return res.status(400).json({ success: false, data: null, error: 'Missing required fields: date, attendanceData, or classId' });
        }

        if (!Array.isArray(attendanceData)) {
            return res.status(400).json({ success: false, data: null, error: 'attendanceData must be an array' });
        }

        const teacherId = req.user!.id;
        
        const records = attendanceData.map((record: any) => ({
            date: new Date(date),
            status: record.status || 'PRESENT',
            studentId: record.studentId,
            teacherId: teacherId,
            classId: String(classId)
        }));

        // Validate that all records have studentId
        if (records.some(r => !r.studentId)) {
            return res.status(400).json({ success: false, data: null, error: 'All attendance records must have a studentId' });
        }

        await prisma.attendance.createMany({
            data: records
        });

        res.status(201).json({ success: true, data: { message: 'Attendance marked successfully' }, error: null });
    } catch (error: any) {
        console.error("Attendance Marking Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to save attendance' });
    }
};

export const getAttendanceHistory = async (req: AuthRequest, res: Response) => {
    const { classId, startDate, endDate } = req.query;
    try {
        const history = await prisma.attendance.findMany({
            where: {
                classId: classId as string,
                date: {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string)
                }
            },
            include: {
                student: {
                    include: { user: true }
                }
            }
        });

        res.json({ success: true, data: history, error: null });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch history' });
    }
};

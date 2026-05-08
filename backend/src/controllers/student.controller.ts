import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const getStudentsByClass = async (req: Request, res: Response) => {
    const { grade, section } = req.query;
    try {
        const students = await prisma.student.findMany({
            where: {
                grade: grade ? parseInt(grade as string) : undefined,
                section: section ? section as string : undefined
            },
            include: {
                user: true
            }
        });

        const formatted = students.map(s => ({
            id: s.id,
            ...s,
            user: { name: s.user.name, email: s.user.email }
        }));

        res.json({ success: true, data: formatted, error: null });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch students' });
    }
};

export const getStudentsDetailed = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: true,
                grades: true,
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        });

        if (students.length === 0) {
            // Mock Data for Demo
            const mockData = [
                { id: "mj1", name: "Aarav Patel", email: "aarav@example.com", grade: 10, section: "A", avgPerformance: 85, lastAttendance: "PRESENT" },
                { id: "mj2", name: "Vihaan Singh", email: "vihaan@example.com", grade: 10, section: "B", avgPerformance: 92, lastAttendance: "PRESENT" },
                { id: "mj3", name: "Aditya Kumar", email: "aditya@example.com", grade: 9, section: "A", avgPerformance: 78, lastAttendance: "ABSENT" },
                { id: "mj4", name: "Diya Gupta", email: "diya@example.com", grade: 10, section: "A", avgPerformance: 88, lastAttendance: "PRESENT" },
                { id: "mj5", name: "Ananya Reddy", email: "ananya@example.com", grade: 10, section: "C", avgPerformance: 95, lastAttendance: "PRESENT" }
            ];
            return res.json({ success: true, data: mockData, error: null });
        }

        const formatted = students.map(s => {
            const avgScore = s.grades.length > 0
                ? (s.grades.reduce((acc, g) => acc + (g.score / g.maxScore), 0) / s.grades.length) * 100
                : 0;

            return {
                id: s.id,
                name: s.user.name,
                email: s.user.email,
                grade: s.grade,
                section: s.section,
                avgPerformance: Math.round(avgScore),
                lastAttendance: s.attendance[0]?.status || 'N/A'
            };
        });

        res.json({ success: true, data: formatted, error: null });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch detailed roster' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    const { name, email, grade, section, rollNo } = req.body;
    try {
        if (!name || !email || !grade) {
            return res.status(400).json({ success: false, data: null, error: 'Missing required fields' });
        }

        const tempPassword = crypto.randomBytes(12).toString('base64url'); // ~16 chars, URL-safe
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 1. Create User Account + Student Profile in one transaction
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'STUDENT',
                student: {
                    create: {
                        grade: parseInt(grade),
                        section,
                        // rollNo: parseInt(rollNo), // Add to schema if needed, skipping for now
                    }
                }
            },
            include: { student: true }
        });

        res.status(201).json({
            success: true,
            data: {
                id: result.student?.id,
                name,
                email,
                grade,
                section,
                tempPassword,
                avgPerformance: 0,
                lastAttendance: 'N/A'
            },
            error: null
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to create student' });
    }
};

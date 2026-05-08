import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { AIService } from '../services/ai.service';
import { BoardType } from '@prisma/client';
import { resolveCurriculumTopic } from '../lib/curriculum-resolver';

export const generateAssignmentContent = async (req: AuthRequest, res: Response) => {
    let { topic, grade, subject, curriculum: board, pdfText } = req.body;
    try {
        let finalTopicId = "";
        let finalSubjectId = "";

        // Dynamic Entity Resolution (transactional, deduplicated)
        if (board && grade && subject && topic) {
            const gradeNum = parseInt(grade);
            const resolved = await resolveCurriculumTopic(prisma, {
                board: board as BoardType,
                grade: gradeNum,
                subjectName: subject,
                topicName: topic,
            });
            finalSubjectId = resolved.subject.id;
            finalTopicId = resolved.topic.id;
        }

        const assignmentType = req.body.assignmentType || "Homework";
        const difficultyLevel = req.body.difficultyLevel || "Medium";
        const requestedCount = Math.max(3, Math.min(20, Number(req.body.count) || 6));

        console.log(`[ASSIGNMENT] Generating AI content for topic: ${topic}`);
        let aiResponse;
        try {
            const result = await AIService.generateAssignment(topic, grade, subject, assignmentType, difficultyLevel, pdfText || "", requestedCount);
            aiResponse = { ...result.data, aiMeta: result.meta };
        } catch (aiErr: any) {
            console.error("[ASSIGNMENT] AI Generation crashed:", aiErr.message);
            aiResponse = null;
        }

        // Fallback logic if AI utterly fails
        if (!aiResponse || !aiResponse.title) {
            console.warn("[ASSIGNMENT] Using fallback structure due to AI failure.");
            aiResponse = {
                title: `${assignmentType}: ${topic} (Fallback)`,
                instructions: `Complete this assignment on ${topic}.`,
                shortQuestions: [`Explain the core concepts of ${topic}.`],
                longQuestions: [`Discuss ${topic} with one real-world example.`],
                practicalActivities: [`Describe an application of ${topic}.`],
                criticalThinking: [`Why is ${topic} important in ${subject}?`],
                submissionGuidelines: `Submit neatly with examples.`,
                answers: { assignmentQuestions: ["Pending"], activityQuestions: ["Pending"] },
                aiMeta: { provider: 'simulation', attempts: 0, validated: true, parseRecovered: false, error: 'AI generation failed' }
            };
        }

        const assignmentQuestions = [
            ...(aiResponse.shortQuestions || []),
            ...(aiResponse.longQuestions || []),
            ...(aiResponse.assignmentQuestions || []),
            ...(aiResponse.criticalThinking || []),
        ].slice(0, requestedCount);
        const activityQuestions = [
            ...(aiResponse.practicalActivities || []),
            ...(aiResponse.activityQuestions || []),
        ];

        const teacherId = req.user?.id;
        if (!teacherId) return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });

        if (!finalTopicId && !req.body.topicId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "topicId is required"
            });
        }

        const assignment = await prisma.assignment.create({
            data: {
                title: aiResponse.title,
                description: aiResponse.instructions || null,
                assignmentQuestions: assignmentQuestions as any,
                activityQuestions: activityQuestions as any,
                answers: aiResponse.answers as any,
                teacherId,
                grade: parseInt(grade) || 10,
                subjectId: finalSubjectId || null,
                topicId: finalTopicId || null,
                source: 'AI',
                status: 'DRAFT',
            }
        });

        res.json({ success: true, data: { ...assignment, aiMeta: aiResponse.aiMeta }, error: null });
    } catch (error: any) {
        console.error("[CRITICAL] Assignment Generation Failure:\n", error.stack);
        res.status(500).json({ 
            success: false,
            data: null,
            error: error.message || 'Failed to generate assignment'
        });
    }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
    try {
        const limitRaw = (req.query.limit as string) || '50';
        const limit = Math.min(Math.max(parseInt(limitRaw) || 50, 1), 100);
        const assignments = await prisma.assignment.findMany({
            where: { teacherId: req.user!.id },
            include: { subject: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        res.json({ success: true, data: assignments, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch assignments' });
    }
};

export const createAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, subjectId, classId, dueDate, fileUrl, subject, grade, maxScore } = req.body;

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                subjectId,
                classId,
                dueDate: dueDate ? new Date(dueDate) : null,
                fileUrl,
                grade: parseInt(grade) || 10,
                maxScore: parseFloat(maxScore) || 100,
                teacherId: req.user!.id,
                source: 'MANUAL'
            }
        });

        res.status(201).json({ success: true, data: assignment, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to create assignment' });
    }
};

export const getAssignmentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const assignment = await prisma.assignment.findFirst({
            where: { id, teacherId: req.user!.id },
            include: { subject: true, submissions: true }
        });

        if (!assignment) return res.status(404).json({ success: false, data: null, error: 'Assignment not found' });
        res.json({ success: true, data: assignment, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch assignment' });
    }
};

export const updateAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status, title, description, dueDate, maxScore } = req.body;

        const result = await prisma.assignment.updateMany({
            where: { id, teacherId: req.user!.id },
            data: {
                status,
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                maxScore: maxScore ? parseFloat(maxScore) : undefined
            }
        });

        if (result.count === 0) return res.status(404).json({ success: false, data: null, error: 'Assignment not found' });
        res.json({ success: true, data: { id, message: 'Updated' }, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to update assignment' });
    }
};

export const deleteAssignment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.assignment.deleteMany({ where: { id, teacherId: req.user!.id } });
        if (result.count === 0) return res.status(404).json({ success: false, data: null, error: 'Assignment not found' });
        res.json({ success: true, data: null, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to delete assignment' });
    }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await prisma.assignment.findFirst({
            where: { id: assignmentId, teacherId: req.user!.id },
            select: { id: true }
        });
        if (!assignment) return res.status(404).json({ success: false, data: null, error: 'Assignment not found' });

        const submissions = await prisma.submission.findMany({
            where: { assignmentId: assignment.id },
            include: { student: { include: { user: true } } }
        });
        res.json({ success: true, data: submissions, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch submissions' });
    }
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;
        const submissionOwned = await prisma.submission.findFirst({
            where: { id: submissionId, assignment: { teacherId: req.user!.id } },
            select: { id: true }
        });
        if (!submissionOwned) return res.status(404).json({ success: false, data: null, error: 'Submission not found' });

        const submission = await prisma.submission.update({
            where: { id: submissionOwned.id },
            data: { grade: grade ? parseFloat(grade) : null, feedback }
        });
        res.json({ success: true, data: submission, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to grade submission' });
    }
};

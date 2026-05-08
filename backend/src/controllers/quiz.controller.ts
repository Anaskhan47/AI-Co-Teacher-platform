import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { AIService } from '../services/ai.service';
import { BoardType } from '@prisma/client';
import { resolveCurriculumTopic } from '../lib/curriculum-resolver';

export const generateQuizAI = async (req: AuthRequest, res: Response) => {
    let { topicId, grade, curriculum: board, subject: subjectName, topic: topicName, pdfText } = req.body;
    try {
        let tName = topicName;
        let sName = subjectName;
        let finalTopicId = topicId;

        // Dynamic Entity Resolution (transactional, deduplicated)
        if (board && grade && subjectName && topicName) {
            const gradeNum = parseInt(grade);
            const resolved = await resolveCurriculumTopic(prisma, {
                board: board as BoardType,
                grade: gradeNum,
                subjectName,
                topicName,
            });
            finalTopicId = resolved.topic.id;
        } else if (topicId) {
            const topic = await prisma.topic.findUnique({ where: { id: topicId } });
            if (!topic) return res.status(404).json({ success: false, data: null, error: 'Topic not found' });
            tName = topic.name;
        }

        if (!tName) return res.status(400).json({ success: false, data: null, error: 'Topic name is required' });

        const qType = req.body.questionType || "MCQ";
        const bLevel = req.body.bloomLevel || "Mixed";
        const count = req.body.count || 5;

        const { data: aiResponse, meta } = await AIService.generateQuiz(tName, grade || "10", sName || "General", qType, bLevel, count, pdfText || "");

        const quiz = await prisma.quiz.create({
            data: {
                title: req.body.quizTitle || aiResponse.title || `Quiz: ${tName}`,
                questions: aiResponse.questions as any,
                topicId: finalTopicId
            }
        });

        res.json({
            success: true,
            data: {
                ...quiz,
                topicName: tName,
                subjectName: sName,
                aiMeta: meta
            },
            error: null
        });
    } catch (error: any) {
        console.error("Quiz Generation Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to generate quiz' });
    }
};

export const saveQuiz = async (req: AuthRequest, res: Response) => {
    const { title, topicId, questions } = req.body;
    try {
        const quiz = await prisma.quiz.create({
            data: {
                title,
                topicId: topicId || '',
                questions: questions as any
            }
        });
        res.status(201).json({ success: true, data: quiz, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to save quiz' });
    }
};

export const getQuizzes = async (req: AuthRequest, res: Response) => {
    try {
        const limitRaw = (req.query.limit as string) || '50';
        const limit = Math.min(Math.max(parseInt(limitRaw) || 50, 1), 100);
        const quizzes = await prisma.quiz.findMany({
            include: { topic: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        res.json({ success: true, data: quizzes, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch quizzes' });
    }
};

export const getQuizById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: { topic: true }
        });
        if (quiz) return res.json({ success: true, data: quiz, error: null });

        // Fallback: Check LessonPlan
        const lesson = await prisma.lessonPlan.findUnique({
            where: { id }
        });
        if (lesson) return res.json({ success: true, data: lesson, error: null });

        return res.status(404).json({ success: false, data: null, error: 'Quiz not found' });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch quiz' });
    }
};

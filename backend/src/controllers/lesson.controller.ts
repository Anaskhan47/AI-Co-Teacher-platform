import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { AIService } from '../services/ai.service';
import { BoardType } from '@prisma/client';
import fs from 'fs';
import pdfParse from "pdf-parse";
import { resolveCurriculumTopic } from '../lib/curriculum-resolver';

export const createLesson = async (req: AuthRequest, res: Response) => {
    const requestId = res.getHeader('X-Request-ID') as string || 'INTERNAL';
    
    try {
        logger.info('CREATE_LESSON_PROTOCOL_INITIATED', { requestId, teacherId: req.user?.id });

        let { title, subjectId, topicId, grade, objective, duration, activities, homework, resources, aiAssist, curriculum: board, subject: subjectName, topic: topicName, pdfText, unitDetails, numSessions, detailLevel } = req.body;

        let finalSubjectId = subjectId;
        let finalTopicId = topicId;

        // --- DYNAMIC ENTITY RESOLUTION (transactional, deduplicated) ---
        if (board && grade && subjectName && topicName) {
            logger.debug('RESOLVING_CURRICULUM_ENTITIES', { requestId, board, grade, subjectName, topicName });
            const gradeNum = parseInt(grade);
            const { subject, topic } = await resolveCurriculumTopic(prisma, {
                board: board as BoardType,
                grade: gradeNum,
                subjectName,
                topicName,
            });
            finalSubjectId = subject.id;
            finalTopicId = topic.id;
        }

        // --- AI GENERATION WITH FALLBACKS ---
        let aiData: any = null;
        let aiMeta: any = null;
        if (aiAssist || (board && grade)) {
            logger.info('INVOKING_AI_SYNTHESIS_ENGINE', { requestId, topicName });
            let sName = subjectName;
            let tName = topicName;

            if (!sName && finalSubjectId) {
                const s = await prisma.subject.findUnique({ where: { id: finalSubjectId } });
                sName = s?.name;
            }
            if (!tName && finalTopicId) {
                const t = await prisma.topic.findUnique({ where: { id: finalTopicId } });
                tName = t?.name;
            }

            if (!tName || !sName) {
                logger.warn('AI_SYNTHESIS_ABORTED: Missing Context', { requestId });
                return res.status(400).json({ success: false, data: null, error: 'Invalid Subject or Topic context' });
            }

            const result = await AIService.generateLessonPlan(tName, grade || "10", sName, pdfText, unitDetails, duration, numSessions, Number(detailLevel) || 50);
            aiData = result.data;
            aiMeta = result.meta;
        }

        const teacherId = req.user?.id;
        if (!teacherId) return res.status(401).json({ success: false, data: null, error: "Unauthorized" });

        logger.info('PERSISTING_LESSON_TO_DATABASE', { requestId, title: title || aiData?.title });
        const lesson = await prisma.lessonPlan.create({
            data: {
                title: title || aiData?.title || `Lesson: ${topicName || 'Generated'}`,
                teacherId: teacherId,
                subjectId: finalSubjectId,
                topicId: finalTopicId,
                objective: aiData?.objective ? (Array.isArray(aiData.objective) ? aiData.objective.join(', ') : aiData.objective) : objective || '',
                duration: parseInt(duration) || 45,
                activities: aiData
                    ? JSON.stringify({
                        introduction: aiData.introduction,
                        activities: aiData.activities,
                        teacherInstructions: aiData.teacherInstructions,
                        assessment: aiData.assessment,
                        summary: aiData.summary,
                    })
                    : (typeof activities === 'string' ? activities : JSON.stringify(activities || [])),
                homework: aiData?.homework || homework || '',
                resources: aiData?.resources || (aiData?.teachingMaterials ? aiData.teachingMaterials.join(', ') : resources) || '',
                status: 'DRAFT',
            }
        });

        logger.info('CREATE_LESSON_SUCCESS', { requestId, lessonId: lesson.id });
        res.status(201).json({ success: true, data: { ...lesson, aiMeta }, error: null });
    } catch (error: any) {
        logger.error('CREATE_LESSON_FAILURE', { requestId, error: error.message, stack: error.stack });
        res.status(500).json({ 
            success: false, 
            data: null, 
            error: process.env.NODE_ENV === 'production' ? 'Intelligence synthesis failed.' : error.message 
        });
    }
};

export const getLessons = async (req: AuthRequest, res: Response) => {
    const requestId = res.getHeader('X-Request-ID') as string || 'INTERNAL';
    
    try {
        logger.info('FETCH_LESSONS_PROTOCOL_INITIATED', { requestId, teacherId: req.user!.id });

        const limitRaw = (req.query.limit as string) || '50';
        const limit = Math.min(Math.max(parseInt(limitRaw) || 50, 1), 100);

        // --- SAFETY: 30s TIMEOUT ---
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DATABASE_OPERATION_TIMEOUT_30S')), 30000)
        );

        const fetchPromise = prisma.lessonPlan.findMany({
            where: { teacherId: req.user!.id },
            include: { subject: true, topic: true },
            orderBy: { updatedAt: 'desc' },
            take: limit,
        });

        const lessons = await Promise.race([fetchPromise, timeoutPromise]) as any;

        logger.info('FETCH_LESSONS_SUCCESS', { requestId, count: lessons.length });
        res.json({ success: true, data: lessons, error: null });
    } catch (error: any) {
        logger.error('FETCH_LESSONS_FAILURE', { requestId, error: error.message, stack: error.stack });
        res.status(500).json({ 
            success: false, 
            data: null, 
            error: process.env.NODE_ENV === 'production' ? 'Failed to synchronize lesson library.' : error.message 
        });
    }
};

export const getLessonById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const lesson = await prisma.lessonPlan.findFirst({
            where: { id, teacherId: req.user?.id },
            include: { subject: true, topic: true }
        });

        if (!lesson) return res.status(404).json({ success: false, data: null, error: 'Lesson not found' });
        
        res.json({ success: true, data: lesson, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch lesson' });
    }
};

export const updateLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const lesson = await prisma.lessonPlan.updateMany({
            where: { id, teacherId: req.user?.id },
            data: { ...req.body }
        });
        
        if (lesson.count === 0) return res.status(404).json({ success: false, data: null, error: 'Lesson not found' });
        
        res.json({ success: true, data: { id, message: 'Updated' }, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Update failed' });
    }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.lessonPlan.deleteMany({
            where: { id, teacherId: req.user?.id }
        });
        
        if (result.count === 0) return res.status(404).json({ success: false, data: null, error: 'Lesson not found' });
        
        res.json({ success: true, data: null, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Delete failed' });
    }
};

export const summarizeLesson = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;
        const { data: summary, meta } = await AIService.summarizeContent(text);
        res.json({ success: true, data: { ...summary, aiMeta: meta }, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Summarization failed' });
    }
};

export const summarizeLessonPdf = async (req: AuthRequest, res: Response) => {
    let filePath = '';
    try {
        console.log("[BACKEND] Received summarize-pdf request");
        if (!req.file) {
            console.warn("[BACKEND] No file attached to request");
            return res.status(400).json({ success: false, data: null, error: 'No PDF provided' });
        }
        
        filePath = req.file.path;
        console.log("[BACKEND] Staged file path:", filePath);
        
        if (!fs.existsSync(filePath)) {
            console.error("[BACKEND] File missing on disk after upload:", filePath);
            throw new Error("Staged file not found on intelligence bus.");
        }

        console.log("[BACKEND] Reading buffer...");
        const dataBuffer = fs.readFileSync(filePath);
        console.log("[BACKEND] Buffer size:", dataBuffer.length);
        
        console.log("[BACKEND] Initiating PDF parse protocol...");
        
        console.log("[BACKEND] Initiating PDF parse protocol (Stable v1.1.1)...");
        
        try {
            const data = await pdfParse(dataBuffer);
            const text = data.text;

            console.log("[BACKEND] PDF Extraction Success. Length:", text?.length || 0);
            
            if (!text || text.trim().length < 20) {
                console.warn("[BACKEND] Extraction warning: Content too short or empty.");
                return res.status(400).json({ 
                    success: false, 
                    data: null, 
                    error: "Unable to extract readable text from PDF. Artifact might be image-based or protected." 
                });
            }

            console.log("[BACKEND] Invoking AI synthesis...");
            const { data: summary, meta } = await AIService.summarizeContent(text);
            
            console.log("[BACKEND] Synthesis complete. Provider:", meta.provider);
            res.json({ success: true, data: { ...summary, aiMeta: meta }, error: null });
        } catch (parseError: any) {
            console.error("[BACKEND] Parser failure:", parseError.message);
            throw new Error(`PDF Parsing failed: ${parseError.message}`);
        }
    } catch (error: any) {
        console.error("[BACKEND] CRITICAL SUMMARIZATION FAILURE:", error);
        res.status(500).json({ 
            success: false, 
            data: null, 
            error: `Protocol failure: ${error.message || 'Unknown internal error'}` 
        });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            console.log("[BACKEND] Cleaning up artifact:", filePath);
            fs.unlinkSync(filePath);
        }
    }
};

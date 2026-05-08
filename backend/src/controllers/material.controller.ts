import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { AIService } from '../services/ai.service';
import { BoardType } from '@prisma/client';
import { resolveCurriculumTopic } from '../lib/curriculum-resolver';

export const generateMaterial = async (req: AuthRequest, res: Response) => {
    let { type, topicId, curriculum: board, grade, subject: subjectName, topic: topicName, pdfText } = req.body;
    try {
        let finalTopicId = topicId;
        let subjId = '';
        let tName = topicName;
        let sName = subjectName;

        // Dynamic Entity Resolution (transactional, deduplicated)
        if (board && grade && subjectName && topicName) {
            const gradeNum = parseInt(grade);
            const resolved = await resolveCurriculumTopic(prisma, {
                board: board as BoardType,
                grade: gradeNum,
                subjectName,
                topicName,
            });
            subjId = resolved.subject.id;
            finalTopicId = resolved.topic.id;
        } else if (topicId) {
            const topic = await prisma.topic.findUnique({
                where: { id: topicId },
                include: { chapter: { include: { subject: true } } }
            });
            if (!topic) return res.status(404).json({ success: false, data: null, error: 'Topic not found' });

            tName = topic.name;
            sName = topic.chapter.subject.name;
        }

        if (!tName) return res.status(400).json({ success: false, data: null, error: 'Topic name is required' });

        const { data: aiData, meta } = await AIService.generateMaterial(tName, type, pdfText || "");

        const teacherId = req.user?.id;
        if (!teacherId) return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });

        const definitionsText = (aiData.definitions || [])
            .map((d: any) => `- ${d.term}: ${d.meaning}`)
            .join('\n');
        const examplesText = (aiData.examples || []).map((e: string) => `- ${e}`).join('\n');
        const formulasText = (aiData.formulas || []).map((f: string) => `- ${f}`).join('\n');
        const keyPointsText = (aiData.keyPoints || []).map((k: string) => `- ${k}`).join('\n');
        const summaryText = aiData.summary || '';
        const content = [
            `## Explanation\n${aiData.explanation || ''}`,
            definitionsText ? `## Definitions\n${definitionsText}` : '',
            examplesText ? `## Examples\n${examplesText}` : '',
            formulasText ? `## Formulas\n${formulasText}` : '',
            keyPointsText ? `## Key Points\n${keyPointsText}` : '',
            summaryText ? `## Summary\n${summaryText}` : '',
        ].filter(Boolean).join('\n\n');

        const lesson = await prisma.lessonPlan.create({
            data: {
                title: aiData.title || `${type}: ${tName}`,
                activities: content,
                objective: aiData.summary || `Learning material for ${tName}`,
                duration: 45,
                teacherId,
                subjectId: subjId || undefined,
                topicId: finalTopicId || undefined,
                status: 'DRAFT',
            }
        });

        res.json({
            success: true,
            data: {
                ...lesson,
                topicName: tName,
                subjectName: sName,
                content,
                explanation: aiData.explanation,
                definitions: aiData.definitions,
                examples: aiData.examples,
                formulas: aiData.formulas,
                keyPoints: aiData.keyPoints,
                summary: aiData.summary,
                aiMeta: meta
            },
            error: null
        });
    } catch (error: any) {
        console.error("Material Generation Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to generate material' });
    }
};

export const generatePPT = async (req: AuthRequest, res: Response) => {
    const { topic, grade, curriculum, slideCount, pdfText } = req.body;
    try {
        if (!topic || !grade || !curriculum) {
            return res.status(400).json({ success: false, data: null, error: 'Topic, grade, and curriculum are required' });
        }

        const { data: aiData, meta } = await AIService.generatePPT(topic, grade, curriculum, slideCount || 5, pdfText || "");

        res.json({
            success: true,
            data: {
                ...aiData,
                aiMeta: meta
            },
            error: null
        });
    } catch (error: any) {
        console.error("PPT Generation Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to generate presentation' });
    }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AIService } from '../services/ai.service';

export const generateExamPaper = async (req: AuthRequest, res: Response) => {
    const { subject, grade, marks, difficulty, examType, syllabus, questionCount, pdfText } = req.body;
    console.log(`\n[EXAM GENERATION] New request received:`);
    console.log(`[PAYLOAD] subject=${subject}, grade=${grade}, marks=${marks}, questions=${questionCount}, difficulty=${difficulty}, type=${examType}`);
    
    try {
        if (!subject) {
            console.warn(`[EXAM GENERATION] Rejected: Missing subject`);
            return res.status(400).json({ success: false, data: null, error: 'Subject is required' });
        }

        console.log(`[EXAM GENERATION] Handing over to AIService...`);
        const { data: paper, meta } = await AIService.generateQuestionPaper(
            subject, 
            grade, 
            marks, 
            difficulty, 
            examType || 'Mid-Term', 
            syllabus || '', 
            questionCount,
            pdfText
        );
        
        console.log(`[EXAM GENERATION] Successfully synthesized paper via ${meta.provider}`);
        res.json({ success: true, data: { ...paper, aiMeta: meta }, error: null });
    } catch (error: any) {
        console.error(`[EXAM GENERATION] CRITICAL FAILURE:`, error.stack);
        res.status(500).json({ 
            success: false, 
            data: null, 
            error: error.message || 'Failed to generate question paper',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

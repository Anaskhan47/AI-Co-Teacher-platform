
import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const analyzeData = async (req: AuthRequest, res: Response) => {
    try {
        const { csvData, analysisType } = req.body;

        console.log(`[Analysis] Analyzing data request received. Mode: ${analysisType}`);

        if (!csvData) {
            console.error('[Analysis] No CSV data provided in body.');
            return res.status(400).json({ success: false, data: null, error: 'CSV data is required' });
        }

        console.log(`[Analysis] CSV Data Length: ${csvData.length} chars`);
        const { data: result, meta } = await AIService.generateDataAnalysis(csvData, analysisType || "General Analysis");

        res.json({ success: true, data: { ...result, aiMeta: meta }, error: null });
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to analyze data' });
    }
};

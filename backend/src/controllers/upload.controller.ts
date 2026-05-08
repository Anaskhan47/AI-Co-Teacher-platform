import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfParse from "pdf-parse/lib/pdf-parse.js";

// Handle general file upload
export const uploadFile = (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ success: false, data: null, error: 'No file uploaded' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        res.status(200).json({
            success: true,
            data: {
                filename: file.filename,
                originalName: file.originalname,
                url: fileUrl
            },
            error: null
        });
    } catch (error: any) {
        console.error("[UPLOAD ERROR] General File Upload:", error.stack);
        res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error during upload' });
    }
};

// Handle PDF text extraction
export const extractPdfText = async (req: Request, res: Response) => {
    const file = (req as any).file;
    
    if (!file) {
        console.error("[PDF EXTRACTION ERROR] No file in request");
        return res.status(400).json({ success: false, data: null, error: 'No file uploaded' });
    }

    const filePath = file.path;
    console.log(`[PDF EXTRACTION] Processing: ${file.originalname} (${file.size} bytes)`);

    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File missing at path: ${filePath}`);
        }

        const dataBuffer = fs.readFileSync(filePath);
        
        let data;
        try {
            console.log("[BACKEND] Parsing PDF artifact (Stable v1.1.1)...");
            data = await pdfParse(dataBuffer);
        } catch (parseError: any) {
            console.error("[BACKEND] Upload Parser failure:", parseError.message);
            throw new Error(`PDF Parsing failed: ${parseError.message}`);
        }

        if (!data || typeof data.text !== 'string' || data.text.trim() === '') {
            throw new Error("PDF Parser returned empty or invalid data");
        }

        console.log(`[PDF EXTRACTION SUCCESS] Extracted ${data.text.length} characters`);
        res.json({ 
            success: true, 
            data: { 
                text: data.text,
                originalName: file.originalname
            }, 
            error: null 
        });

    } catch (error: any) {
        console.error("[CRITICAL] PDF Extraction Failure:\n", error.stack);
        res.status(500).json({ 
            success: false, 
            data: null, 
            error: error.message || 'Failed to extract text from PDF' 
        });
    } finally {
        // MISSION CRITICAL: Guarantee Cleanup
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`[CLEANUP] Removed temporary file: ${filePath}`);
            } catch (cleanupErr) {
                console.error("[CLEANUP ERROR] Failed to remove temp file:", cleanupErr);
            }
        }
    }
};

import { Request, Response } from 'express';
import { CURRICULUM_DATA } from '../data/curriculumData';

export const getMetadata = async (req: Request, res: Response) => {
    const { curriculum, class: grade } = req.query;

    if (!curriculum || !grade) {
        return res.status(400).json({ success: false, data: null, error: "Missing curriculum or class query param" });
    }

    const boardData = CURRICULUM_DATA[curriculum as string];
    if (!boardData) {
        return res.status(404).json({ success: false, data: null, error: "Curriculum not found" });
    }

    const classData = boardData[grade as string];
    if (!classData) {
        return res.status(404).json({ success: false, data: null, error: "Class not found" });
    }

    const subjects = Object.keys(classData);
    const topics = classData;

    res.json({ success: true, data: { subjects, topics }, error: null });
};


export const getBoards = async (req: Request, res: Response) => {
    try {
        const boards = Object.keys(CURRICULUM_DATA);
        res.json({ success: true, data: boards, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || "Failed to fetch boards" });
    }
};

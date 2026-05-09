import { VercelRequest, VercelResponse } from '@vercel/node';
import { CURRICULUM_DATA } from '../../backend/src/data/curriculumData.js';
import { sendSuccess, sendError, withSafeRuntime } from '../../backend/src/lib/responses.js';

/**
 * NATIVE VERCEL CURRICULUM METADATA API
 * Provides structured subjects and topics based on board and class.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withSafeRuntime(res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { curriculum, class: grade } = req.query;

    if (!curriculum || !grade) {
      return sendError(res, "Missing curriculum or class query param", "MISSING_PARAMS", 400);
    }

    const boardData = CURRICULUM_DATA[curriculum as string];
    if (!boardData) {
      return sendError(res, "Curriculum not found", "NOT_FOUND", 404);
    }

    const classData = boardData[grade as string];
    if (!classData) {
      return sendError(res, "Class not found", "NOT_FOUND", 404);
    }

    const subjects = Object.keys(classData);
    const topics = classData;

    return sendSuccess(res, { subjects, topics });
  });
}

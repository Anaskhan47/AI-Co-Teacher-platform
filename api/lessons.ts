import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma, { safeDb } from '../backend/src/lib/prisma.js';
import { sendSuccess, withSafeRuntime } from '../backend/src/lib/responses.js';

/**
 * NATIVE VERCEL LESSONS API
 * Isolated, high-performance, and database-safe.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withSafeRuntime(res, async () => {
    // 1. Handle GET (List Lessons)
    if (req.method === 'GET') {
      const lessons = await safeDb(
        () => prisma.lessonPlan.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { subject: true, topic: true }
        }),
        [] // Safe fallback if DB is down
      );

      return sendSuccess(res, lessons);
    }

    // 2. Handle POST (Create Lesson)
    if (req.method === 'POST') {
      const { title, subjectId, grade } = req.body;
      
      if (!title || !subjectId) {
        throw new Error("Missing required lesson parameters.");
      }

      const newLesson = await prisma.lessonPlan.create({
        data: { title, subjectId, grade: Number(grade) || 10, teacherId: 'safe-mode-id' }
      });

      return sendSuccess(res, newLesson, 201);
    }

    return res.status(405).json({ error: "Method not allowed" });
  });
}

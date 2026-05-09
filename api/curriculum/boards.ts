import { VercelRequest, VercelResponse } from '@vercel/node';
import { CURRICULUM_DATA } from '../../backend/src/data/curriculumData.js';
import { sendSuccess, withSafeRuntime } from '../../backend/src/lib/responses.js';

/**
 * NATIVE VERCEL CURRICULUM BOARDS API
 * Returns a list of available educational boards.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return withSafeRuntime(res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const boards = Object.keys(CURRICULUM_DATA);
    return sendSuccess(res, boards);
  });
}

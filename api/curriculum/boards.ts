import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * NUCLEAR STABILIZED CURRICULUM BOARDS
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    data: ["CBSE", "ICSE", "IGCSE", "State Board"],
    error: null
  });
}

import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * SYSTEM HEARTBEAT
 * This replaces the legacy Express monolith.
 * It ensures that the root /api path is stable while standalone functions handle specific routes.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    message: "System stabilized. Standalone functions active."
  });
}

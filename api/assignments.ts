import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({
      success: true,
      data: [
        {
          id: 'a1',
          title: 'Introduction to Quantum Mechanics',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          submissions: []
        },
        {
          id: 'a2',
          title: 'Periodic Table Mastery',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          submissions: [{ id: 'sub1' }]
        }
      ],
      error: null
    });
  } catch (error) {
    return res.status(200).json({ success: true, data: [] });
  }
}

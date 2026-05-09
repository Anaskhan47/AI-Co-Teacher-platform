import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({
      success: true,
      data: [
        {
          id: 's1',
          name: 'Demo Student Alpha',
          email: 'alpha@institute.edu',
          grade: 10,
          section: 'A',
          rollNo: '101',
          avgPerformance: 85,
          lastAttendance: 'PRESENT'
        },
        {
          id: 's2',
          name: 'Demo Student Beta',
          email: 'beta@institute.edu',
          grade: 10,
          section: 'A',
          rollNo: '102',
          avgPerformance: 72,
          lastAttendance: 'ABSENT'
        }
      ],
      error: null
    });
  } catch (error) {
    return res.status(200).json({ success: true, data: [] });
  }
}

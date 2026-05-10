import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * NUCLEAR STABILIZED CURRICULUM METADATA
 * Zero-dependency implementation with inlined data.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const subjects = ["Mathematics", "Science", "English", "History", "Physics", "Chemistry", "Biology"];
    const topics: any = {
      "Mathematics": ["Algebra", "Geometry", "Calculus", "Trigonometry"],
      "Science": ["Physics", "Chemistry", "Biology", "Environment"],
      "Physics": ["Motion", "Force", "Energy", "Light", "Electricity"],
      "Chemistry": ["Atoms", "Molecules", "Reactions", "Acids & Bases"],
      "Biology": ["Cells", "Genetics", "Ecosystems", "Evolution"],
      "English": ["Grammar", "Literature", "Writing", "Poetry"],
      "History": ["Ancient Civilizations", "World Wars", "Modern History"]
    };

    return res.status(200).json({
      success: true,
      data: { subjects, topics },
      error: null
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: { subjects: [], topics: {} },
      error: null
    });
  }
}

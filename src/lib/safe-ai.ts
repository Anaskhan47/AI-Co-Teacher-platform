import { z } from "zod";

/**
 * PRODUCTION-GRADE AI DATA NORMALIZATION
 * Strategy: AI responses are inherently unreliable. We must Parse -> Normalize -> Validate -> Fallback.
 */

// 1. Define Strict Schemas for AI Output
export const ActivitySchema = z.object({
  time: z.string().default("5-10 mins"),
  description: z.string().default("Activity description pending..."),
  task: z.string().optional(),
  recap: z.string().optional().default(""),
  tip: z.string().optional().default("Keep students engaged with active questioning.")
});

export const QuizQuestionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(v => v.toString()),
  type: z.string().default("MCQ"),
  question: z.string().default("Question pending..."),
  options: z.array(z.string()).default([]),
  correctAnswer: z.string().default(""),
  bloomLevel: z.string().optional().default("Remember")
});

export const LessonPlanSchema = z.object({
  id: z.string().optional(),
  title: z.string().default("New Lesson Plan"),
  objective: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.string())
  ).default([]),
  explanation: z.string().nullish().transform(v => v ?? "").default(""),
  activities: z.preprocess((val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return []; }
    }
    return val;
  }, z.array(ActivitySchema)).default([]),
  homework: z.string().nullish().transform(v => v ?? "").default(""),
  resources: z.string().nullish().transform(v => v ?? "").default(""),
  questions: z.array(QuizQuestionSchema).default([]),
  status: z.string().default("DRAFT")
});

export const QuizSchema = z.object({
  id: z.string().optional(),
  title: z.string().default("New Assessment"),
  questions: z.array(QuizQuestionSchema).default([]),
  subjectName: z.string().optional().default("General")
});

// 2. Safe Parsing Logic
export function safeParseAIResponse(rawData: any): any {
  if (!rawData) return null;

  // If it's already an object, return it for validation
  if (typeof rawData === 'object' && !Array.isArray(rawData)) {
    return rawData;
  }

  // If it's a string, attempt deep cleaning and parsing
  if (typeof rawData === 'string') {
    try {
      // Find the first '{' and last '}' to strip markdown or conversational filler
      const start = rawData.indexOf('{');
      const end = rawData.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        const jsonStr = rawData.substring(start, end + 1);
        return JSON.parse(jsonStr);
      }
      return JSON.parse(rawData);
    } catch (e) {
      console.error("AI Parse Error: Critical failure in JSON structure", e);
      return null;
    }
  }

  return null;
}

/**
 * PRIMARY ENTRY POINT: Normalizes Lesson Plan Data
 */
export function normalizeLessonPlan(data: any) {
  const parsed = safeParseAIResponse(data);
  
  // Pre-normalization for extreme cases
  if (parsed && typeof parsed.activities === 'string') {
      try { parsed.activities = JSON.parse(parsed.activities); } catch(e) {}
  }

  const result = LessonPlanSchema.safeParse(parsed || {});
  
  if (!result.success) {
    console.warn("AI Validation Warning: Schema mismatch. Applying aggressive recovery.", result.error);
    // Never throw from normalization (prevents white-screens). Return best-effort defaults.
    const fallbackSeed: any = {};
    if (parsed && typeof parsed === 'object') {
      if (typeof (parsed as any).title === 'string') fallbackSeed.title = (parsed as any).title;
      if (typeof (parsed as any).objective === 'string') fallbackSeed.objective = [(parsed as any).objective];
      if (Array.isArray((parsed as any).objective)) fallbackSeed.objective = (parsed as any).objective;
      if (typeof (parsed as any).homework === 'string') fallbackSeed.homework = (parsed as any).homework;
      if (typeof (parsed as any).resources === 'string') fallbackSeed.resources = (parsed as any).resources;
    }
    return LessonPlanSchema.parse(fallbackSeed);
  }
  
  return result.data;
}

/**
 * PRIMARY ENTRY POINT: Normalizes Quiz Data
 */
export function normalizeQuiz(data: any) {
  const parsed = safeParseAIResponse(data);
  const result = QuizSchema.safeParse(parsed || {});
  
  if (!result.success) {
    console.warn("AI Validation Warning: Quiz schema mismatch.", result.error);
    const fallbackSeed: any = {};
    if (parsed && typeof parsed === 'object') {
      if (typeof (parsed as any).title === 'string') fallbackSeed.title = (parsed as any).title;
      if (Array.isArray((parsed as any).questions)) fallbackSeed.questions = (parsed as any).questions;
      if (typeof (parsed as any).subjectName === 'string') fallbackSeed.subjectName = (parsed as any).subjectName;
    }
    return QuizSchema.parse(fallbackSeed);
  }
  
  return result.data;
}

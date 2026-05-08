import { z } from 'zod';

export const LessonPlanAIResultSchema = z.object({
  title: z.string().optional(),
  introduction: z.string().min(20).optional(),
  objective: z.array(z.string()).min(1),
  teacherInstructions: z.array(z.string()).optional(),
  teachingMaterials: z.array(z.string()).optional(),
  explanation: z.string().min(30).optional(),
  activities: z
    .array(
      z.object({
        time: z.string().optional(),
        description: z.string(),
        recap: z.string().optional(),
        tip: z.string().optional(),
      })
    )
    .default([]),
  homework: z.string().optional(),
  resources: z.string().optional(),
  questions: z.array(z.string()).optional(),
  assessment: z.string().optional(),
  summary: z.string().optional(),
  teachingStrategies: z.array(z.string()).optional(),
  assessmentMethods: z.array(z.string()).optional(),
  estimatedTime: z.array(z.object({ section: z.string(), time: z.string() })).optional(),
  referenceUrl: z
    .object({ title: z.string().optional(), url: z.string().url().optional() })
    .nullable()
    .optional(),
  motivationalQuote: z.string().optional(),
});

export const QuizAIResultSchema = z.object({
  title: z.string(),
  questions: z
    .array(
      z.object({
        id: z.union([z.number(), z.string()]).optional(),
        type: z.string().optional(),
        question: z.string(),
        options: z.array(z.string()).min(4).max(4).optional(),
        correctAnswer: z.string().optional(),
        bloomLevel: z.string().optional(),
      })
    )
    .min(1),
}).superRefine((val, ctx) => {
  for (let i = 0; i < val.questions.length; i++) {
    const q = val.questions[i];
    if (q.options && q.options.length === 4 && !q.correctAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MCQ question is missing correctAnswer',
        path: ['questions', i, 'correctAnswer'],
      });
    }
  }
});

export const AssignmentAIResultSchema = z.object({
  title: z.string(),
  instructions: z.string().min(20),
  shortQuestions: z.array(z.string()).min(2),
  longQuestions: z.array(z.string()).min(2),
  practicalActivities: z.array(z.string()).min(1),
  criticalThinking: z.array(z.string()).min(1),
  submissionGuidelines: z.string().min(15),
  mcqs: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    answer: z.string()
  })).optional(),
  // backward-compat fallback keys if model uses old naming
  assignmentQuestions: z.array(z.string()).optional(),
  activityQuestions: z.array(z.string()).optional(),
  answers: z
    .object({
      assignmentQuestions: z.array(z.string()).optional().default([]),
      activityQuestions: z.array(z.string()).optional().default([]),
      mcqs: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export const MaterialAIResultSchema = z.object({
  title: z.string(),
  explanation: z.string().min(40),
  definitions: z.array(z.object({ term: z.string(), meaning: z.string() })).min(1),
  examples: z.array(z.string()).min(2),
  formulas: z.array(z.string()).default([]),
  keyPoints: z.array(z.string()).min(3),
  summary: z.string().min(20),
  studyTips: z.array(z.string()).optional(),
  content: z.string().optional(),
});

export const QuestionPaperAIResultSchema = z.object({
  title: z.string().min(3),
  totalMarks: z.coerce.number(),
  instructions: z.string().optional(),
  sections: z.array(
    z.object({
      name: z.string(),
      questions: z.array(
        z.object({
          id: z.string().optional().default('Q'),
          q: z.string().min(10),
          marks: z.coerce.number().min(1),
          type: z.string().optional(),
          options: z.array(z.string()).optional(),
        })
      ).min(1),
    })
  ).min(1),
  answerKey: z.record(z.string()).optional(),
  markingScheme: z.string().optional(),
}).transform((val) => {
  // Auto-correct totalMarks to the actual sum — don't reject valid outputs
  const actualSum = val.sections
    .flatMap((s) => s.questions)
    .reduce((acc, q) => acc + (typeof q.marks === 'number' ? q.marks : 0), 0);
  
  // Assign sequential IDs to any questions that lack one
  let qCounter = 1;
  for (const section of val.sections) {
    for (const q of section.questions) {
      if (!q.id || q.id === 'Q') {
        q.id = `Q${qCounter}`;
      }
      qCounter++;
    }
  }

  return {
    ...val,
    totalMarks: actualSum > 0 ? actualSum : val.totalMarks,
  };
});

export const PPTAIResultSchema = z.object({
  title: z.string(),
  slides: z.array(z.object({
    title: z.string(),
    content: z.array(z.string()).optional(),
    subtitle_1: z.string().optional(),
    subtitle_2: z.string().optional(),
    image: z.string().optional(),
    layout: z.enum(['organic_title', 'timeline_process', 'thank_you']).default('timeline_process'),
    tag: z.string().optional(),
    theme: z.string().optional()
  })).min(3)
});

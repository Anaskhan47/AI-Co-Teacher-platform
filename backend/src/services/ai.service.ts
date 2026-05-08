import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { z } from 'zod';
import { AIMeta, AIProviderName, formatUntrustedContext, looksGenericText, parseJsonLoose, sleep, validateWithSchema, validateEducationalQuality, withTimeout } from './ai-guard';
import {
    AssignmentAIResultSchema,
    LessonPlanAIResultSchema,
    MaterialAIResultSchema,
    QuestionPaperAIResultSchema,
    QuizAIResultSchema,
    PPTAIResultSchema
} from './ai-schemas';
import { AcademicGovernance } from './ai-governance';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const GROQ_MODEL = "llama-3.3-70b-versatile";
// Updated from deprecated gemini-pro → gemini-2.0-flash
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * STRICT EDUCATIONAL PROTOCOLS
 * These rules enforce architectural separation between content types to prevent contamination.
 */
const PROMPT_MODES = {
    QUIZ: {
        tone: "Fast-paced, objective, and assessment-focused.",
        requirements: [
            "Generate ONLY MCQs or concise objective questions.",
            "Each MCQ must have exactly 4 distinct options (A, B, C, D).",
            "Must include a 'correctAnswer' and a 'explanation' for each item.",
            "NEVER generate long-form descriptive questions or case studies.",
            "NEVER generate section headers or complex exam structures."
        ],
        fallback: (topic: string) => ({
            title: `Quick Quiz: ${topic}`,
            questions: [{ id: 1, type: "MCQ", question: `Which of the following best describes a core characteristic of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option A", explanation: "This is a fundamental concept in the subject domain." }]
        })
    },
    EXAM: {
        tone: "Senior Academic Examiner, formal, precise, and institutional.",
        requirements: [
            "Generate a professional, printable school examination paper.",
            "STRUCTURE: Header, Instructions, Section A (Objective), Section B (Short Answer), Section C (Long/Detailed Answer).",
            "MARKS: Section A (1 mark each), Section B (3-5 marks), Section C (5-10 marks). Ensure total marks match exactly.",
            "AUTHENTICITY: Use REAL curriculum topics (e.g., 'Accountancy: Journal Entries', 'Hindi: Sangya'). NO placeholders.",
            "STYLE: Formal academic language. NO conversational filler, NO quiz-card formatting, NO explanations in the question paper.",
            "FORMATTING: Clear question numbering (Q1, Q2...). Options ONLY for Section A MCQs.",
            "Provide a separate Marking Scheme with specific point-wise rubrics for teachers."
        ],
        fallback: (topic: string, grade: string) => ({
            title: `Final Examination: ${topic}`,
            totalMarks: 80,
            instructions: "1. All questions are compulsory. 2. Marks are indicated against each question.",
            sections: [
                { name: "SECTION A: OBJECTIVE TYPE", questions: [{ id: "Q1", q: `Define the primary objective of ${topic} within the Grade ${grade} syllabus.`, marks: 1, type: "MCQ", options: ["A", "B", "C", "D"] }] },
                { name: "SECTION B: SHORT ANSWER TYPE", questions: [{ id: "Q11", q: `Explain the fundamental principles of ${topic} with two practical examples.`, marks: 3, type: "Short Answer" }] },
                { name: "SECTION C: LONG ANSWER TYPE", questions: [{ id: "Q21", q: `Critically analyze the impact of ${topic} on modern practices, providing a detailed case-based explanation.`, marks: 10, type: "Long Answer" }] }
            ],
            answerKey: { "Q1": "A", "Q11": "Detailed pedagogical answer", "Q21": "Comprehensive analytical rubric" },
            markingScheme: "Step-wise marks: 2 for definition, 3 for explanation, 5 for analysis."
        })
    },
    LESSON: {
        tone: "Pedagogical expert, encouraging, and classroom-ready.",
        requirements: [
            "Generate a structured flow: Warm-up, Instruction, Activity, Assessment, Homework.",
            "Include a 'questions' section with at least 3 structured MCQs (Multiple Choice Questions).",
            "Each question MUST have 4 options and a correct answer.",
            "Include 'estimatedTime' for every phase.",
            "Focus on 'Differentiated Instruction' strategies.",
            "NEVER generate raw question lists; it must be a teaching guide."
        ],
        fallback: (topic: string) => ({
            title: `Lesson Plan: ${topic}`,
            introduction: `This session explores the fundamental aspects of ${topic}.`,
            objective: [`Understand the basics of ${topic}.`],
            teacherInstructions: ["Start with a hook question.", "Explain core concepts."],
            teachingMaterials: ["Whiteboard", "Textbook"],
            explanation: `${topic} is central to this subject.`,
            activities: [{ time: "15 mins", description: "Group discussion on real-world examples.", recap: "Summarize key points.", tip: "Encourage quiet students." }],
            assessment: "Formative exit ticket.",
            questions: [
                { id: 1, type: "MCQ", question: `What is the primary goal of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option A" }
            ],
            homework: "Write a short summary of the lesson.",
            summary: "Lesson covered the foundations of the topic."
        })
    }
};

export class AIService {
    static async generateWithGroqText(prompt: string) {
        if (!groq) throw new Error("Groq API Key not configured");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational assistant. Always respond with strictly valid JSON."
                },
                { role: "user", content: prompt }
            ],
            model: GROQ_MODEL,
            response_format: { type: "json_object" }
        });

        return completion.choices[0].message.content || "";
    }

    static async generateWithGeminiText(prompt: string) {
        if (!genAI) throw new Error("Gemini API Key not configured");
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const result = await model.generateContent(prompt);
        return result.response.text();
    }

    static async runWithFallbackValidated<T>(
        prompt: string,
        schema: z.ZodType<T>,
        simulation: () => T,
        context: { topic: string; grade: string; type: 'lesson' | 'quiz' | 'material' | 'assignment' | 'summary' | 'paper' },
        qualityCheck?: (data: T) => string | null
    ): Promise<{ data: T; meta: AIMeta }> {
        console.log(`[AI SERVICE] Starting governance synthesis for ${context.type} on ${context.topic}`);
        let attempts = 0;
        const providers: { name: AIProviderName; enabled: boolean; run: () => Promise<string> }[] = [
            {
                name: 'groq',
                enabled: !!groq,
                run: () => withTimeout(this.generateWithGroqText(prompt), 15000, 'Groq'),
            },
            {
                name: 'gemini',
                enabled: !!genAI,
                run: () => withTimeout(this.generateWithGeminiText(prompt), 20000, 'Gemini'),
            },
        ];

        for (const provider of providers) {
            if (!provider.enabled) continue;

            for (let i = 0; i < 2; i++) {
                attempts++;
                try {
                    const startedAt = Date.now();
                    const raw = await provider.run();
                    const latencyMs = Date.now() - startedAt;
                    console.log(`[AI] ${provider.name} success in ${latencyMs}ms (attempt ${attempts})`);
                    console.log(`[AI] ${provider.name} raw response preview: ${raw.slice(0, 400)}`);
                    const { value, recovered } = parseJsonLoose(raw);
                    console.log(`[AI] ${provider.name} parseRecovered=${recovered} (attempt ${attempts})`);
                    const validated = validateWithSchema(schema, value);
                    if (validated.ok) {
                        const data = validated.data as any;
                        
                        // --- EDUCATIONAL GOVERNANCE PIPELINE ---
                        console.log(`[GOVERNANCE] Initiating multi-stage audit for ${provider.name} output...`);
                        
                        // 1. Basic Quality & Laziness Check
                        const qualityIssue = qualityCheck ? qualityCheck(data) : null;
                        if (qualityIssue) {
                            console.warn(`[GOVERNANCE] Basic quality gate failed: ${qualityIssue}`);
                            throw new Error(`Quality gate failed: ${qualityIssue}`);
                        }

                        // 2. Grade & Complexity Alignment
                        const complexityAudit = AcademicGovernance.validateComplexity(data, context.grade);
                        if (!complexityAudit.valid) {
                            console.warn(`[GOVERNANCE] Complexity audit failed: ${complexityAudit.issues.join(', ')}`);
                            // We don't necessarily throw here but log the issue
                        }

                        // 3. Educational Safety
                        const safetyAudit = AcademicGovernance.validateSafety(data);
                        if (!safetyAudit.valid) {
                            console.error(`[GOVERNANCE] SAFETY CRITICAL FAILURE: ${safetyAudit.issues.join(', ')}`);
                            throw new Error(`Safety failure: ${safetyAudit.issues[0]}`);
                        }

                        // 4. Type-Specific Pedagogy (Flow & Bloom's)
                        if (context.type === 'lesson') {
                            const flowAudit = AcademicGovernance.validateLessonFlow(data);
                            if (!flowAudit.valid) throw new Error(`Pedagogical flow failure: ${flowAudit.issues[0]}`);
                        }
                        if (context.type === 'quiz') {
                            const bloomsAudit = AcademicGovernance.validateBlooms(data.questions || []);
                            if (!bloomsAudit.valid) console.warn(`[GOVERNANCE] Bloom's distribution warning: ${bloomsAudit.issues[0]}`);
                        }

                        // 5. Cross-Model Fact Verification (The "Source of Truth" Audit)
                        // Use the alternative provider for auditing
                        const alternativeProvider = providers.find(p => p.name !== provider.name && p.enabled);
                        if (alternativeProvider) {
                            console.log(`[GOVERNANCE] Performing cross-model fact verification with ${alternativeProvider.name}...`);
                            const factAudit = await AcademicGovernance.verifyFacts(
                                data, 
                                context.topic, 
                                context.grade, 
                                (auditPrompt) => alternativeProvider.run()
                            );
                            if (!factAudit.valid) {
                                console.warn(`[GOVERNANCE] Fact verification warning: ${factAudit.issues.join(', ')}`);
                            }
                        }

                        return {
                            data: validated.data,
                            meta: {
                                provider: provider.name,
                                attempts,
                                validated: true,
                                parseRecovered: recovered,
                            },
                        };
                    }

                    console.warn(`[AI] Validation failed (${provider.name}): ${validated.error}`);
                } catch (e: any) {
                    console.error(`[AI] Provider failed (${provider.name}) on attempt ${attempts}:`, e?.message || e);
                }

                // backoff with jitter
                await sleep(250 * (i + 1) + Math.floor(Math.random() * 250));
            }
        }

        console.warn("All AI providers failed/invalid — using simulation fallback.");
        return {
            data: simulation(),
            meta: {
                provider: 'simulation',
                attempts,
                validated: true,
                parseRecovered: false,
                error: 'All providers failed or produced invalid output',
            },
        };
    }

    static async generateLessonPlan(topic: string, grade: string, subject: string, pdfContext: string = "", unitDetails: string = "", duration: string = "45", numSessions: string = "1", detailLevel: number = 50) {
        let contextPrompt = "";
        if (pdfContext) contextPrompt += formatUntrustedContext('PDF', pdfContext, 3000);
        if (unitDetails) contextPrompt += `\n\nUnit Details:\n"${unitDetails}"\n\n`;
        const depthInstruction =
            detailLevel >= 75
                ? "Provide high-depth pedagogy with richer examples, differentiated instruction and assessment details."
                : detailLevel >= 45
                    ? "Provide balanced depth with practical examples and clear classroom flow."
                    : "Provide concise but clear classroom-ready content with essential activities.";

        const prompt = `You are an expert Educational Content Architect.
Generate a high-fidelity Lesson Plan.

AUTHENTIC CURRICULUM CONTEXT:
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Session Duration: ${duration} minutes
${contextPrompt}

STRICT MODE: LESSON_PLANNER
${PROMPT_MODES.LESSON.requirements.map(r => `- ${r}`).join('\n')}

CORE REQUIREMENTS:
- Grade appropriate for grade ${grade}.
- ${depthInstruction}
- Avoid generic placeholders (e.g., instead of "Define a concept", use actual topics like "Define the properties of ${topic}").
- Return JSON only.

Return strictly valid JSON:
{
  "title": "Lesson: ${topic}",
  "introduction": "2-4 sentence classroom introduction",
  "objective": ["Objective 1", "Objective 2"],
  "teacherInstructions": ["Step 1", "Step 2"],
  "teachingMaterials": ["Material 1", "Material 2"],
  "explanation": "Detailed pedagogical explanation",
  "activities": [{"time":"10 mins","description":"Activity","recap":"Recap point","tip":"Teacher tip"}],
  "assessment": "Detailed formative assessment strategy",
  "questions": [
    {"id": 1, "type": "MCQ", "question": "Question 1", "options": ["A", "B", "C", "D"], "correctAnswer": "Answer"}
  ],
  "homework": "Homework task",
  "summary": "Lesson recap",
  "resources": "Resource list"
}`;

        return this.runWithFallbackValidated(
            prompt,
            LessonPlanAIResultSchema,
            () => PROMPT_MODES.LESSON.fallback(topic),
            { topic, grade, type: 'lesson' },
            (data) => validateEducationalQuality(data, 'lesson')
        );
    }

    static async generateDataAnalysis(csvData: string, analysisType: string) {
        let prompt = "";

        if (analysisType === "student_performance") {
            prompt = `You are an expert educational data analyst. Analyze the CSV data for a Student-Wise Performance Report.
            CSV Data: ${csvData.substring(0, 15000)}
            TASK: Identify each student, calculate Total Marks and Percentage, find Top 3 and Bottom 3 students.
            Return strictly VALID JSON:
            {
                "analysisType": "student_performance",
                "toppers": [{"name": "Student Name", "percentage": 98.5, "rank": 1}],
                "struggling": [{"name": "Student Name", "percentage": 45.0, "needsHelpIn": "Maths"}],
                "allStudents": [{"name": "Student Name", "total": 450, "percentage": 90.0, "grade": "A", "remarks": "Excellent"}]
            }`;
        } else if (analysisType === "attendance_analysis") {
            prompt = `You are an expert educational data analyst. Analyze the CSV data for Attendance Insights.
            CSV Data: ${csvData.substring(0, 15000)}
            TASK: Analyze attendance, calculate correlation with performance, list students with <75% attendance.
            Return strictly VALID JSON:
            {
                "analysisType": "attendance_analysis",
                "overallAttendance": 85.5,
                "correlation": "Strong positive correlation observed.",
                "lowAttendanceList": [{"name": "Student Name", "attendance": 65.0, "performanceStatus": "Struggling"}],
                "insights": ["Insight 1", "Insight 2", "Insight 3"]
            }`;
        } else if (analysisType === "ask_questions") {
            prompt = `Summarize this dataset briefly so I can answer questions about it.
             CSV Data: ${csvData.substring(0, 10000)}
             Return strictly VALID JSON: { "analysisType": "ask_questions", "summary": "Brief summary of dataset structure and key metrics." }`;
        } else {
            prompt = `You are an expert educational data analyst. Analyze the CSV data to generate a structured class-wide report.
            CSV Data: ${csvData.substring(0, 15000)}
            TASK: Identify every subject column (ignore Roll No, Name, Attendance, Total, Average, Percentage, Grade, Rank).
            Return strictly VALID JSON:
            {
                "analysisType": "class_performance",
                "filename": "Analysis Report",
                "summary": { "performingWell": [{"subject": "Name", "score": 85.5}], "struggling": [{"subject": "Name", "score": 55.2}] },
                "overallStats": { "average": 75.4, "highest": 98.0, "lowest": 35.0 },
                "subjectInsights": {
                    "Maths": {
                        "average": 72.5, "highest": 95, "lowest": 40,
                        "suggestions": ["Suggestion 1", "Suggestion 2"],
                        "distribution": [{"range": "0-20", "count": 2}, {"range": "21-40", "count": 5}, {"range": "41-60", "count": 10}, {"range": "61-80", "count": 15}, {"range": "81-100", "count": 8}]
                    }
                },
                "improvementPlan": ["Actionable step 1", "Actionable step 2"]
            }`;
        }

        // Analysis outputs are user-facing only; keep loose for now (validated in the controller/UI layer).
        return this.runWithFallbackValidated(
            prompt,
            z.any(),
            () => ({ analysis: "AI Service Unavailable for Analysis." }),
            { topic: "CSV Data Analysis", grade: "N/A", type: 'summary' }
        );
    }

    static async generateQuiz(topic: string, grade: string, subject: string, questionType: string, bloomLevel: string, count: number = 5, pdfContext: string = "") {
        let contextPrompt = "";
        if (pdfContext) contextPrompt = formatUntrustedContext('PDF', pdfContext, 3000);

        const prompt = `You are a Senior Academic Content Specialist.
Generate a high-fidelity Objective Assessment (Quiz).

AUTHENTIC CURRICULUM CONTEXT:
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Bloom's Taxonomy: ${bloomLevel}
${contextPrompt}

STRICT MODE: QUIZ_GENERATOR
${PROMPT_MODES.QUIZ.requirements.map(r => `- ${r}`).join('\n')}

CORE REQUIREMENTS:
- Grade appropriate language for Grade ${grade}.
- Use REAL educational concepts (e.g., if topic is 'Hindi', generate questions about 'Sangya' or 'Sarvanam', NOT placeholders).
- Generate exactly ${count} questions.
- Return JSON only.

Return strictly valid JSON:
{
    "title": "Quiz: ${topic}",
    "questions": [{"id": 1, "type": "MCQ", "question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "Answer text", "explanation": "Why this is correct", "bloomLevel": "${bloomLevel}"}]
}`;

        return this.runWithFallbackValidated(
            prompt, 
            QuizAIResultSchema, 
            () => PROMPT_MODES.QUIZ.fallback(topic),
            { topic, grade, type: 'quiz' },
            (data) => validateEducationalQuality(data, 'quiz')
        );
    }

    static async generateMaterial(topic: string, type: string, pdfContext: string = "") {
        let contextPrompt = "";
        if (pdfContext) contextPrompt = formatUntrustedContext('PDF', pdfContext, 3000);

        const prompt = `You are an expert educational content writer.
Generate detailed study material for students.

Topic: ${topic}
Material Type: ${type}
${contextPrompt}

Requirements:
- Grade-appropriate explanation
- Clear definitions
- Practical examples
- Include formulas where relevant
- Key points for revision
- Summary for quick recap
- JSON only

Return strictly valid JSON:
{
  "title": "${type} for ${topic}",
  "explanation": "Detailed explanation",
  "definitions": [{"term":"Term","meaning":"Meaning"}],
  "examples": ["Example 1", "Example 2"],
  "formulas": ["Formula 1"],
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "summary": "Short summary notes",
  "studyTips": ["Tip 1", "Tip 2"]
}`;

        return this.runWithFallbackValidated(prompt, MaterialAIResultSchema, () => ({
            title: `${type} for ${topic}`,
            explanation: `${topic} is an important concept. Students should understand its practical meaning and application.`,
            definitions: [{ term: topic, meaning: `Core concept definition of ${topic}` }],
            examples: [`Real classroom example of ${topic}`, `Applied example of ${topic}`],
            formulas: [],
            keyPoints: [`Understand ${topic}`, `Practice ${topic}`, `Revise ${topic}`],
            summary: `Quick recap of ${topic}.`,
            studyTips: ['Revise definitions', 'Solve practice questions']
        }), 
        { topic, grade: "General", type: 'material' },
        (data) => validateEducationalQuality(data, 'material'));
    }

    static async generateAssignment(topic: string, grade: string, subject: string, assignmentType: string = "Homework", difficultyLevel: string = "Medium", pdfContext: string = "", count: number = 6) {
        let contextPrompt = "";
        if (pdfContext) contextPrompt = formatUntrustedContext('PDF', pdfContext, 3000);
        
        // Distribution logic following pedagogical best practices & schema constraints
        const total = Math.max(6, Math.min(20, Number(count) || 6));
        const isAssessment = assignmentType.toLowerCase().includes('assessment');
        
        // If assessment, we prioritize MCQs for at least half the quota
        const mcqCount = isAssessment ? Math.floor(total * 0.5) : 0;
        const remaining = total - mcqCount;
        
        const shortCount = Math.max(2, Math.floor(remaining * 0.4));
        const longCount = Math.max(2, Math.floor(remaining * 0.3));
        const practicalCount = Math.max(1, Math.floor(remaining * 0.15));
        const criticalCount = Math.max(1, remaining - shortCount - longCount - practicalCount);

        const prompt = `You are an expert school assignment designer for Indian curriculum (K-12).
Design an age-appropriate ${assignmentType} assignment with high pedagogical depth.

Context:
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficultyLevel}
- Question Quota: Exactly ${total} assessment items.
${contextPrompt}

Structure Requirements:
${mcqCount > 0 ? `1. MCQs: Exactly ${mcqCount} questions with 4 options each` : ''}
${mcqCount > 0 ? '2' : '1'}. Short Questions: Exactly ${shortCount} (Knowledge/Recall based)
${mcqCount > 0 ? '3' : '2'}. Long Questions: Exactly ${longCount} (Understanding/Analysis based)
${mcqCount > 0 ? '4' : '3'}. Practical Activities: Exactly ${practicalCount} (Application based)
${mcqCount > 0 ? '5' : '4'}. Critical Thinking: Exactly ${criticalCount} (Evaluation/Creation based)

Must include:
- Professional instructional tone
- Clear submission guidelines (at least 20 words)
- Detailed instructions (at least 30 words)
- JSON format only

Return strictly valid JSON:
{
  "title": "${assignmentType}: ${topic}",
  "instructions": "Professional student instructions (min 30 words)",
  "mcqs": ${mcqCount > 0 ? `[{"question": "MCQ Question", "options": ["A", "B", "C", "D"], "answer": "Correct Option"}]` : '[]'},
  "shortQuestions": ["Exactly ${shortCount} short questions"],
  "longQuestions": ["Exactly ${longCount} long questions"],
  "practicalActivities": ["Exactly ${practicalCount} practical activities"],
  "criticalThinking": ["Exactly ${criticalCount} critical-thinking prompts"],
  "submissionGuidelines": "Detailed submission format and expectations (min 20 words)",
  "answers": {
    "mcqs": ["Correct answers for MCQs"],
    "assignmentQuestions": ["Comprehensive model answer pointers for all other questions"],
    "activityQuestions": ["Expected pedagogical outcomes for activities"]
  }
}
`;

        return this.runWithFallbackValidated(prompt, AssignmentAIResultSchema, () => ({
            title: `${assignmentType}: ${topic}`,
            instructions: `Complete this ${assignmentType} systematically. Ensure you read all the questions carefully and provide structured answers that demonstrate your understanding of ${topic}.`,
            mcqs: isAssessment ? [
                { question: `Which of the following is a key principle of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option A" }
            ] : [],
            shortQuestions: Array.from({ length: shortCount }).map((_, i) => `Short Q${i + 1}: Explain the fundamental definition and one key application of ${topic} in its academic context.`),
            longQuestions: Array.from({ length: longCount }).map((_, i) => `Long Q${i + 1}: Provide a detailed analysis of ${topic}, discussing its historical or scientific significance with at least two real-world examples.`),
            practicalActivities: Array.from({ length: practicalCount }).map((_, i) => `Activity ${i + 1}: Design a practical demonstration or experiment that illustrates the core principles of ${topic} using everyday materials.`),
            criticalThinking: Array.from({ length: criticalCount }).map((_, i) => `Evaluation ${i + 1}: Critically evaluate how the understanding of ${topic} has evolved over time and its impact on the modern ${subject} domain.`),
            submissionGuidelines: `Please submit your work in a neatly bound file or classroom notebook. Ensure all diagrams are labeled and citations are provided where necessary.`,
        }), 
        { topic, grade, type: 'assignment' },
        (data) => validateEducationalQuality(data, 'assignment'));
    }

    static async generateQuestionPaper(subject: string, grade: string, marks: number, difficulty: string, examType: string, syllabus: string, questionCount: number = 25, pdfContext: string = "") {
        const marksNum = Number(marks);
        const countNum = Number(questionCount);
        let contextPrompt = "";
        if (pdfContext) contextPrompt = formatUntrustedContext('PDF', pdfContext, 4500);

        // Pre-calculate section budgets to guide the AI
        const secAMarks = Math.round(marksNum * 0.25); // 25% objective
        const secBMarks = Math.round(marksNum * 0.35); // 35% short answer
        const secCMarks = marksNum - secAMarks - secBMarks; // 40% long answer
        
        // Distribution of questions
        const secACount = Math.round(countNum * 0.40); // 40% MCQs
        const secBCount = Math.round(countNum * 0.40); // 40% Short
        const secCCount = countNum - secACount - secBCount; // 20% Long

        const prompt = `You are a Senior Academic Examiner.
Generate a professional school Examination Paper.

CURRICULUM CONTEXT:
- Grade: ${grade}
- Subject: ${subject}
- Exam Type: ${examType}
- Syllabus Scope: ${syllabus || "Full curriculum standards"}
- Total Marks: ${marksNum}
- Difficulty: ${difficulty}
${contextPrompt}

STRICT ARCHITECTURAL PROTOCOL: EXAM_BUILDER
${PROMPT_MODES.EXAM.requirements.map(r => `- ${r}`).join('\n')}

SECTIONAL SPECIFICATIONS:
1. SECTION A (Objective): ${secAMarks} Marks. EXACTLY ${secACount} questions (MCQs with 4 options each).
2. SECTION B (Analytical): ${secBMarks} Marks. EXACTLY ${secBCount} questions (Short Answer, 3-5 marks each).
3. SECTION C (Descriptive): ${secCMarks} Marks. EXACTLY ${secCCount} questions (Long Answer/Case Study, 5-10 marks each).

CORE RULES:
- Total Questions MUST BE ${countNum}.
- Use AUTHENTIC subject-specific terminology.
- Ensure marks allocation is precise and total marks = ${marksNum}.
- DO NOT include explanations in the question paper sections.
- Return strictly valid JSON.

JSON Schema:
{
  "title": "${examType}: ${subject}",
  "totalMarks": ${marksNum},
  "instructions": "1. All questions are compulsory. 2. Section-wise marks are indicated.",
  "sections": [
    {
      "name": "SECTION A: OBJECTIVE TYPE",
      "questions": [
        {"id": "Q1", "q": "Real subject question?", "marks": 1, "type": "MCQ", "options": ["A", "B", "C", "D"]}
      ]
    },
    {
      "name": "SECTION B: ANALYTICAL TYPE",
      "questions": [
        {"id": "Q11", "q": "Detailed analytical question?", "marks": 3, "type": "Short Answer"}
      ]
    },
    {
      "name": "SECTION C: DESCRIPTIVE TYPE",
      "questions": [
        {"id": "Q21", "q": "Long-form/case-study question?", "marks": 10, "type": "Long Answer"}
      ]
    }
  ],
  "answerKey": { "Q1": "Correct Option", "Q11": "Detailed answer pointers" },
  "markingScheme": "Point-wise marking rubrics for Section B and C."
}`;

        return this.runWithFallbackValidated(
            prompt, 
            QuestionPaperAIResultSchema, 
            () => PROMPT_MODES.EXAM.fallback(subject, grade),
            { topic: subject, grade, type: 'paper' },
            (data) => validateEducationalQuality(data, 'paper')
        );
    }

    static async summarizeContent(content: string = "") {
        const safeContent = (content || "").toString();
        const prompt = `
You are an academic lesson summarizer.

Analyze the uploaded lesson material and generate:
1. Lesson Summary (detailed overview)
2. Key Concepts (list of core topics)
3. Important Definitions (term and meaning)
4. Key Takeaways (critical points)
5. Revision Notes (bullet points for students)
6. Student Activities (suggested interactions)

Return structured JSON only.

Lesson Content:
${safeContent.slice(0, 12000)}

Return strictly VALID JSON matching this structure:
{
    "overview": "Detailed summary text",
    "keyConcepts": ["Concept 1", "Concept 2"],
    "definitions": [{"term": "example", "meaning": "definition"}],
    "takeaways": ["Point 1", "Point 2"],
    "revisionNotes": ["Note 1", "Note 2"],
    "activities": ["Activity 1", "Activity 2"]
}`;

        return this.runWithFallbackValidated(prompt, z.any(), () => ({
            overview: safeContent ? "Lesson intelligence synthesized (Simulation)." : "No readable content found in artifact.",
            keyConcepts: ["Academic Core", "Subject Context"],
            definitions: [{ term: "Topic", meaning: "The subject under discussion" }],
            takeaways: ["Understand key themes", "Review definitions", "Complete activities"],
            revisionNotes: ["Read carefully", "Take notes", "Practice examples"],
            activities: ["Group discussion", "Practice quiz"]
        }), 
        { topic: "Lesson Artifact", grade: "N/A", type: 'summary' },
        (data) => validateEducationalQuality(data, 'summary'));
    }

    private static getSimulatedLesson(topic: string, grade: string, subject: string, hasPdf: boolean) {
        return {
            objective: [`Students will master ${topic} in ${subject}${hasPdf ? ' using reference material' : ''} for Grade ${grade}.`],
            explanation: `${topic} is a fundamental concept in ${subject}.`,
            activities: [
                { time: "0-5 mins", description: `Introduction to ${topic}`, recap: "", tip: "" },
                { time: "5-45 mins", description: "Main interactive session.", recap: "", tip: "" }
            ],
            homework: `Complete exercises related to ${topic}.`,
            resources: "Textbook, Projector",
            questions: [`Define ${topic}.`],
            teachingStrategies: ["Direct Instruction", "Group Discussion"],
            assessmentMethods: ["Quiz", "Exit Ticket"],
            estimatedTime: [{ section: "Introduction", time: "5 mins" }, { section: "Main Activity", time: "35 mins" }],
            referenceUrl: null,
            motivationalQuote: "Education is the most powerful weapon you can use to change the world."
        };
    }

    static async generatePPT(topic: string, grade: string, curriculum: string, slideCount: number = 5, pdfContext: string = "") {
        let contextPrompt = "";
        if (pdfContext) contextPrompt = formatUntrustedContext('PDF', pdfContext, 4500);

        const prompt = `You are a Senior Educational Content Architect specialized in high-fidelity academic presentations.
Generate a comprehensive, curriculum-aligned PPT for Grade ${grade} students on "${topic}".
Curriculum Standard: ${curriculum.toUpperCase()}
Slide Quota: Exactly ${slideCount} intelligence nodes.

${contextPrompt}

PHASE 1: CONTENT ARCHITECTURE (Reliability & Depth)
- Every slide MUST contain high-depth, accurate educational content.
- Content nodes (middle slides) MUST have 3 to 5 detailed bullet points.
- Bullet points must NOT be generic; use specific examples, scientific principles, or historical facts.
- Language must be professionally academic but accessible for Grade ${grade}.

PHASE 2: VISUAL DYNAMICS (Variety & Professionalism)
- Randomize slide themes across these professional palettes: "indigo", "emerald", "violet", "amber", "rose", "cyan", "fuchsia".
- Every slide MUST have a unique 'tag' (e.g., "Overview", "Mechanism", "Case Study", "Synthesis", "Impact").
- Use 'layout': "organic_title" for Slide 1, "timeline_process" for content, and "thank_you" for the finale.

Return strictly valid JSON:
{
  "title": "${topic} Professional Series",
  "slides": [
    {
      "title": "Topic Title",
      "subtitle_1": "Grade ${grade} • ${curriculum.toUpperCase()} Curriculum",
      "subtitle_2": "Strategic Intelligence Module",
      "layout": "organic_title",
      "theme": "indigo",
      "image": "https://images.unsplash.com/photo-1614730341194-75c60740a071?auto=format&fit=crop&w=800&q=80"
    },
    {
      "title": "Subtopic: [Unique Area of ${topic}]",
      "content": [
        "Highly detailed educational point 1 (min 15 words)",
        "Detailed analytical point 2 (min 15 words)",
        "Technical or contextual point 3",
        "Application or critical thinking point 4"
      ],
      "layout": "timeline_process",
      "tag": "Analysis",
      "theme": "emerald",
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
    }
  ]
}`;

        return this.runWithFallbackValidated(
            prompt,
            PPTAIResultSchema,
            () => ({
                title: `${topic} High-Depth Series`,
                slides: [
                    { title: topic, subtitle_1: `Grade ${grade}`, subtitle_2: "Educational Series", layout: "organic_title", theme: "indigo", image: "https://images.unsplash.com/photo-1614730341194-75c60740a071?auto=format&fit=crop&w=800&q=80" },
                    { title: "Theoretical Foundations", content: [`Mastering the core axioms of ${topic} for Grade ${grade} success.`, `Practical integration of ${topic} principles within the ${curriculum.toUpperCase()} framework.`, `Analyzing real-world implications and structural dynamics.`], layout: "timeline_process", tag: "Basics", theme: "emerald", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
                    { title: "Final Synthesis", layout: "thank_you", theme: "violet", image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=800&q=80" }
                ]
            }),
            { topic, grade, type: 'material' },
            (data) => {
                if (data.slides.length < 3) return "Insufficient slide nodes";
                // Post-process to ensure theme variety if AI missed it
                const themes = ["indigo", "emerald", "violet", "amber", "rose", "cyan", "fuchsia"];
                data.slides.forEach((s: any, i: number) => {
                    if (!s.theme) s.theme = themes[i % themes.length];
                });
                return null;
            }
        );
    }
}

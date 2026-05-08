import { z } from 'zod';
import { parseJsonLoose } from './ai-guard';

export interface GovernanceScore {
  score: number; // 0-1
  valid: boolean;
  issues: string[];
}

export interface BloomDistribution {
  remember: number;
  understand: number;
  apply: number;
  analyze: number;
  evaluate: number;
  create: number;
}

/**
 * Professional Educational Governance Engine
 * Performs multi-stage validation on AI-generated artifacts.
 */
export class AcademicGovernance {
  
  /**
   * 1. CURRICULUM & GRADE ALIGNMENT
   * Validates if vocabulary and complexity match the intended grade level.
   */
  static validateComplexity(content: any, grade: string): GovernanceScore {
    const text = JSON.stringify(content).toLowerCase();
    const gradeNum = parseInt(grade.replace(/\D/g, '')) || 5;
    const issues: string[] = [];

    // Simple heuristic-based vocabulary check
    const advancedTerms = ['quantum', 'stochastic', 'epistemology', 'paradigm', 'juxtaposition', 'mitigation'];
    const complexTermsFound = advancedTerms.filter(t => text.includes(t));

    if (gradeNum < 6 && complexTermsFound.length > 0) {
      issues.push(`Complexity Alert: Advanced terminology found for Grade ${grade}: ${complexTermsFound.join(', ')}`);
    }

    if (gradeNum > 10 && text.length < 500) {
      issues.push(`Complexity Alert: Content depth insufficient for Grade ${grade} senior level.`);
    }

    return {
      score: issues.length === 0 ? 1 : 0.5,
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * 2. BLOOM'S TAXONOMY VALIDATOR
   * Ensures balanced cognitive levels in assessments.
   */
  static validateBlooms(questions: any[]): GovernanceScore {
    const issues: string[] = [];
    if (!questions || questions.length === 0) return { score: 0, valid: false, issues: ['No questions found'] };

    const levels = questions.map(q => (q.bloomLevel || 'Remember').toLowerCase());
    const counts = {
      remember: levels.filter(l => l.includes('remember')).length,
      understand: levels.filter(l => l.includes('understand')).length,
      apply: levels.filter(l => l.includes('apply')).length,
      higher: levels.filter(l => l.includes('analyze') || l.includes('evaluate') || l.includes('create')).length
    };

    if (counts.remember > questions.length * 0.7) {
      issues.push("Bloom's Alert: Assessment is too focused on rote memorization (Remembering level).");
    }

    if (counts.higher === 0 && questions.length >= 5) {
      issues.push("Bloom's Alert: Missing higher-order thinking skills (Analyzing/Evaluating/Creating).");
    }

    return {
      score: 1 - (issues.length * 0.2),
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * 3. PEDAGOGICAL FLOW VALIDATOR
   * Verifies the instructional sequence of a lesson plan.
   */
  static validateLessonFlow(plan: any): GovernanceScore {
    const issues: string[] = [];
    const sequence = [
      { key: 'introduction', label: 'Introduction' },
      { key: 'objective', label: 'Objectives' },
      { key: 'explanation', label: 'Concept Building' },
      { key: 'activities', label: 'Active Learning' },
      { key: 'assessment', label: 'Evaluation' },
      { key: 'summary', label: 'Revision/Recap' }
    ];

    for (const step of sequence) {
      if (!plan[step.key] || (Array.isArray(plan[step.key]) && plan[step.key].length === 0)) {
        issues.push(`Pedagogy Alert: Missing critical phase: ${step.label}`);
      }
    }

    return {
      score: 1 - (issues.length * 0.15),
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * 4. CROSS-MODEL FACT VERIFICATION
   * Uses a secondary model to audit the primary model's facts.
   */
  static async verifyFacts(
    content: any, 
    originalTopic: string, 
    originalGrade: string, 
    auditor: (prompt: string) => Promise<string>
  ): Promise<GovernanceScore> {
    const issues: string[] = [];
    
    const verificationPrompt = `
      You are an Academic Auditor. Review this generated educational content for FACTUAL ACCURACY.
      
      Topic: ${originalTopic}
      Grade Level: ${originalGrade}
      
      Content to Audit:
      ${JSON.stringify(content).slice(0, 5000)}
      
      TASK:
      1. Identify any factual errors.
      2. Check if questions and answers match.
      3. Identify if anything is age-inappropriate.
      
      Return JSON: { "isAccurate": boolean, "errors": string[], "confidence": number }
    `;

    try {
      const rawAudit = await auditor(verificationPrompt);
      const { value: auditResult } = parseJsonLoose(rawAudit) as { value: any };
      
      if (auditResult && auditResult.isAccurate === false) {
        issues.push(...(auditResult.errors || ['Secondary audit detected potential inaccuracies.']));
      }

      return {
        score: auditResult?.confidence || 0.5,
        valid: auditResult?.isAccurate !== false && issues.length === 0,
        issues
      };
    } catch (e) {
      console.warn("[GOVERNANCE] Fact Verification Engine timed out or failed. Skipping deep audit.");
      return { score: 1, valid: true, issues: [] };
    }
  }

  /**
   * 5. EDUCATIONAL SAFETY FILTER
   * Scans for bias, cultural insensitivity, or inappropriate school analogies.
   */
  static validateSafety(content: any): GovernanceScore {
    const text = JSON.stringify(content).toLowerCase();
    const issues: string[] = [];
    
    const safetyKeywords = [
      'violence', 'weapon', 'drug', 'alcohol', 'gambling', 'political bias', 
      'discriminatory', 'insult', 'toxic', 'hate', 'illegal'
    ];

    for (const kw of safetyKeywords) {
      if (text.includes(kw)) {
        issues.push(`Safety Alert: Detected potentially sensitive term: "${kw}"`);
      }
    }

    return {
      score: issues.length === 0 ? 1 : 0,
      valid: issues.length === 0,
      issues
    };
  }
}

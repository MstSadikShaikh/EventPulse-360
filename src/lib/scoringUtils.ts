/**
 * Scoring and Evaluation Utilities for EventPulse 360
 * High-performance, pure functional math calculations for 5-axis rubrics and multi-judge aggregation.
 */

export interface CriteriaScores {
  innovation?: number;
  execution?: number;
  uiux?: number;
  presentation?: number;
  impact?: number;
  [key: string]: number | undefined;
}

export interface RubricWeightConfig {
  innovation: number;
  execution: number;
  uiux: number;
  presentation: number;
  impact: number;
}

export const DEFAULT_RUBRIC_WEIGHTS: RubricWeightConfig = {
  innovation: 0.25,
  execution: 0.25,
  uiux: 0.20,
  presentation: 0.15,
  impact: 0.15
};

/**
 * Calculates a normalized weighted score on a 100-point scale for a single judge evaluation.
 */
export function calculateWeightedScore(
  scores: CriteriaScores,
  weights: RubricWeightConfig = DEFAULT_RUBRIC_WEIGHTS
): number {
  const innovation = Math.min(100, Math.max(0, scores.innovation || 0));
  const execution = Math.min(100, Math.max(0, scores.execution || 0));
  const uiux = Math.min(100, Math.max(0, scores.uiux || 0));
  const presentation = Math.min(100, Math.max(0, scores.presentation || 0));
  const impact = Math.min(100, Math.max(0, scores.impact || 0));

  const total = 
    (innovation * weights.innovation) +
    (execution * weights.execution) +
    (uiux * weights.uiux) +
    (presentation * weights.presentation) +
    (impact * weights.impact);

  return Math.round(total * 10) / 10;
}

/**
 * Aggregates scores across multiple judges, supporting trimmed means or weighted averages.
 */
export function aggregateMultiJudgeScore(scoresList: number[]): number {
  if (!scoresList || scoresList.length === 0) return 0;
  const validScores = scoresList.filter(s => typeof s === 'number' && !isNaN(s));
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  const avg = sum / validScores.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Sorts and ranks submissions based on average score, breaking ties using innovation then execution.
 */
export function rankSubmissions<T extends { average_score: number; criteria?: CriteriaScores }>(
  submissions: T[]
): (T & { rank: number })[] {
  const sorted = [...submissions].sort((a, b) => {
    if (b.average_score !== a.average_score) {
      return b.average_score - a.average_score;
    }
    // Tie-breaker 1: Innovation
    const aInno = a.criteria?.innovation || 0;
    const bInno = b.criteria?.innovation || 0;
    if (bInno !== aInno) {
      return bInno - aInno;
    }
    // Tie-breaker 2: Execution
    const aExec = a.criteria?.execution || 0;
    const bExec = b.criteria?.execution || 0;
    return bExec - aExec;
  });

  return sorted.map((sub, index) => ({
    ...sub,
    rank: index + 1
  }));
}

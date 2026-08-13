export interface RawResponses {
  [questionId: string]: string; // raw choice value
}

export interface DimensionScore {
  dimensionCode: string;
  rawScore: number;
  normalizedScore: number; // 0.0 to 1.0
  zScore: number;
  tScore: number;
  sem: number;
  ciLower: number;
  ciUpper: number;
}

export interface QualityReport {
  assessmentQuality: 'Good' | 'Review Answers';
  reasons: string[];
}

// Full psychometric norms database for CareerCompass
export const NORM_TABLE: { [dimension: string]: { mean: number; sd: number; reliability: number } } = {
  // RIASEC Interests
  RIASEC_R: { mean: 3.2, sd: 0.8, reliability: 0.82 },
  RIASEC_I: { mean: 3.4, sd: 0.75, reliability: 0.85 },
  RIASEC_A: { mean: 3.0, sd: 0.9, reliability: 0.80 },
  RIASEC_S: { mean: 3.6, sd: 0.7, reliability: 0.84 },
  RIASEC_E: { mean: 3.5, sd: 0.85, reliability: 0.81 },
  RIASEC_C: { mean: 3.3, sd: 0.78, reliability: 0.83 },

  // Cognitive Aptitudes (fluid & crystallized reasoning)
  COG_NUM: { mean: 0.60, sd: 0.22, reliability: 0.78 },
  COG_VER: { mean: 0.65, sd: 0.20, reliability: 0.76 },
  COG_ABS: { mean: 0.58, sd: 0.25, reliability: 0.80 },
  COG_SPA: { mean: 0.52, sd: 0.24, reliability: 0.75 },
  COG_WM:  { mean: 0.55, sd: 0.23, reliability: 0.77 },
  COG_PS:  { mean: 0.62, sd: 0.21, reliability: 0.76 },

  // Personal & Work Styles
  STYLE_COL: { mean: 3.1, sd: 0.82, reliability: 0.80 },
  STYLE_IND: { mean: 3.0, sd: 0.85, reliability: 0.79 },
  STYLE_STR: { mean: 3.3, sd: 0.80, reliability: 0.81 },
  STYLE_ADA: { mean: 3.2, sd: 0.78, reliability: 0.80 },
  STYLE_PER: { mean: 3.4, sd: 0.83, reliability: 0.82 },
  STYLE_LEA: { mean: 3.1, sd: 0.86, reliability: 0.81 },
  STYLE_COM: { mean: 3.3, sd: 0.79, reliability: 0.80 },
  STYLE_DET: { mean: 3.2, sd: 0.84, reliability: 0.82 },

  // Career Values
  VAL_HELP: { mean: 3.8, sd: 0.75, reliability: 0.84 },
  VAL_CRE:  { mean: 3.4, sd: 0.88, reliability: 0.80 },
  VAL_IND:  { mean: 3.2, sd: 0.82, reliability: 0.81 },
  VAL_FIN:  { mean: 3.9, sd: 0.70, reliability: 0.83 },
  VAL_STAB: { mean: 3.6, sd: 0.78, reliability: 0.82 },
  VAL_LEA:  { mean: 3.3, sd: 0.84, reliability: 0.81 },
  VAL_INNO: { mean: 3.5, sd: 0.85, reliability: 0.80 },
  VAL_SOC:  { mean: 3.6, sd: 0.77, reliability: 0.83 }
};

/**
 * Calculates CTT and standard scores for interests, aptitudes, styles, and values.
 */
export function calculateScores(
  responses: RawResponses,
  questions: { id: string; dimensionCode: string; category: 'interest' | 'aptitude' | 'style' | 'value' | 'subject' | 'motivator'; correctAnswer?: string }[]
): Record<string, DimensionScore> {
  const dimensionSums: Record<string, { sum: number; count: number }> = {};
  
  questions.forEach(q => {
    const response = responses[q.id];
    if (response === undefined) return;

    if (!dimensionSums[q.dimensionCode]) {
      dimensionSums[q.dimensionCode] = { sum: 0, count: 0 };
    }

    if (q.category === 'interest' || q.category === 'style' || q.category === 'value') {
      // Map standard descriptors & Likert scales to numeric values (1 to 5)
      let val = 3.0; // default neutral
      const cleanText = response.toLowerCase();
      
      if (cleanText === 'love' || cleanText === 'like' || cleanText === 'often' || cleanText === 'very important' || cleanText === 'yes, true' || cleanText === 'agree') {
        val = 5.0;
      } else if (cleanText === 'sometimes' || cleanText === 'neutral' || cleanText === 'useful' || cleanText === 'medium') {
        val = 3.0;
      } else if (cleanText === 'dislike' || cleanText === 'rarely' || cleanText === 'not important' || cleanText === 'no, false' || cleanText === 'disagree') {
        val = 1.0;
      }

      dimensionSums[q.dimensionCode].sum += val;
      dimensionSums[q.dimensionCode].count += 1;
    } else if (q.category === 'subject') {
      // Scale 1 to 5
      let val = 3.0;
      const cleanText = response.toLowerCase();
      if (cleanText.includes("high") || cleanText.includes("higher") || cleanText === "above average") {
        val = 5.0;
      } else if (cleanText.includes("medium") || cleanText.includes("c6") || cleanText === "average") {
        val = 3.0;
      } else if (cleanText.includes("low") || cleanText.includes("lower") || cleanText === "below average") {
        val = 1.0;
      }
      dimensionSums[q.dimensionCode].sum += val;
      dimensionSums[q.dimensionCode].count += 1;
    } else if (q.category === 'motivator') {
      // Scale 1 to 5
      let val = 3.0;
      const cleanText = response.toLowerCase();
      if (cleanText === 'agree' || cleanText === 'yes, true') val = 5.0;
      else if (cleanText === 'neutral') val = 3.0;
      else if (cleanText === 'disagree' || cleanText === 'no, false') val = 1.0;

      dimensionSums[q.dimensionCode].sum += val;
      dimensionSums[q.dimensionCode].count += 1;
    } else if (q.category === 'aptitude') {
      // Correct (1.0) or Incorrect (0.0)
      const val = response.trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase() ? 1.0 : 0.0;
      dimensionSums[q.dimensionCode].sum += val;
      dimensionSums[q.dimensionCode].count += 1;
    }
  });

  const scores: Record<string, DimensionScore> = {};

  Object.entries(dimensionSums).forEach(([dim, data]) => {
    const raw = data.count > 0 ? data.sum / data.count : 0.0;
    const norm = NORM_TABLE[dim] || { mean: 3.0, sd: 1.0, reliability: 0.80 };
    
    // Z-Score: (X - Mean) / SD
    const z = norm.sd > 0 ? (raw - norm.mean) / norm.sd : 0.0;
    
    // T-Score: 50 + 10 * Z
    const t = 50 + 10 * z;
    
    // SEM = SD * sqrt(1 - Reliability)
    const sem = norm.sd * Math.sqrt(1 - norm.reliability);
    
    // Confidence intervals
    const ciLower = Math.max(1.0, raw - 1.96 * sem);
    const ciUpper = Math.min(5.0, raw + 1.96 * sem);

    // Normalize to 0.0 - 1.0 scale
    let normalized = 0.5;
    if (dim.startsWith('RIASEC') || dim.startsWith('STYLE') || dim.startsWith('VAL') || dim.includes('INT') || dim.includes('PERF') || dim.startsWith('MOT')) {
      // 1-5 scale mapped to 0-1
      normalized = (raw - 1) / 4;
    } else {
      // 0-1 ratio mapped directly
      normalized = raw;
    }

    scores[dim] = {
      dimensionCode: dim,
      rawScore: raw,
      normalizedScore: Math.min(1.0, Math.max(0.0, normalized)),
      zScore: Number(z.toFixed(2)),
      tScore: Number(t.toFixed(1)),
      sem: Number(sem.toFixed(2)),
      ciLower: Number(ciLower.toFixed(2)),
      ciUpper: Number(ciUpper.toFixed(2))
    };
  });

  return scores;
}

/**
 * Checks for unusually fast completion or contradictory answers.
 */
export function evaluateAssessmentQuality(
  responses: RawResponses,
  averageTimePerQuestionMs?: number
): QualityReport {
  const reasons: string[] = [];

  // 1. Unusually fast completion check
  if (averageTimePerQuestionMs !== undefined && averageTimePerQuestionMs < 1500) {
    reasons.push("Quest completed unusually fast (possible click-through).");
  }

  // 2. Contradiction checking
  // If student claims to highly prefer working alone (S4-STY-COL: Dislike, or S2-STY-IND: Often)
  // but also highly prefers working in large teams (S4-STY-COL: Like, etc.)
  const soloPref = responses["S2-STY-IND"] || responses["S1-STY-IND"];
  const colPref = responses["S3-STY-COL"] || responses["S4-STY-COL"] || responses["S1-STY-COL"];

  if (soloPref && colPref) {
    const isSolo = soloPref.toLowerCase() === "often" || soloPref.toLowerCase() === "like" || soloPref.toLowerCase() === "yes, true";
    const isCol = colPref.toLowerCase() === "like" || colPref.toLowerCase() === "yes, true";
    if (isSolo && isCol) {
      reasons.push("Contradictory collaboration vs. independent preference detected.");
    }
  }

  const quality: 'Good' | 'Review Answers' = reasons.length > 0 ? 'Review Answers' : 'Good';
  return {
    assessmentQuality: quality,
    reasons
  };
}

export function evaluateBranching(
  cognitiveCorrectCount: number,
  totalCognitiveCount: number
): 'advanced' | 'standard' | 'developmental' {
  if (totalCognitiveCount === 0) return 'standard';
  const ratio = cognitiveCorrectCount / totalCognitiveCount;
  if (ratio >= 0.75) return 'advanced';
  if (ratio <= 0.40) return 'developmental';
  return 'standard';
}

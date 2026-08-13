import { CAREER_TAXONOMY, Occupation, CareerCluster, UNIVERSITY_COURSES, UniversityCourse } from "../data/taxonomy";
import { DimensionScore } from "../scoring/scoring";

export interface MatchEvidence {
  dimension: string;
  strength: 'strong' | 'moderate' | 'weak';
  description: string;
}

export interface CareerMatchResult {
  occupation: Occupation;
  matchScore: number; // 0.0 to 100
  matchCategory: 'Strong Fit' | 'Stretch Fit' | 'Requires Dev';
  evidence: MatchEvidence[];
  confidence: 'High' | 'Medium' | 'Low';
  academicPrereqsMet: boolean;
  missingSubjects: string[];
  readiness: 'Ready' | 'Developing' | 'Requires Prep';
  whyNotYet?: string;
  alternatives: string[];
  developmentOpportunities: string[];
}

export interface StudentAcademicRecord {
  grades: { [subject: string]: number }; // Numeric score 0 to 100
  streamPreference?: string;
  schoolResourceIndex: number; // 1 to 5
}

function normalizeSubjectName(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes("math")) return "mathematics";
  if (n.includes("eng")) return "english language";
  if (n.includes("agric")) return "agricultural science";
  if (n.includes("art")) return "fine art / literature";
  if (n.includes("lit")) return "fine art / literature";
  return n;
}

function getWaecGradeEquivalent(score: number): string {
  if (score >= 75) return "A1";
  if (score >= 70) return "B2";
  if (score >= 65) return "B3";
  if (score >= 60) return "C4";
  if (score >= 55) return "C5";
  if (score >= 50) return "C6";
  if (score >= 45) return "D7";
  if (score >= 40) return "E8";
  return "F9";
}

function isWaecGradeSufficient(grade: string, reqGrade: string): boolean {
  const order = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];
  const gradeIdx = order.indexOf(grade);
  const reqIdx = order.indexOf(reqGrade);
  if (gradeIdx === -1) return false;
  if (reqIdx === -1) return true;
  return gradeIdx <= reqIdx;
}

// Multi-dimensional Profile expectations for each Career Cluster
const CLUSTER_PROFILES: Record<string, {
  style: Record<string, number>;
  value: Record<string, number>;
  subject: Record<string, number>;
}> = {
  "CL-MED": {
    style: { STYLE_DET: 0.85, STYLE_PER: 0.80, STYLE_COL: 0.75 },
    value: { VAL_HELP: 0.90, VAL_STAB: 0.75 },
    subject: { SUB_SCI_INT: 0.90, SUB_MATH_INT: 0.70 }
  },
  "CL-TECH": {
    style: { STYLE_PER: 0.85, STYLE_IND: 0.70, STYLE_ADA: 0.80 },
    value: { VAL_INNO: 0.90, VAL_CRE: 0.80 },
    subject: { SUB_MATH_INT: 0.85, SUB_SCI_INT: 0.70 }
  },
  "CL-ENG": {
    style: { STYLE_DET: 0.80, STYLE_PER: 0.85, STYLE_STR: 0.75 },
    value: { VAL_INNO: 0.85, VAL_STAB: 0.70 },
    subject: { SUB_MATH_INT: 0.90, SUB_SCI_INT: 0.80 }
  },
  "CL-SCI": {
    style: { STYLE_PER: 0.90, STYLE_IND: 0.75, STYLE_DET: 0.80 },
    value: { VAL_INNO: 0.90, VAL_SOC: 0.75 },
    subject: { SUB_SCI_INT: 0.90, SUB_MATH_INT: 0.80 }
  },
  "CL-FIN": {
    style: { STYLE_DET: 0.85, STYLE_LEA: 0.80, STYLE_STR: 0.75 },
    value: { VAL_FIN: 0.90, VAL_STAB: 0.75 },
    subject: { SUB_MATH_INT: 0.80 }
  },
  "CL-LAW": {
    style: { STYLE_LEA: 0.85, STYLE_COM: 0.90, STYLE_PER: 0.75 },
    value: { VAL_SOC: 0.80, VAL_REC: 0.75 },
    subject: { SUB_MATH_INT: 0.40 }
  },
  "CL-CREA": {
    style: { STYLE_IND: 0.80, STYLE_ADA: 0.85, STYLE_COM: 0.75 },
    value: { VAL_CRE: 0.95, VAL_INNO: 0.80 },
    subject: { SUB_MATH_INT: 0.40 }
  },
  "CL-EDU": {
    style: { STYLE_COL: 0.90, STYLE_COM: 0.85 },
    value: { VAL_HELP: 0.90, VAL_SOC: 0.85 },
    subject: { SUB_MATH_INT: 0.60 }
  },
  "CL-AGRI": {
    style: { STYLE_PER: 0.75, STYLE_IND: 0.70 },
    value: { VAL_SOC: 0.80, VAL_STAB: 0.70 },
    subject: { SUB_SCI_INT: 0.75 }
  },
  "CL-AVIA": {
    style: { STYLE_DET: 0.90, STYLE_STR: 0.85, STYLE_ADA: 0.80 },
    value: { VAL_STAB: 0.85, VAL_REC: 0.70 },
    subject: { SUB_MATH_INT: 0.80, SUB_SCI_INT: 0.80 }
  },
  "CL-VOCA": {
    style: { STYLE_PER: 0.80, STYLE_IND: 0.75 },
    value: { VAL_STAB: 0.80, VAL_FIN: 0.70 },
    subject: { SUB_MATH_INT: 0.50 }
  }
};

export function matchStudentToCareers(
  dimensionScores: Record<string, DimensionScore>,
  academicRecord: StudentAcademicRecord
): CareerMatchResult[] {
  const results: CareerMatchResult[] = [];

  const getVal = (code: string) => dimensionScores[code]?.normalizedScore ?? 0.5;

  // Compensatory scaling for under-resourced schools
  let numerical = getVal("COG_NUM");
  let abstract = getVal("COG_ABS");
  let verbal = getVal("COG_VER");
  let spatial = getVal("COG_SPA");
  let workingMemory = getVal("COG_WM");
  let processingSpeed = getVal("COG_PS");

  if (academicRecord.schoolResourceIndex <= 2) {
    abstract = Math.min(1.0, abstract * 1.15);
    numerical = Math.min(1.0, numerical * 1.10);
    verbal = Math.min(1.0, verbal * 1.05);
  }

  // Iterate over all clusters and occupations
  CAREER_TAXONOMY.forEach((cluster) => {
    cluster.occupations.forEach((occ) => {
      // 1. Calculate Vocational Interest score (RIASEC vector match)
      let riasecScore = 0;
      let riasecDiv = 0;
      const riasecKeys = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"];
      riasecKeys.forEach((key) => {
        const studentVal = getVal(`RIASEC_${key.substring(0, 1).toUpperCase()}`);
        const careerReq = (occ.vectors.interests as any)[key];
        if (careerReq) {
          riasecScore += careerReq.weight * (1 - Math.abs(studentVal - careerReq.ideal));
          riasecDiv += careerReq.weight;
        }
      });
      const interestFit = riasecDiv > 0 ? riasecScore / riasecDiv : 0.5;

      // 2. Calculate Cognitive Aptitude fit
      let cogScore = 0;
      let cogDiv = 0;
      const cogKeys = [
        { key: "numerical", val: numerical },
        { key: "verbal", val: verbal },
        { key: "abstract", val: abstract },
        { key: "spatial", val: spatial },
        { key: "workingMemory", val: workingMemory },
        { key: "processingSpeed", val: processingSpeed }
      ];
      cogKeys.forEach((item) => {
        const careerReq = (occ.vectors.aptitudes as any)[item.key];
        if (careerReq) {
          cogScore += careerReq.weight * (1 - Math.abs(item.val - careerReq.ideal));
          cogDiv += careerReq.weight;
        }
      });
      const aptitudeFit = cogDiv > 0 ? cogScore / cogDiv : 0.5;

      // 3. Style & Values fits from expectation tables
      const expectations = CLUSTER_PROFILES[cluster.id] || { style: {}, value: {}, subject: {} };
      
      let styleScore = 0;
      let styleDiv = 0;
      Object.entries(expectations.style).forEach(([styleKey, ideal]) => {
        const studentVal = getVal(styleKey);
        styleScore += 1 - Math.abs(studentVal - ideal);
        styleDiv += 1;
      });
      const styleFit = styleDiv > 0 ? styleScore / styleDiv : 0.5;

      let valueScore = 0;
      let valueDiv = 0;
      Object.entries(expectations.value).forEach(([valKey, ideal]) => {
        const studentVal = getVal(valKey);
        valueScore += 1 - Math.abs(studentVal - ideal);
        valueDiv += 1;
      });
      const valueFit = valueDiv > 0 ? valueScore / valueDiv : 0.5;

      let subjectScore = 0;
      let subjectDiv = 0;
      Object.entries(expectations.subject).forEach(([subKey, ideal]) => {
        const studentVal = getVal(subKey);
        subjectScore += 1 - Math.abs(studentVal - ideal);
        subjectDiv += 1;
      });
      const subjectFit = subjectDiv > 0 ? subjectScore / subjectDiv : 0.5;

      // 4. Academic requirements met check
      let academicPrereqsMet = true;
      const missingSubjects: string[] = [];
      occ.waecSubjects.forEach((req) => {
        const normalizedName = normalizeSubjectName(req.subject);
        let foundScore = 40; // Default E8 if not entered
        Object.entries(academicRecord.grades).forEach(([sub, score]) => {
          if (normalizeSubjectName(sub) === normalizedName) {
            foundScore = score;
          }
        });
        const letter = getWaecGradeEquivalent(foundScore);
        if (!isWaecGradeSufficient(letter, req.minGrade)) {
          academicPrereqsMet = false;
          missingSubjects.push(`${req.subject} (Needs ${req.minGrade}, got ${letter})`);
        }
      });

      // 5. Dynamic career requirements check
      const reqsFit = academicPrereqsMet ? 1.0 : 0.5;

      // Weighted Multi-Dimensional Career Fit Score Formula (Pillar 9)
      // Interest 30%, Cognitive Aptitudes 25%, Work Style 15%, Career Values 10%, Subject Affinity 10%, Requirements 10%
      const finalFitScore = 
        0.30 * interestFit +
        0.25 * aptitudeFit +
        0.15 * styleFit +
        0.10 * valueFit +
        0.10 * subjectFit +
        0.10 * reqsFit;

      // 6. Separate Fit from Career Readiness (Pillar 18)
      let readiness: 'Ready' | 'Developing' | 'Requires Prep' = 'Ready';
      if (!academicPrereqsMet) {
        readiness = missingSubjects.length > 2 ? 'Requires Prep' : 'Developing';
      }

      // 7. Evidence logic (Pillar 10)
      const evidence: MatchEvidence[] = [];
      if (interestFit >= 0.70) {
        evidence.push({ dimension: "Vocational Interest", strength: "strong", description: "Excellent compatibility with tasks in this career path." });
      }
      if (aptitudeFit >= 0.70) {
        evidence.push({ dimension: "Cognitive Aptitude", strength: "strong", description: "Reasoning scores exceed core suitability standards." });
      }
      if (valueFit >= 0.75) {
        evidence.push({ dimension: "Career Values", strength: "strong", description: "Aligned with your personal motivations and future values." });
      }

      // 8. Why Not Yet & Development Opportunities (Pillars 11, 13)
      let whyNotYet = undefined;
      if (!academicPrereqsMet) {
        whyNotYet = `Your profile shows a promising fit, but strengthening core performance in ${missingSubjects.map(s => s.split(" ")[0]).join(", ")} will solidify your university eligibility.`;
      }

      const developmentOpportunities = [
        "Practical internships or shadow training.",
        "Strengthening written and verbal communication styles.",
        "Developing hands-on project portfolios."
      ];

      // related alternatives (Pillar 12)
      const alternatives = cluster.occupations
        .filter(o => o.id !== occ.id)
        .map(o => o.title)
        .concat(["Field Specialist", "Research Analyst"]);

      // Confidence calculations (Pillar 15)
      let confidence: 'High' | 'Medium' | 'Low' = 'High';
      const scoreKeys = Object.keys(dimensionScores);
      if (scoreKeys.length < 8) confidence = 'Low';
      else if (scoreKeys.length < 15) confidence = 'Medium';

      results.push({
        occupation: occ,
        matchScore: Math.round(finalFitScore * 100),
        matchCategory: finalFitScore >= 0.75 ? (academicPrereqsMet ? 'Strong Fit' : 'Stretch Fit') : 'Requires Dev',
        evidence,
        confidence,
        academicPrereqsMet,
        missingSubjects,
        readiness,
        whyNotYet,
        alternatives,
        developmentOpportunities
      });
    });
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export interface UniversityMatchResult {
  course: UniversityCourse;
  matchScore: number;
  eligible: boolean;
  missingWaec: string[];
  missingJamb: string[];
  requiredJamb: string[];
}

export function matchStudentToUniversityCourses(
  dimensionScores: Record<string, DimensionScore>,
  waecGrades: Record<string, string>,
  jambSubjects: string[]
): UniversityMatchResult[] {
  const results: UniversityMatchResult[] = [];
  const getVal = (code: string) => dimensionScores[code]?.normalizedScore ?? 0.5;

  UNIVERSITY_COURSES.forEach((course) => {
    // Basic match score
    let scoreSum = 0;
    let scoreDiv = 0;
    const reqKeys = ["numerical", "verbal", "abstract", "spatial"];
    reqKeys.forEach((key) => {
      const studentVal = getVal(`COG_${key.substring(0, 3).toUpperCase()}`);
      const req = (course.vectors.aptitudes as any)[key];
      if (req) {
        scoreSum += req.weight * (1 - Math.abs(studentVal - req.ideal));
        scoreDiv += req.weight;
      }
    });

    const finalMatchScore = scoreDiv > 0 ? scoreSum / scoreDiv : 0.5;

    // Validate O-level grades
    let eligible = true;
    const missingWaec: string[] = [];
    course.waecRequirements.forEach((req) => {
      const normalizedReqName = normalizeSubjectName(req.subject);
      let foundGrade = "F9";
      Object.entries(waecGrades).forEach(([sub, grade]) => {
        if (normalizeSubjectName(sub) === normalizedReqName) {
          foundGrade = grade.trim().toUpperCase();
        }
      });

      if (!isWaecGradeSufficient(foundGrade, req.minGrade)) {
        eligible = false;
        missingWaec.push(`${req.subject} (Got ${foundGrade}, needs ${req.minGrade})`);
      }
    });

    // Validate JAMB
    const missingJamb: string[] = [];
    const normalizedStudentJamb = jambSubjects.map(s => normalizeSubjectName(s));
    course.jambCompulsory.forEach((comp) => {
      if (!normalizedStudentJamb.includes(normalizeSubjectName(comp))) {
        eligible = false;
        missingJamb.push(`Required subject missing: ${comp}`);
      }
    });

    if (course.jambOptions.length > 0) {
      const normalizedOptions = course.jambOptions.map(s => normalizeSubjectName(s));
      const match = normalizedStudentJamb.some(s => normalizedOptions.includes(s));
      if (!match) {
        eligible = false;
        missingJamb.push(`Must include one of: ${course.jambOptions.join(", ")}`);
      }
    }

    results.push({
      course,
      matchScore: Math.round(finalMatchScore * 100),
      eligible,
      missingWaec,
      missingJamb,
      requiredJamb: [...course.jambCompulsory, ...(course.jambOptions.length > 0 ? [`One of: ${course.jambOptions.join("/")}`] : [])]
    });
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

"use server";

import { prisma } from "@/lib/db";
import { encryptText, decryptText } from "@/lib/security/crypto";
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS, STAGE_3_QUESTIONS, STAGE_4_QUESTIONS, ALL_QUESTIONS } from "@/lib/data/questions";
import { CAREER_TAXONOMY } from "@/lib/data/taxonomy";
import { calculateScores, evaluateAssessmentQuality } from "@/lib/scoring/scoring";
import { matchStudentToCareers, CareerMatchResult, matchStudentToUniversityCourses, UniversityMatchResult } from "@/lib/matching/engine";

/**
 * Proactive Database Seeder
 * Installs standard Nigeria config, active assessments, and question banks if missing.
 */
async function ensureDatabaseSeeded() {
  let country = await prisma.country.findFirst({ where: { isoCode: "NGA" } });
  if (!country) {
    country = await prisma.country.create({
      data: {
        countryName: "Nigeria",
        isoCode: "NGA",
        currencyCode: "NGN",
        defaultLanguage: "en"
      }
    });
  }

  let tenant = await prisma.tenant.findFirst({ where: { schoolCode: "FED-SCI-01" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        schoolName: "Federal Science College, Lagos",
        schoolCode: "FED-SCI-01",
        countryId: country.id
      }
    });
  }

  let stage1Assessment = await prisma.assessment.findFirst({
    where: { stage: "primary", countryId: country.id }
  });
  if (!stage1Assessment) {
    stage1Assessment = await prisma.assessment.create({
      data: {
        title: "Stage 1 Curiosity Screening",
        version: "v1.0",
        type: "screening",
        stage: "primary",
        countryId: country.id
      }
    });

    for (const q of STAGE_1_QUESTIONS) {
      await prisma.question.create({
        data: {
          id: q.id,
          assessmentId: stage1Assessment.id,
          dimensionCode: q.dimensionCode,
          itemType: q.category === "interest" ? "card_sort" : "multiple_choice",
          questionText: q.text,
          metadata: JSON.stringify(q.options || [])
        }
      });
    }
  }

  let stage2Assessment = await prisma.assessment.findFirst({
    where: { stage: "basic", countryId: country.id }
  });
  if (!stage2Assessment) {
    stage2Assessment = await prisma.assessment.create({
      data: {
        title: "Stage 2 Developing Discovery",
        version: "v1.0",
        type: "standard",
        stage: "basic",
        countryId: country.id
      }
    });

    for (const q of STAGE_2_QUESTIONS) {
      await prisma.question.create({
        data: {
          id: q.id,
          assessmentId: stage2Assessment.id,
          dimensionCode: q.dimensionCode,
          itemType: q.category === "interest" || q.category === "style" || q.category === "value" ? "likert" : "multiple_choice",
          questionText: q.text,
          metadata: JSON.stringify(q.options || []),
          difficultyB: 0.0
        }
      });
    }
  }

  let stage3Assessment = await prisma.assessment.findFirst({
    where: { stage: "junior_secondary", countryId: country.id }
  });
  if (!stage3Assessment) {
    stage3Assessment = await prisma.assessment.create({
      data: {
        title: "Stage 3 Standard Quest",
        version: "v1.0",
        type: "standard",
        stage: "junior_secondary",
        countryId: country.id
      }
    });

    for (const q of STAGE_3_QUESTIONS) {
      await prisma.question.create({
        data: {
          id: q.id,
          assessmentId: stage3Assessment.id,
          dimensionCode: q.dimensionCode,
          itemType: q.category === "interest" || q.category === "style" || q.category === "value" || q.category === "subject" || q.category === "motivator" ? "likert" : "multiple_choice",
          questionText: q.text,
          metadata: JSON.stringify(q.options || []),
          difficultyB: 0.0
        }
      });
    }
  }

  let stage4Assessment = await prisma.assessment.findFirst({
    where: { stage: "senior_secondary", countryId: country.id }
  });
  if (!stage4Assessment) {
    stage4Assessment = await prisma.assessment.create({
      data: {
        title: "Stage 4 University Prep",
        version: "v1.0",
        type: "comprehensive",
        stage: "senior_secondary",
        countryId: country.id
      }
    });

    for (const q of STAGE_4_QUESTIONS) {
      await prisma.question.create({
        data: {
          id: q.id,
          assessmentId: stage4Assessment.id,
          dimensionCode: q.dimensionCode,
          itemType: q.category === "interest" || q.category === "style" || q.category === "value" || q.category === "subject" || q.category === "motivator" ? "likert" : "multiple_choice",
          questionText: q.text,
          metadata: JSON.stringify(q.options || []),
          difficultyB: 0.0
        }
      });
    }
  }

  // Seed default Consultant user
  let consultant = await prisma.user.findFirst({
    where: { email: "consultant@akilipath.com" }
  });
  if (!consultant) {
    await prisma.user.create({
      data: {
        email: "consultant@akilipath.com",
        passwordHash: "Akili-Consultant-2026",
        userRole: "school_admin",
        firstName: "Independent",
        lastName: "Consultant",
        isVerified: true
      }
    });
  }

  return { 
    countryId: country.id, 
    tenantId: tenant.id, 
    stage1Id: stage1Assessment.id, 
    stage2Id: stage2Assessment.id, 
    stage3Id: stage3Assessment.id, 
    stage4Id: stage4Assessment.id 
  };
}

/**
 * Creates a new school/tenant in the database.
 */
export async function createSchool(schoolName: string, schoolCode: string) {
  const seed = await ensureDatabaseSeeded();
  const country = await prisma.country.findFirst({ where: { isoCode: "NGA" } });
  const countryId = country ? country.id : seed.countryId;

  return await prisma.tenant.create({
    data: {
      schoolName,
      schoolCode: schoolCode.trim().toUpperCase(),
      countryId
    }
  });
}

/**
 * Fetches all registered school tenants.
 */
export async function getSchools() {
  await ensureDatabaseSeeded();
  return await prisma.tenant.findMany({
    orderBy: { schoolName: "asc" }
  });
}

/**
 * Generates batch passcodes formatted as: AKILI-XXXX-XXXX
 */
export async function generateAccessCodes(count: number) {
  await ensureDatabaseSeeded();
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // readable chars
  const generated = [];

  for (let i = 0; i < count; i++) {
    let codeStr = "AKILI-";
    for (let c = 0; c < 4; c++) {
      codeStr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    codeStr += "-";
    for (let c = 0; c < 4; c++) {
      codeStr += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const record = await prisma.accessCode.create({
      data: { code: codeStr }
    });
    generated.push(record);
  }

  return generated;
}

/**
 * Fetches all generated codes, resolving student names if used.
 */
export async function getAccessCodes() {
  await ensureDatabaseSeeded();
  const codes = await prisma.accessCode.findMany({
    include: {
      student: {
        include: { pii: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return codes.map(c => {
    let studentName = "—";
    if (c.student && c.student.pii) {
      const first = decryptText(c.student.pii.encryptedFirstName, c.student.pii.iv);
      const last = decryptText(c.student.pii.encryptedLastName, c.student.pii.iv);
      studentName = `${first} ${last}`.trim();
    }

    return {
      id: c.id,
      code: c.code,
      status: c.status,
      createdAt: c.createdAt,
      usedAt: c.usedAt,
      studentName
    };
  });
}

/**
 * Registers a new student, encrypts PII, validates optional Access Passcodes,
 * and automatically provisions a Parent account if an email is provided.
 */
export async function registerStudent(
  name: string, 
  gradeLevel: string, 
  tenantId?: string, 
  parentEmail?: string,
  passcode?: string
) {
  try {
    const seed = await ensureDatabaseSeeded();
    const activeTenantId = tenantId === "independent" ? null : (tenantId || seed.tenantId);

    const names = name.split(" ");
    const firstName = names[0] || "Student";
    const lastName = names.slice(1).join(" ") || "Roster";

    const encryptedFirst = encryptText(firstName);
    const encryptedLast = encryptText(lastName);

    // 1. Manage Passcode Validation (monetization step)
    let claimedAccessCodeId: string | null = null;
    if (passcode && passcode.trim()) {
      const cleanCode = passcode.trim().toUpperCase();
      const accessCodeRecord = await prisma.accessCode.findUnique({
        where: { code: cleanCode }
      });

      if (!accessCodeRecord) {
        return { success: false, error: "Invalid access passcode. Please check spelling or verify payment." };
      }
      if (accessCodeRecord.status !== "unused") {
        return { success: false, error: "This access passcode has already been used." };
      }

      claimedAccessCodeId = accessCodeRecord.id;
    }

    // 2. Manage Automatic Parent Creation
    let parentUserId: string | null = null;
    if (parentEmail && parentEmail.trim()) {
      const cleanEmail = parentEmail.trim().toLowerCase();
      
      let parentUser = await prisma.user.findFirst({
        where: { email: cleanEmail, userRole: "parent" }
      });

      if (!parentUser) {
        const tempPassword = `Akili-${firstName}-123`;
        parentUser = await prisma.user.create({
          data: {
            email: cleanEmail,
            firstName: "Parent of",
            lastName: firstName,
            passwordHash: tempPassword,
            userRole: "parent",
            isVerified: true
          }
        });
      }
      parentUserId = parentUser.id;
    }

    // Parse grade level
    const numericGrade = gradeLevel.includes("JSS") 
      ? parseInt(gradeLevel.split(" ")[1]) 
      : gradeLevel.includes("SSS") ? parseInt(gradeLevel.split(" ")[1]) + 3 : 1;

    const track = gradeLevel.includes("SSS") 
      ? "senior_secondary" 
      : gradeLevel.includes("JSS") ? "junior_secondary" : "basic";

    const student = await prisma.student.create({
      data: {
        tenantId: activeTenantId,
        parentId: parentUserId,
        accessCodeId: claimedAccessCodeId,
        currentGradeLevel: numericGrade,
        academicTrack: track,
        dateOfBirth: "2013-08-13",
        gender: "Male",
        parentalConsentSigned: true,
        consentSignedAt: new Date(),
        pii: {
          create: {
            encryptedFirstName: encryptedFirst.encryptedText,
            encryptedLastName: encryptedLast.encryptedText,
            iv: encryptedFirst.iv
          }
        }
      }
    });

    // Claim passcode in database if validated
    if (claimedAccessCodeId) {
      await prisma.accessCode.update({
        where: { id: claimedAccessCodeId },
        data: {
          status: "used",
          usedAt: new Date()
        }
      });
    }

    return { success: true, id: student.id, name, grade: gradeLevel };
  } catch (err: any) {
    return { success: false, error: err.message || "Database connection error during registration." };
  }
}

/**
 * Bulk registers a CSV list of students for a specific school.
 */
export async function uploadRosterCSV(studentsList: Array<{ name: string; grade: string; parentEmail?: string }>, tenantId?: string) {
  const seed = await ensureDatabaseSeeded();
  const activeTenantId = tenantId || seed.tenantId;

  for (const item of studentsList) {
    await registerStudent(item.name, item.grade, activeTenantId, item.parentEmail);
  }
}

/**
 * Retrieves all registered students for a specific school with decrypted PII.
 */
export async function getStudents(tenantId?: string) {
  const seed = await ensureDatabaseSeeded();
  const activeTenantId = tenantId || seed.tenantId;

  const students = await prisma.student.findMany({
    where: { tenantId: activeTenantId },
    include: {
      pii: true,
      parent: true,
      sessions: {
        include: {
          recommendations: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return students.map((s) => {
    let name = "Anonymized Student";
    if (s.pii) {
      const first = decryptText(s.pii.encryptedFirstName, s.pii.iv);
      const last = decryptText(s.pii.encryptedLastName, s.pii.iv);
      name = `${first} ${last}`.trim();
    }

    const completedSession = s.sessions.find(ses => ses.completedAt !== null);
    const status = completedSession ? "Completed" : "Pending";
    
    let grade = `Grade ${s.currentGradeLevel}`;
    if (s.academicTrack === "junior_secondary") {
      grade = `JSS ${s.currentGradeLevel}`;
    } else if (s.academicTrack === "senior_secondary") {
      grade = `SSS ${s.currentGradeLevel - 3}`;
    }

    let streamFit = "Pending Assessment";
    if (completedSession && completedSession.recommendations.length > 0) {
      const topRec = completedSession.recommendations[0];
      streamFit = topRec.matchCategory === "Strong Fit" ? "Science Stream" : "Commercial Stream";
    }

    return {
      id: s.id,
      name,
      grade,
      streamFit,
      status,
      parentEmail: s.parent?.email || "None Registered"
    };
  });
}

/**
 * Initializes a new assessment session.
 */
export async function initializeSession(studentId: string, stageNum: number) {
  const seed = await ensureDatabaseSeeded();
  let assessmentId = seed.stage1Id;
  if (stageNum === 2) assessmentId = seed.stage2Id;
  else if (stageNum === 3) assessmentId = seed.stage3Id;
  else if (stageNum === 4) assessmentId = seed.stage4Id;

  const session = await prisma.assessmentSession.create({
    data: {
      studentId,
      assessmentId
    }
  });

  return session.id;
}

/**
 * Completes a session, executes psychometrics engines, and stores scores & career recommendations.
 */
export async function completeSession(
  sessionId: string, 
  sessionResponses: Record<string, string>,
  waecGrades?: Record<string, string>,
  jambSubjects?: string[]
) {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: { assessment: { include: { questions: true } } }
  });

  if (!session) {
    throw new Error("Assessment session not found");
  }

  // 1. Save all question responses to the database
  for (const [qId, rawResp] of Object.entries(sessionResponses)) {
    const qObj = ALL_QUESTIONS.find(quest => quest.id === qId);
    let isCorrect = null;
    if (qObj && (qObj.category === "aptitude" || qObj.options === undefined)) {
      isCorrect = rawResp.trim().toLowerCase() === (qObj.correctAnswer || "").trim().toLowerCase();
    }

    await prisma.questionResponse.create({
      data: {
        sessionId,
        questionId: qId,
        rawResponse: rawResp,
        isCorrect
      }
    });
  }

  // 2. Map structures and run the CTT calculations
  const mappedQuestions = session.assessment.questions.map(q => {
    const qObj = ALL_QUESTIONS.find(quest => quest.id === q.id);
    return {
      id: q.id,
      dimensionCode: q.dimensionCode,
      category: qObj?.category || "interest",
      correctAnswer: qObj?.correctAnswer || ""
    };
  });

  const scores = calculateScores(sessionResponses, mappedQuestions);

  // 3. Save all scores to session_scores table
  for (const [dimCode, sc] of Object.entries(scores)) {
    await prisma.sessionScore.create({
      data: {
        sessionId,
        dimensionCode: dimCode,
        rawScore: sc.rawScore,
        standardTScore: sc.tScore,
        confidenceLower: sc.ciLower,
        confidenceUpper: sc.ciUpper
      }
    });
  }

  // 4. Run the vector-space recommendation engine
  const mockAcademic = {
    grades: { "Mathematics": 78, "English Language": 72, "Physics": 65, "Chemistry": 60 },
    schoolResourceIndex: 3
  };

  const careerMatches = matchStudentToCareers(scores, mockAcademic);

  // 5. Save top matches to database recommendations
  for (const match of careerMatches.slice(0, 5)) {
    await prisma.careerRecommendation.create({
      data: {
        sessionId,
        occupationId: match.occupation.id,
        // MatchScore in engine is now 0-100. Let's convert back to 0.0-1.0 float in DB schema
        matchScore: match.matchScore / 100,
        matchCategory: match.matchCategory,
        evidence: JSON.stringify(match.evidence)
      }
    });
  }

  // 6. Check University Admission Course Matching
  let universityMatches: UniversityMatchResult[] = [];
  if (waecGrades && jambSubjects) {
    universityMatches = matchStudentToUniversityCourses(scores, waecGrades, jambSubjects);
  }

  // 7. Calculate and update session quality metadata
  const qualityReport = evaluateAssessmentQuality(sessionResponses, 5000); // 5000ms average default
  await prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      completedAt: new Date(),
      metadata: JSON.stringify(qualityReport)
    }
  });

  return {
    careerMatches,
    universityMatches
  };
}

/**
 * Calculates aggregated school-wide statistics for a specific school.
 */
export async function getSchoolAnalytics(tenantId?: string) {
  const seed = await ensureDatabaseSeeded();
  const activeTenantId = tenantId || seed.tenantId;
  
  const completedSessions = await prisma.assessmentSession.findMany({
    where: { student: { tenantId: activeTenantId }, completedAt: { not: null } },
    include: { recommendations: true }
  });

  const totalCompletions = completedSessions.length;
  
  let scienceCount = 0;
  let commercialCount = 0;
  let technicalCount = 0;
  let artsCount = 0;

  completedSessions.forEach(session => {
    if (session.recommendations.length > 0) {
      const topRec = session.recommendations[0];
      if (topRec.matchCategory === "Strong Fit") scienceCount++;
      else if (topRec.matchCategory === "Stretch Fit") commercialCount++;
      else if (topRec.occupationId.includes("VOC")) technicalCount++;
      else artsCount++;
    }
  });

  const streamRatios = totalCompletions > 0 ? [
    { name: "Science", value: Math.round((scienceCount / totalCompletions) * 100) },
    { name: "Commercial", value: Math.round((commercialCount / totalCompletions) * 100) },
    { name: "Technical", value: Math.round((technicalCount / totalCompletions) * 100) },
    { name: "Arts", value: Math.round((artsCount / totalCompletions) * 100) }
  ] : [
    { name: "Science", value: 40 },
    { name: "Commercial", value: 30 },
    { name: "Technical", value: 18 },
    { name: "Arts", value: 12 }
  ];

  return {
    totalCompletions,
    streamAllocations: streamRatios
  };
}

/**
 * Authenticates a parent using their email and generated temporary password.
 * Returns a list of children profiles linked to that parent ID.
 */
export async function loginParent(email: string, passwordTemp: string) {
  try {
    await ensureDatabaseSeeded();
    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: cleanEmail, userRole: "parent" }
    });

    if (!user || user.passwordHash !== passwordTemp.trim()) {
      return { success: false, error: "Invalid email or temporary password." };
    }

    const children = await prisma.student.findMany({
      where: { parentId: user.id },
      include: { pii: true }
    });

    const formattedChildren = children.map(c => {
      let name = "Anonymized Student";
      if (c.pii) {
        const first = decryptText(c.pii.encryptedFirstName, c.pii.iv);
        const last = decryptText(c.pii.encryptedLastName, c.pii.iv);
        name = `${first} ${last}`.trim();
      }

      return { id: c.id, name };
    });

    return {
      success: true,
      parentId: user.id,
      parentEmail: user.email,
      children: formattedChildren
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Database connection error." };
  }
}

/**
 * Authenticates a consultant using their email and password.
 */
export async function loginConsultant(email: string, passwordTemp: string) {
  try {
    await ensureDatabaseSeeded();
    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: cleanEmail, userRole: "school_admin" }
    });

    if (!user || user.passwordHash !== passwordTemp.trim()) {
      return { success: false, error: "Invalid consultant email or password." };
    }

    return {
      success: true,
      authenticated: true,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Database connection error." };
  }
}

/**
 * Retrieves the latest completed assessment report for a specific student.
 */
export async function getStudentReport(studentId: string) {
  const latestSession = await prisma.assessmentSession.findFirst({
    where: { studentId, completedAt: { not: null } },
    include: {
      student: {
        include: { pii: true, grades: true }
      },
      scores: true,
      recommendations: true
    },
    orderBy: { completedAt: "desc" }
  });

  if (!latestSession) return null;

  let name = "Student Profile";
  if (latestSession.student.pii) {
    const first = decryptText(latestSession.student.pii.encryptedFirstName, latestSession.student.pii.iv);
    const last = decryptText(latestSession.student.pii.encryptedLastName, latestSession.student.pii.iv);
    name = `${first} ${last}`.trim();
  }

  const riasecKeys = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];
  const riasecMap = latestSession.scores.filter(s => s.dimensionCode.startsWith("RIASEC"));
  
  const interestChartData = riasecKeys.map(key => {
    const code = `RIASEC_${key[0]}`;
    const scoreItem = riasecMap.find(s => s.dimensionCode === code);
    const val = scoreItem ? Math.round(scoreItem.rawScore * 20) : 50;
    return { subject: key, value: val, fullMark: 100 };
  });

  const cogKeys = [
    { code: "COG_NUM", label: "Numerical" },
    { code: "COG_VER", label: "Verbal" },
    { code: "COG_ABS", label: "Abstract" },
    { code: "COG_SPA", label: "Spatial" }
  ];
  const cogMap = latestSession.scores.filter(s => s.dimensionCode.startsWith("COG"));
  
  const cogChartData = cogKeys.map(key => {
    const scoreItem = cogMap.find(s => s.dimensionCode === key.code);
    const val = scoreItem ? Math.round(scoreItem.rawScore * 100) : 60;
    return { name: key.label, Score: val };
  });

  // Mapped Work Styles Chart Data
  const styleKeys = [
    { code: "STYLE_COL", label: "Collaboration" },
    { code: "STYLE_IND", label: "Independence" },
    { code: "STYLE_STR", label: "Structure" },
    { code: "STYLE_ADA", label: "Adaptability" },
    { code: "STYLE_PER", label: "Persistence" },
    { code: "STYLE_LEA", label: "Leadership" },
    { code: "STYLE_COM", label: "Communication" },
    { code: "STYLE_DET", label: "Detail" }
  ];
  const styleMap = latestSession.scores.filter(s => s.dimensionCode.startsWith("STYLE"));
  const styleChartData = styleKeys.map(key => {
    const scoreItem = styleMap.find(s => s.dimensionCode === key.code);
    const val = scoreItem ? Math.round(scoreItem.rawScore * 20) : 50;
    return { name: key.label, Score: val };
  });

  // Mapped Career Values Chart Data
  const valKeys = [
    { code: "VAL_HELP", label: "Helping others" },
    { code: "VAL_CRE", label: "Creativity" },
    { code: "VAL_IND", label: "Independence" },
    { code: "VAL_FIN", label: "Financial Goals" },
    { code: "VAL_STAB", label: "Job Security" },
    { code: "VAL_LEA", label: "Leadership" },
    { code: "VAL_INNO", label: "Innovation" },
    { code: "VAL_SOC", label: "Social Impact" }
  ];
  const valMap = latestSession.scores.filter(s => s.dimensionCode.startsWith("VAL"));
  const valueChartData = valKeys.map(key => {
    const scoreItem = valMap.find(s => s.dimensionCode === key.code);
    const val = scoreItem ? Math.round(scoreItem.rawScore * 20) : 50;
    return { name: key.label, Score: val };
  });

  // Mapped Subject Affinity Chart Data
  const subMap = latestSession.scores.filter(s => s.dimensionCode.startsWith("SUB"));
  const subjectChartData = subMap.map(s => {
    const cleanLabel = s.dimensionCode.replace("SUB_", "").replace("_INT", " Interest").replace("_PERF", " Performance");
    return {
      name: cleanLabel,
      Score: Math.round(s.rawScore * 20)
    };
  });

  // Response Quality Assessment
  let qualityLabel: 'Good' | 'Review Answers' = 'Good';
  let qualityReasons: string[] = [];
  try {
    if (latestSession.metadata) {
      const meta = JSON.parse(latestSession.metadata);
      if (meta.assessmentQuality) {
        qualityLabel = meta.assessmentQuality;
        qualityReasons = meta.reasons || [];
      }
    }
  } catch (err) {
    console.error("Failed to parse metadata in report fetch:", err);
  }

  // Multi-dimensional matching calculation from database scores
  const scoresMap: Record<string, any> = {};
  latestSession.scores.forEach(s => {
    // Map normalizedScore between 0.0 and 1.0 based on raw scores (1-5 range mapped to 0-1)
    const norm = s.dimensionCode.startsWith("RIASEC") || s.dimensionCode.startsWith("STYLE") || s.dimensionCode.startsWith("VAL") || s.dimensionCode.startsWith("SUB")
      ? (s.rawScore - 1) / 4
      : s.rawScore;

    scoresMap[s.dimensionCode] = {
      dimensionCode: s.dimensionCode,
      rawScore: s.rawScore,
      normalizedScore: Math.min(1.0, Math.max(0.0, norm))
    };
  });

  const studentGradesMap: Record<string, number> = {};
  const waecMap: Record<string, string> = {};
  latestSession.student.grades.forEach((g: any) => {
    studentGradesMap[g.subjectName] = g.numericScore;
    
    // Map numerical grade to WAEC letter grade
    const score = g.numericScore;
    let letter = "C6";
    if (score >= 75) letter = "A1";
    else if (score >= 70) letter = "B2";
    else if (score >= 65) letter = "B3";
    else if (score >= 60) letter = "C4";
    else if (score >= 55) letter = "C5";
    else if (score >= 50) letter = "C6";
    else if (score >= 45) letter = "D7";
    else if (score >= 40) letter = "E8";
    else letter = "F9";
    waecMap[g.subjectName] = letter;
  });

  const matchRecords = matchStudentToCareers(scoresMap, {
    grades: studentGradesMap,
    schoolResourceIndex: 3
  });

  const recommendations = matchRecords.slice(0, 5).map(m => ({
    title: m.occupation.title,
    description: m.occupation.description,
    matchCategory: m.matchCategory,
    matchScore: m.matchScore,
    evidence: m.evidence,
    confidence: m.confidence,
    readiness: m.readiness,
    whyNotYet: m.whyNotYet,
    alternatives: m.alternatives,
    developmentOpportunities: m.developmentOpportunities,
    waecPrereqs: m.occupation.waecSubjects,
    jambSubjects: m.occupation.jambSubjects
  }));

  const jambCombo = latestSession.student.academicTrack === "senior_secondary" 
    ? ["English Language", "Mathematics", "Physics", "Chemistry"] 
    : ["English Language", "Literature-in-English", "Government", "Economics"];

  const universityMatches = matchStudentToUniversityCourses(scoresMap, waecMap, jambCombo);

  return {
    studentName: name,
    gradeLevel: latestSession.student.currentGradeLevel,
    track: latestSession.student.academicTrack,
    interestChartData,
    cogChartData,
    styleChartData,
    valueChartData,
    subjectChartData,
    recommendations,
    universityMatches,
    qualityReport: {
      qualityLabel,
      qualityReasons
    }
  };
}

/**
 * Retrieves the latest completed assessment report for parent viewing (fallback helper).
 */
export async function getLatestParentReport() {
  const latestSession = await prisma.assessmentSession.findFirst({
    where: { completedAt: { not: null } },
    orderBy: { completedAt: "desc" }
  });

  if (!latestSession) return null;
  return getStudentReport(latestSession.studentId);
}

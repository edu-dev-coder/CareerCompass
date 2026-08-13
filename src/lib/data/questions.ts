export interface VisualChoiceOption {
  value: string;
  label: string;
  imageEmoji: string;
}

export interface Question {
  id: string;
  stage: 1 | 2 | 3 | 4;
  category: 'interest' | 'aptitude' | 'style' | 'value' | 'subject' | 'motivator';
  dimensionCode: string; // e.g., 'RIASEC_R', 'COG_NUM', 'STYLE_COL', 'VAL_CRE', 'SUB_MATH_INT', 'MOT_EXPL'
  text: string;
  options?: VisualChoiceOption[] | string[];
  correctAnswer?: string; // For cognitive aptitude questions
  explanation?: string; // For cognitive review
}

// ----------------------------------------------------
// LEVEL 1: AGES 7-9 (PRIMARY DISCOVERY)
// ----------------------------------------------------
export const STAGE_1_QUESTIONS: Question[] = [
  // Interests (Adapted Holland RIASEC)
  {
    id: "S1-INT-R",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_R",
    text: "Building things with wooden blocks, clay, or Lego toys, or repairing toy circuits.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  {
    id: "S1-INT-I",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_I",
    text: "Exploring nature, examining bugs with a magnifier, or asking how machines work.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  {
    id: "S1-INT-A",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_A",
    text: "Drawing pictures, painting, writing short stories, or making crafts.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  {
    id: "S1-INT-S",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_S",
    text: "Teaching younger children games, or helping classmates with their classwork.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  {
    id: "S1-INT-E",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_E",
    text: "Leading recess games, organizing clubs, or presenting ideas to the class.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  {
    id: "S1-INT-C",
    stage: 1,
    category: "interest",
    dimensionCode: "RIASEC_C",
    text: "Sorting pencil cases by color, organizing files, or counting tokens.",
    options: [
      { value: "love", label: "I love it!", imageEmoji: "😍" },
      { value: "okay", label: "It's okay", imageEmoji: "😐" },
      { value: "dislike", label: "Not for me", imageEmoji: "😢" }
    ]
  },
  // Basic Aptitudes
  {
    id: "S1-APT-N1",
    stage: 1,
    category: "aptitude",
    dimensionCode: "COG_NUM",
    text: "If you share 12 bananas equally among 3 friends, how many bananas does each friend get?",
    options: ["3 bananas", "4 bananas", "5 bananas"],
    correctAnswer: "4 bananas",
    explanation: "12 shared equally by 3 is 4 bananas each."
  },
  {
    id: "S1-APT-A1",
    stage: 1,
    category: "aptitude",
    dimensionCode: "COG_ABS",
    text: "Look at the pattern: 2, 4, 6, 8, ... What is the next number?",
    options: ["9", "10", "12"],
    correctAnswer: "10",
    explanation: "The pattern adds 2 each time, so 8 + 2 = 10."
  },
  // Work Style Preferences
  {
    id: "S1-STY-COL",
    stage: 1,
    category: "style",
    dimensionCode: "STYLE_COL",
    text: "I prefer working on class group projects rather than working completely on my own.",
    options: ["Yes, true", "Sometimes", "No, false"]
  },
  {
    id: "S1-STY-STR",
    stage: 1,
    category: "style",
    dimensionCode: "STYLE_STR",
    text: "I like when the teacher tells me exactly what to do step-by-step.",
    options: ["Yes, true", "Sometimes", "No, false"]
  }
];

// ----------------------------------------------------
// LEVEL 2: AGES 10-12 (DEVELOPING DISCOVERY)
// ----------------------------------------------------
export const STAGE_2_QUESTIONS: Question[] = [
  // RIASEC Interests
  {
    id: "S2-INT-R",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_R",
    text: "Operating machinery, electronic tool kits, or assembling model engines.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S2-INT-I",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_I",
    text: "Reading about science breakthroughs, using math models, or looking at data charts.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S2-INT-A",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_A",
    text: "Designing game graphics, writing scripts, or designing clothes.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S2-INT-S",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_S",
    text: "Volunteering in hospital clinics, teaching classmates, or community service.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S2-INT-E",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_E",
    text: "Selling cookies, organizing classroom events, or leading public projects.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S2-INT-C",
    stage: 2,
    category: "interest",
    dimensionCode: "RIASEC_C",
    text: "Checking logs for spelling errors, organizing spreadsheets, or archiving files.",
    options: ["Dislike", "Neutral", "Like"]
  },
  // Aptitudes
  {
    id: "S2-APT-N1",
    stage: 2,
    category: "aptitude",
    dimensionCode: "COG_NUM",
    text: "If a textbook costs ₦1,500 and is sold at a 20% discount, what is the discount price?",
    options: ["₦1,200", "₦1,300", "₦1,400"],
    correctAnswer: "₦1,200",
    explanation: "20% of 1500 is 300. Discounted price = 1500 - 300 = ₦1,200."
  },
  {
    id: "S2-APT-V1",
    stage: 2,
    category: "aptitude",
    dimensionCode: "COG_VER",
    text: "Find the synonym for primary: 'The primary concern was student safety.'",
    options: ["Minor", "Essential", "Vague"],
    correctAnswer: "Essential",
    explanation: "Primary means chief or main, which matches Essential."
  },
  // Work Style
  {
    id: "S2-STY-PER",
    stage: 2,
    category: "style",
    dimensionCode: "STYLE_PER",
    text: "When a puzzle is hard, I keep trying until I solve it, instead of starting a new one.",
    options: ["Rarely", "Sometimes", "Often"]
  },
  {
    id: "S2-STY-IND",
    stage: 2,
    category: "style",
    dimensionCode: "STYLE_IND",
    text: "I prefer working on my own and choosing my own topics for school assignments.",
    options: ["Rarely", "Sometimes", "Often"]
  },
  // Values
  {
    id: "S2-VAL-HELP",
    stage: 2,
    category: "value",
    dimensionCode: "VAL_HELP",
    text: "How important is it to you that your future career helps make people's lives better?",
    options: ["Not Important", "Somewhat", "Very Important"]
  },
  {
    id: "S2-VAL-FIN",
    stage: 2,
    category: "value",
    dimensionCode: "VAL_FIN",
    text: "How important is earning a very high salary to you in your career selection?",
    options: ["Not Important", "Somewhat", "Very Important"]
  }
];

// ----------------------------------------------------
// LEVEL 3: AGES 13-15 (JUNIOR SECONDARY EXPLORATION)
// ----------------------------------------------------
export const STAGE_3_QUESTIONS: Question[] = [
  // Interests
  {
    id: "S3-INT-R",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_R",
    text: "Operating machinery, wiring electric components, or managing solar equipment.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-INT-I",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_I",
    text: "Running science simulations, looking for data anomalies, or coding software algorithms.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-INT-A",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_A",
    text: "Designing user interfaces, drafting media campaigns, or writing stories.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-INT-S",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_S",
    text: "Counselling people, advising communities, or teaching courses.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-INT-E",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_E",
    text: "Pitching business concepts, directing logistics, or leading associations.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-INT-C",
    stage: 3,
    category: "interest",
    dimensionCode: "RIASEC_C",
    text: "Auditing accounts, compiling database schemas, or archival sorting.",
    options: ["Dislike", "Neutral", "Like"]
  },
  // Cognitive
  {
    id: "S3-APT-N1",
    stage: 3,
    category: "aptitude",
    dimensionCode: "COG_NUM",
    text: "If a solar grid generates 150 kWh in 5 hours, how many kWh does it generate in 12 hours?",
    options: ["300 kWh", "360 kWh", "420 kWh"],
    correctAnswer: "360 kWh",
    explanation: "150/5 = 30 kWh/hr. 30 * 12 = 360 kWh."
  },
  {
    id: "S3-APT-V1",
    stage: 3,
    category: "aptitude",
    dimensionCode: "COG_VER",
    text: "Resilient is closest in meaning to:",
    options: ["Fragile", "Adaptable", "Sluggish"],
    correctAnswer: "Adaptable",
    explanation: "Resilient means robust or adaptable under stress."
  },
  {
    id: "S3-APT-A1",
    stage: 3,
    category: "aptitude",
    dimensionCode: "COG_ABS",
    text: "Sequence: 2, 6, 14, 30, 62, ... What is next?",
    options: ["94", "124", "126"],
    correctAnswer: "126",
    explanation: "Pattern is (n * 2) + 2. (62 * 2) + 2 = 126."
  },
  {
    id: "S3-APT-S1",
    stage: 3,
    category: "aptitude",
    dimensionCode: "COG_SPA",
    text: "Tip a cube forward, then rotate 90 degrees clockwise. What side is now on top?",
    options: ["Original back face", "Original left face", "Original bottom face"],
    correctAnswer: "Original left face",
    explanation: "The mechanical rotation swings the original left face to the top."
  },
  // Styles
  {
    id: "S3-STY-COL",
    stage: 3,
    category: "style",
    dimensionCode: "STYLE_COL",
    text: "I prefer working on collaborative group projects rather than solo projects.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S3-STY-ADA",
    stage: 3,
    category: "style",
    dimensionCode: "STYLE_ADA",
    text: "I feel comfortable when plans change suddenly at school.",
    options: ["Dislike", "Neutral", "Like"]
  },
  // Values
  {
    id: "S3-VAL-CRE",
    stage: 3,
    category: "value",
    dimensionCode: "VAL_CRE",
    text: "Expressing my creativity and original ideas at work is:",
    options: ["Not Important", "Useful", "Essential"]
  },
  {
    id: "S3-VAL-STAB",
    stage: 3,
    category: "value",
    dimensionCode: "VAL_STAB",
    text: "Having a stable job with predictable hours is:",
    options: ["Not Important", "Useful", "Essential"]
  },
  // Subject Affinity (Interest vs Performance)
  {
    id: "S3-SUB-MATH-INT",
    stage: 3,
    category: "subject",
    dimensionCode: "SUB_MATH_INT",
    text: "Rate your interest: I enjoy solving math and logic homework.",
    options: ["Low", "Medium", "High"]
  },
  {
    id: "S3-SUB-MATH-PERF",
    stage: 3,
    category: "subject",
    dimensionCode: "SUB_MATH_PERF",
    text: "Rate your school performance: My recent math test marks are usually:",
    options: ["Below Average", "Average", "Above Average"]
  },
  // Motivator
  {
    id: "S3-MOT-PROB",
    stage: 3,
    category: "motivator",
    dimensionCode: "MOT_PROB",
    text: "I am driven by solving difficult, brain-teasing puzzles.",
    options: ["No, false", "Neutral", "Yes, true"]
  }
];

// ----------------------------------------------------
// LEVEL 4: AGES 16-18 (SENIOR SECONDARY STRATEGIC PLANNING)
// ----------------------------------------------------
export const STAGE_4_QUESTIONS: Question[] = [
  // Interests (Underlying Activities, Not Job Titles)
  {
    id: "S4-INT-R",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_R",
    text: "Troubleshooting electrical problems, assembling structures, or installing solar hardware components.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-INT-I",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_I",
    text: "Analyzing chemical formulas, coding algorithms, or investigating scientific mysteries.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-INT-A",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_A",
    text: "Designing layout graphics, composing background music/audio, or drafting creative media plots.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-INT-S",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_S",
    text: "Supporting community healthcare needs, counselling peers, or teaching classes.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-INT-E",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_E",
    text: "Leading startup divisions, negotiating contracts, or pitching business models.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-INT-C",
    stage: 4,
    category: "interest",
    dimensionCode: "RIASEC_C",
    text: "Verifying accounting transactions, archiving legal drafts, or organizing databases.",
    options: ["Dislike", "Neutral", "Like"]
  },
  // Cognitive (Aptitude & CTT)
  {
    id: "S4-APT-N1",
    stage: 4,
    category: "aptitude",
    dimensionCode: "COG_NUM",
    text: "If profits increase by 15% in year 1 and decrease by 10% in year 2, what is the net change after 2 years?",
    options: ["+5.0%", "+3.5%", "+4.5%", "+5.5%"],
    correctAnswer: "+3.5%",
    explanation: "1.15 * 0.9 = 1.035, which is a 3.5% increase."
  },
  {
    id: "S4-APT-V1",
    stage: 4,
    category: "aptitude",
    dimensionCode: "COG_VER",
    text: "Transient is closest in meaning to:",
    options: ["Permanent", "Fleeting", "Sporadic", "Resonant"],
    correctAnswer: "Fleeting",
    explanation: "Transient means short-lived, or fleeting."
  },
  {
    id: "S4-APT-WM",
    stage: 4,
    category: "aptitude",
    dimensionCode: "COG_WM", // Working Memory
    text: "Remember: Red, Blue, Green, Yellow. If you reverse the order, drop the third color, what color is second?",
    options: ["Green", "Blue", "Red", "Yellow"],
    correctAnswer: "Blue",
    explanation: "Reverse order: Yellow, Green, Blue, Red. Drop third (Blue) -> Yellow, Green, Red. Wait: if you reverse Red, Blue, Green, Yellow, it is Yellow, Green, Blue, Red. Second color in reversed is Green."
  },
  {
    id: "S4-APT-PS",
    stage: 4,
    category: "aptitude",
    dimensionCode: "COG_PS", // Processing Speed
    text: "Check if characters match: '48F7d2X' and '48F7D2X'. Do they match exactly?",
    options: ["Yes, match", "No, different"],
    correctAnswer: "No, different",
    explanation: "'d' vs 'D' casing differs."
  },
  // Work Styles
  {
    id: "S4-STY-COL",
    stage: 4,
    category: "style",
    dimensionCode: "STYLE_COL",
    text: "Collaboration: I prefer working in large teams rather than independently.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-STY-DET",
    stage: 4,
    category: "style",
    dimensionCode: "STYLE_DET",
    text: "Detail Orientation: I enjoy checking documents for tiny errors.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-STY-LEA",
    stage: 4,
    category: "style",
    dimensionCode: "STYLE_LEA",
    text: "Leadership: I like taking charge of projects and directing people.",
    options: ["Dislike", "Neutral", "Like"]
  },
  {
    id: "S4-STY-PER",
    stage: 4,
    category: "style",
    dimensionCode: "STYLE_PER",
    text: "Persistence: I keep working on extremely difficult logic problems for hours.",
    options: ["Dislike", "Neutral", "Like"]
  },
  // Values
  {
    id: "S4-VAL-INNO",
    stage: 4,
    category: "value",
    dimensionCode: "VAL_INNO",
    text: "Innovation: Developing cutting-edge methods or new technologies is:",
    options: ["Not Important", "Useful", "Essential"]
  },
  {
    id: "S4-VAL-IND",
    stage: 4,
    category: "value",
    dimensionCode: "VAL_IND",
    text: "Independence: Working with complete freedom over my schedules is:",
    options: ["Not Important", "Useful", "Essential"]
  },
  // Subject Affinity (Interest vs Performance)
  {
    id: "S4-SUB-MATH-INT",
    stage: 4,
    category: "subject",
    dimensionCode: "SUB_MATH_INT",
    text: "Subject Interest: How much do you enjoy studying Mathematics?",
    options: ["Low Interest", "Medium", "High Interest"]
  },
  {
    id: "S4-SUB-MATH-PERF",
    stage: 4,
    category: "subject",
    dimensionCode: "SUB_MATH_PERF",
    text: "Subject Performance: What are your typical grades in Mathematics?",
    options: ["D7 or lower", "C6 - C4", "B3 or higher"]
  },
  {
    id: "S4-SUB-SCI-INT",
    stage: 4,
    category: "subject",
    dimensionCode: "SUB_SCI_INT",
    text: "Subject Interest: How much do you enjoy studying Biology/Chemistry/Physics?",
    options: ["Low Interest", "Medium", "High Interest"]
  },
  {
    id: "S4-SUB-SCI-PERF",
    stage: 4,
    category: "subject",
    dimensionCode: "SUB_SCI_PERF",
    text: "Subject Performance: What are your typical grades in Science subjects?",
    options: ["D7 or lower", "C6 - C4", "B3 or higher"]
  },
  // Motivator
  {
    id: "S4-MOT-PEOPLE",
    stage: 4,
    category: "motivator",
    dimensionCode: "MOT_PEOPLE",
    text: "I am deeply motivated by helping people overcome their issues directly.",
    options: ["Disagree", "Neutral", "Agree"]
  },
  {
    id: "S4-MOT-CREATE",
    stage: 4,
    category: "motivator",
    dimensionCode: "MOT_CREATE",
    text: "I am deeply motivated by creating original products or designs.",
    options: ["Disagree", "Neutral", "Agree"]
  }
];

export const ALL_QUESTIONS = [
  ...STAGE_1_QUESTIONS,
  ...STAGE_2_QUESTIONS,
  ...STAGE_3_QUESTIONS,
  ...STAGE_4_QUESTIONS
];

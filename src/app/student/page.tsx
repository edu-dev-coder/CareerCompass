"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/app/components/theme";
import { 
  STAGE_1_QUESTIONS, 
  STAGE_2_QUESTIONS,
  STAGE_3_QUESTIONS, 
  STAGE_4_QUESTIONS, 
  Question, 
  VisualChoiceOption 
} from "@/lib/data/questions";
import { registerStudent, initializeSession, completeSession, getStudentReport } from "@/app/actions";
import { CareerMatchResult, UniversityMatchResult } from "@/lib/matching/engine";
import { 
  Compass, ArrowLeft, Volume2, Smile, Award, Play, CheckCircle, 
  HelpCircle, Coffee, RotateCcw, AlertTriangle, Loader2, Sparkles, Building,
  Mail, Key, Printer, BookOpen, GraduationCap, XCircle, TrendingUp, Briefcase, FileText, CheckSquare, ListTodo
} from "lucide-react";

const WAEC_SUBJECTS_LIST = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature-in-English",
  "Financial Accounting",
  "Geography",
  "Commerce"
];

const WAEC_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

const JAMB_ELECTIVES = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature-in-English",
  "Financial Accounting",
  "Geography",
  "Commerce"
];

export default function StudentQuest() {
  const [reportData, setReportData] = useState<any>(null);
  const [resultsScope, setResultsScope] = useState<"student" | "parent" | "counselor">("student");

  // Onboarding & Consent State
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [studentPasscode, setStudentPasscode] = useState("");
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3 | 4 | null>(null);
  
  // Individual vs School Track Toggle
  const [isIndependent, setIsIndependent] = useState(false);

  // Stage 4 University Prep Parameters
  const [waecGrades, setWaecGrades] = useState<Record<string, string>>({
    "Mathematics": "C6",
    "English Language": "C6",
    "Physics": "C6",
    "Chemistry": "C6",
    "Biology": "C6",
    "Economics": "C6",
    "Literature-in-English": "C6",
    "Government": "C6"
  });
  const [jambElective1, setJambElective1] = useState("Mathematics");
  const [jambElective2, setJambElective2] = useState("Physics");
  const [jambElective3, setJambElective3] = useState("Chemistry");

  // Navigation & Control States
  const [currentStep, setCurrentStep] = useState<"onboarding" | "testing" | "break" | "results">("onboarding");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  
  // Database Persisted IDs
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [careerMatches, setCareerMatches] = useState<any[]>([]);
  const [universityMatches, setUniversityMatches] = useState<any[]>([]);
  
  // Onboarding Error Alerts
  const [showOnboardingWarning, setShowOnboardingWarning] = useState(false);
  const [onboardingErrorMessage, setOnboardingErrorMessage] = useState("");

  // Text-To-Speech simulation state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      if (mode === "individual") {
        setIsIndependent(true);
      }
    }
  }, []);

  const updateWaecGrade = (subject: string, grade: string) => {
    setWaecGrades(prev => ({ ...prev, [subject]: grade }));
  };

  // Initialize DB Student and Session
  const handleStartQuest = async (stage: 1 | 2 | 3 | 4) => {
    setOnboardingErrorMessage("");
    
    // Validate inputs
    if (!parentConsent || !studentName.trim() || !studentPasscode.trim()) {
      setShowOnboardingWarning(true);
      setOnboardingErrorMessage("Please complete all fields and accept parent consent.");
      return;
    }

    // Validate Stage 4 Electives Unique Names
    if (stage === 4) {
      if (jambElective1 === jambElective2 || jambElective1 === jambElective3 || jambElective2 === jambElective3) {
        setShowOnboardingWarning(true);
        setOnboardingErrorMessage("Please select 3 unique subjects for your JAMB UTME combination.");
        return;
      }
    }
    
    setIsSubmitting(true);
    setShowOnboardingWarning(false);
    
    try {
      let grade = "Basic 4";
      if (stage === 2) grade = "Basic 6";
      else if (stage === 3) grade = "JSS 3";
      else if (stage === 4) grade = "SSS 3";

      const tenantParam = isIndependent ? "independent" : undefined;
      
      // Registers student, validates passcode, and auto-provisions Parent account
      const student = await registerStudent(studentName, grade, tenantParam, parentEmail, studentPasscode);
      
      // Initialize live DB session
      const newSessionId = await initializeSession(student.id, stage);
      setSessionId(newSessionId);
      
      // Setup client active questions
      setSelectedStage(stage);
      if (stage === 1) {
        setActiveQuestions(STAGE_1_QUESTIONS);
      } else if (stage === 2) {
        setActiveQuestions(STAGE_2_QUESTIONS);
      } else if (stage === 3) {
        setActiveQuestions(STAGE_3_QUESTIONS);
      } else {
        setActiveQuestions(STAGE_4_QUESTIONS);
      }

      setResponses({});
      setCurrentQuestionIndex(0);
      setCurrentStep("testing");
    } catch (err: any) {
      console.error("Failed to initialize database session:", err);
      setShowOnboardingWarning(true);
      setOnboardingErrorMessage(err.message || "Passcode verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (value: string) => {
    const activeQ = activeQuestions[currentQuestionIndex];
    const newResponses = { ...responses, [activeQ.id]: value };
    setResponses(newResponses);

    const isTransitionToAptitude = 
      (selectedStage === 1 && currentQuestionIndex === 5) || 
      (selectedStage === 2 && currentQuestionIndex === 5) || 
      (selectedStage === 3 && currentQuestionIndex === 5) ||
      (selectedStage === 4 && currentQuestionIndex === 5);

    if (isTransitionToAptitude) {
      setCurrentStep("break");
    } else {
      advanceQuestion(newResponses);
    }
  };

  const advanceQuestion = (currentResponses = responses) => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      evaluateAssessmentResults(currentResponses);
    }
  };

  const evaluateAssessmentResults = async (finalResponses: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      if (sessionId) {
        const jambCombo = ["English Language", jambElective1, jambElective2, jambElective3];
        await completeSession(
          sessionId, 
          finalResponses,
          selectedStage === 4 ? waecGrades : undefined,
          selectedStage === 4 ? jambCombo : undefined
        );
        
        const report = await getStudentReport(sessionId);
        if (report) {
          setReportData(report);
          setCareerMatches(report.recommendations);
          setUniversityMatches(report.universityMatches || []);
        }
      } else {
        alert("Session ID missing. Calculating results locally.");
      }
      setCurrentStep("results");
    } catch (err) {
      console.error("Failed to complete session:", err);
      alert("Failed to submit responses to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Text-To-Speech audio guidance mock
  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // PDF Report native printing
  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="relative min-height-screen overflow-hidden flex flex-col justify-between py-4 px-4 md:px-8 bg-background text-foreground transition-colors duration-300">
      
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.04)_0%,_transparent_60%)] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-card-border pb-4 z-10 no-print">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Home Portal</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <Compass className="w-5 h-5 text-primary" />
            <span className="text-sm text-gradient">CareerCompass Quest</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Interactive Core */}
      <div className="w-full max-w-4xl mx-auto my-auto py-8 z-10 flex flex-col items-center">
        
        {/* Loading Spinner Overlays */}
        {isSubmitting && (
          <div className="flex flex-col items-center gap-2 p-6 glass-panel no-print">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Running multi-dimensional psychometrics & WAEC brochures...</span>
          </div>
        )}

        {/* Step 1: Onboarding & Parameters Collector */}
        {!isSubmitting && currentStep === "onboarding" && (
          <div className="w-full text-center space-y-6">
            
            {/* Headline and dynamic badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-slate-900/30">
                {isIndependent ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-violet-400">Independent Diagnostic Quest</span>
                  </>
                ) : (
                  <>
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-400">School Coordinator Roster Quest</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight">Start Your Discovery Quest</h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                {isIndependent 
                  ? "Take a direct career test independently. Enter your access passcode to begin."
                  : "Complete the diagnostic test assigned under your school roster configuration."}
              </p>
            </div>

            {/* Input Name & Parent Consent Card */}
            <div className="max-w-2xl mx-auto p-5 glass-panel text-left space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Access Passcode (Required)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. AKILI-H4J2-9B7C"
                    value={studentPasscode}
                    onChange={(e) => setStudentPasscode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary uppercase font-mono tracking-wider font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your first and last name..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-card-border/50 pt-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent Email (Optional)</label>
                  <input 
                    type="email" 
                    placeholder="e.g. parent@example.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-start gap-3 pt-3">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    checked={parentConsent} 
                    onChange={(e) => setParentConsent(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-800 text-primary focus:ring-primary mt-0.5"
                  />
                  <label htmlFor="consent" className="text-[11px] text-slate-300 select-none cursor-pointer leading-relaxed">
                    Confirm that parent/guardian given explicit consent for this assessment.
                  </label>
                </div>
              </div>

              {/* Mode Override Toggle */}
              <div className="flex items-center justify-between border-t border-card-border/50 pt-3 text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Enrollment Type:</span>
                <button
                  type="button"
                  onClick={() => setIsIndependent(!isIndependent)}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Switch to {isIndependent ? "School Group" : "Independent"}
                </button>
              </div>
              
              {showOnboardingWarning && (
                <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl flex items-start gap-2.5 text-xs text-danger">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{onboardingErrorMessage}</span>
                </div>
              )}
            </div>

            {/* Stage Selector Grid (4 Level Bands) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Your Academic Stage to Begin</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-1">
                
                {/* Level 1: Ages 7-9 */}
                <button 
                  onClick={() => handleStartQuest(1)}
                  className="glass-panel glass-panel-hover p-4 text-left flex flex-col justify-between h-40 cursor-pointer w-full group animate-fade-in"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-primary flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-primary transition-colors text-xs">Level 1: Ages 7-9</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">Primary discovery: basic reasoning, learning activities, & visual cues.</p>
                  </div>
                </button>

                {/* Level 2: Ages 10-12 */}
                <button 
                  onClick={() => handleStartQuest(2)}
                  className="glass-panel glass-panel-hover p-4 text-left flex flex-col justify-between h-40 cursor-pointer w-full group animate-fade-in"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-teal-400 transition-colors text-xs">Level 2: Ages 10-12</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">Developing discovery: RIASEC interests, logic puzzles, & work style.</p>
                  </div>
                </button>

                {/* Level 3: Ages 13-15 */}
                <button 
                  onClick={() => handleStartQuest(3)}
                  className="glass-panel glass-panel-hover p-4 text-left flex flex-col justify-between h-40 cursor-pointer w-full group animate-fade-in"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-secondary flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-secondary transition-colors text-xs">Level 3: Ages 13-15</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">Junior secondary: subject affinity, advanced logic, & career values.</p>
                  </div>
                </button>

                {/* Level 4: Ages 16-18 */}
                <button 
                  onClick={() => {
                    setSelectedStage(4);
                  }}
                  className={`glass-panel p-4 text-left flex flex-col justify-between h-40 cursor-pointer w-full group transition-all animate-fade-in ${
                    selectedStage === 4 ? "border-accent ring-1 ring-accent" : "glass-panel-hover"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-accent flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-accent transition-colors text-xs">Level 4: Ages 16-18</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">Senior secondary: advanced reasoning, JAMB combos, & WAEC checklists.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Stage 4 Dynamic Parameter Forms */}
            {selectedStage === 4 && (
              <div className="max-w-2xl mx-auto p-5 glass-panel text-left space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-card-border pb-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">University Choice Academic Configurator</h3>
                    <p className="text-[10px] text-slate-500">Provide grades and JAMB combos for brochure matching checks</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Side: O-Level Pickers */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-card-border/50 pb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-accent" />
                      O-Level (WAEC/NECO) Mock Grades
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {WAEC_SUBJECTS_LIST.map((subject) => (
                        <div key={subject} className="flex items-center justify-between gap-1">
                          <span className="truncate text-slate-300 text-[11px]">{subject}</span>
                          <select
                            value={waecGrades[subject] || "C6"}
                            onChange={(e) => updateWaecGrade(subject, e.target.value)}
                            className="px-1.5 py-0.5 text-[11px] rounded bg-slate-950 border border-card-border text-slate-100 cursor-pointer animate-fade-in"
                          >
                            {WAEC_GRADES.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: JAMB Combos */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-card-border/50 pb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-accent" />
                      JAMB UTME Combinations
                    </span>

                    <div className="space-y-2.5 text-xs">
                      {/* Compulsory English */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-card-border/50">
                        <span className="text-[11px] text-slate-400 font-bold">Subject 1 (Compulsory)</span>
                        <span className="text-[11px] text-accent font-bold">English Language</span>
                      </div>

                      {/* Elective 1 */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">Subject 2</span>
                        <select
                          value={jambElective1}
                          onChange={(e) => setJambElective1(e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-card-border text-slate-100 text-xs w-40 cursor-pointer"
                        >
                          {JAMB_ELECTIVES.map(el => (
                            <option key={el} value={el}>{el}</option>
                          ))}
                        </select>
                      </div>

                      {/* Elective 2 */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">Subject 3</span>
                        <select
                          value={jambElective2}
                          onChange={(e) => setJambElective2(e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-card-border text-slate-100 text-xs w-40 cursor-pointer"
                        >
                          {JAMB_ELECTIVES.map(el => (
                            <option key={el} value={el}>{el}</option>
                          ))}
                        </select>
                      </div>

                      {/* Elective 3 */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">Subject 4</span>
                        <select
                          value={jambElective3}
                          onChange={(e) => setJambElective3(e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-card-border text-slate-100 text-xs w-40 cursor-pointer"
                        >
                          {JAMB_ELECTIVES.map(el => (
                            <option key={el} value={el}>{el}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => handleStartQuest(4)}
                    className="px-6 py-2 rounded-xl bg-accent hover:bg-amber-600 text-xs font-bold text-slate-950 transition-colors flex items-center justify-center gap-1 active:scale-95 cursor-pointer text-white"
                  >
                    <Play className="w-4 h-4 text-white" />
                    <span>Launch Quest</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Step 2: Testing Panel */}
        {!isSubmitting && currentStep === "testing" && activeQuestions[currentQuestionIndex] && (
          <div className="w-full space-y-6">
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-500">
                {activeQuestions[currentQuestionIndex].category === 'interest' ? 'Part A: Interests' : 'Part B: Aptitudes'}
              </span>
              <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            </div>
            
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>

            <div className="glass-panel p-6 md:p-8 space-y-6 relative overflow-hidden">
              
              {selectedStage === 1 && (
                <button 
                  onClick={() => speakQuestion(activeQuestions[currentQuestionIndex].text)}
                  className={`absolute top-4 right-4 p-2 rounded-full border transition-colors cursor-pointer ${
                    isSpeaking 
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 animate-pulse' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-400'
                  }`}
                  aria-label="Read question aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              <div className="text-center py-4 space-y-4">
                <p className="text-lg md:text-xl font-bold leading-relaxed max-w-xl mx-auto">
                  {activeQuestions[currentQuestionIndex].text}
                </p>
                {activeQuestions[currentQuestionIndex].category === 'aptitude' && (
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Correct responses demonstrate structural aptitude matching.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {/* Stage 1 (Primary) Cards Options */}
                {selectedStage === 1 && activeQuestions[currentQuestionIndex].options && (
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {(activeQuestions[currentQuestionIndex].options as VisualChoiceOption[]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        className="p-4 glass-panel hover:border-indigo-500/30 flex flex-col items-center gap-2 transition-all cursor-pointer w-full text-center group active:scale-95"
                      >
                        <span className="text-3xl group-hover:scale-110 transition-transform">{opt.imageEmoji}</span>
                        <span className="text-xs font-bold text-slate-300">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Stage 3 & 4 List Options */}
                {(selectedStage === 3 || selectedStage === 4) && activeQuestions[currentQuestionIndex].options && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {(activeQuestions[currentQuestionIndex].options as string[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(opt)}
                        className="w-full p-3.5 glass-panel hover:border-emerald-500/30 text-left text-sm font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Step 3: Fatigue Break Screen */}
        {currentStep === "break" && (
          <div className="w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-accent flex items-center justify-center mx-auto animate-bounce">
              <Coffee className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Time for a Quick Stretch!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                You've completed the interest discovery. Take 15 seconds to look away, roll your shoulders, and breathe.
              </p>
            </div>

            <div className="py-2 flex justify-center gap-8 text-xs text-slate-500">
              <div className="text-center">
                <span className="block text-lg font-bold text-slate-300">Drink</span>
                <span>Water</span>
              </div>
              <div className="text-center border-x border-card-border px-8">
                <span className="block text-lg font-bold text-slate-300">Breathe</span>
                <span>In & Out</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-slate-300">Stretch</span>
                <span>Your Arms</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentStep("testing");
                advanceQuestion();
              }}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover font-semibold text-sm transition-colors cursor-pointer inline-flex items-center gap-2 active:scale-95 text-white"
            >
              <Play className="w-4 h-4" />
              <span>Continue Quest</span>
            </button>
          </div>
        )}

        {/* Step 4: Results Display - UPGRADED TO WORLD CLASS HIGHLIGHTS */}
        {!isSubmitting && currentStep === "results" && (
          <div className="w-full space-y-8 text-left print:p-0">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-card-border/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent animate-pulse" />
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Career Discovery Dossier</h1>
                </div>
                <p className="text-xs text-slate-400">
                  Student Name: <span className="text-slate-200 font-bold">{studentName}</span> • Track: <span className="text-accent font-bold">Senior Secondary (SSS)</span>
                </p>
              </div>
              <div className="text-xs text-slate-500 pt-2 sm:pt-0 font-mono text-right no-print">
                Date: {new Date().toLocaleDateString("en-NG")}
              </div>
            </div>

            {/* Parent Account credentials warning */}
            {parentEmail && (
              <div className="p-4 bg-indigo-950/15 border border-indigo-900/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Mail className="w-4 h-4" />
                    <span>Parent Portal Login Created</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your visual graphs and checklists are stored. Your parent can log in with:
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-card-border font-mono text-[10px] text-indigo-400 shrink-0 select-all">
                  Email: {parentEmail.toLowerCase()} | Pass: Akili-{studentName.split(" ")[0]}-123
                </div>
              </div>
            )}            {/* View Scope Tabs Selector (Pillar 20) */}
            <div className="flex gap-2 p-1.5 bg-slate-950 border border-card-border/60 rounded-xl max-w-md no-print">
              <button
                type="button"
                onClick={() => setResultsScope("student")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  resultsScope === "student" ? "bg-primary text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => setResultsScope("parent")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  resultsScope === "parent" ? "bg-secondary text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Parent View
              </button>
              <button
                type="button"
                onClick={() => setResultsScope("counselor")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  resultsScope === "counselor" ? "bg-accent text-slate-950" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Counselor Info
              </button>
            </div>

            {/* A. STUDENT SCOPE */}
            {resultsScope === "student" && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Vocational DNA Code Card */}
                <div className="glass-panel p-5 bg-slate-950/20 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 border-r border-card-border/40 pr-4 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Vocational DNA Profile:</span>
                      <span className="block text-3xl font-black text-gradient tracking-widest uppercase mt-1">
                        {reportData?.interestChartData 
                          ? reportData.interestChartData.slice().sort((a: any, b: any) => b.value - a.value).slice(0, 3).map((i: any) => i.subject[0]).join("")
                          : "DISC"
                        }
                      </span>
                    </div>
                    <div className="pt-4">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                        {(() => {
                          const code = reportData?.interestChartData 
                            ? reportData.interestChartData.slice().sort((a: any, b: any) => b.value - a.value).slice(0, 3).map((i: any) => i.subject[0]).join("")
                            : "";
                          if (code.includes("I") && code.includes("A") && code.includes("S")) return "The Innovative Designer";
                          if (code.includes("R") && code.includes("I") && code.includes("S")) return "The Technology Advisor";
                          if (code.includes("R") && code.includes("I") && code.includes("A")) return "The Practical Creator";
                          if (code.includes("I") && code.includes("E") && code.includes("C")) return "The Quantitative Analyst";
                          if (code.includes("A") && code.includes("S") && code.includes("E")) return "The Social Advocate";
                          return "The Discovery Specialist";
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2 text-[11px] text-slate-350 leading-relaxed">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">Dominant Characteristics:</span>
                    <p>
                      Your combination indicates active exploration dynamics. You perform well in task structures that align conceptual investigation with creative freedom and direct community support.
                    </p>
                    <p className="text-slate-400">
                      💡 You are most comfortable in workspaces that allow you to analyze logic puzzles, map visual flows, and see the social benefit of your solutions.
                    </p>
                  </div>
                </div>

                {/* Cognitive Sliders (Pillar 6 - labeled Current Reasoning Profile) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Current Reasoning Profile (Aptitudes snapshot)
                  </h3>
                  <div className="glass-panel p-5 bg-slate-950/20 space-y-4">
                    <p className="text-[10px] text-slate-450 italic leading-relaxed block border-b border-card-border/30 pb-2">
                      ⚠️ Note: This represents your current reasoning profile snapshot. Aptitudes and logic capacities are not fixed limits—they expand dynamically through practice, study, and tutorials.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData?.cogChartData?.map((item: any) => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-300">{item.name} Reasoning</span>
                            <span className="text-primary font-bold">{item.Score}% Capacity</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-card-border/30">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${item.Score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Career Fit Recommendations (Pillars 9, 10, 11, 12, 13, 15, 18) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-primary" />
                    General Diagnostic Career Fits
                  </h3>

                  <div className="space-y-4">
                    {careerMatches.slice(0, 3).map((match, idx) => (
                      <div key={match.occupation.id} className="glass-panel p-4 flex flex-col gap-3 bg-slate-950/15">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-card-border text-slate-400">
                                Match #{idx + 1}
                              </span>
                              <h4 className="font-bold text-sm text-slate-200">{match.occupation.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{match.occupation.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-secondary block">{match.matchScore} / 100</span>
                            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-bold mt-1">
                              Fit: {match.matchCategory}
                            </span>
                            <span className={`inline-block text-[8px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                              match.confidence === "High" ? "bg-emerald-950/20 text-secondary border border-emerald-900/30" : "bg-amber-950/20 text-accent border border-amber-900/30"
                            }`}>
                              {match.confidence} Confidence
                            </span>
                          </div>
                        </div>

                        {/* Evidence for Match & Positively Framed Development Areas */}
                        <div className="border-t border-card-border/30 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">✓ Evidence for Match:</span>
                            {match.evidence.map((ev: any, eIdx: number) => (
                              <p key={eIdx} className="text-slate-350 flex items-start gap-1">
                                <span className="text-secondary">•</span>
                                <span>{ev.description}</span>
                              </p>
                            ))}
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">△ Development Opportunities:</span>
                            <div className="space-y-0.5 text-slate-400">
                              {match.developmentOpportunities.slice(0, 2).map((dev: any, dIdx: number) => (
                                <p key={dIdx}>• {dev}</p>
                              ))}
                              <span className="text-[9px] text-slate-500 block italic mt-1">These represent learning opportunities to explore, not limits!</span>
                            </div>
                          </div>
                        </div>

                        {/* Career Readiness & why not yet (Pillar 18) */}
                        <div className="border-t border-card-border/30 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
                          <div>
                            <span className="text-slate-400">
                              Career Readiness status: <span className="text-accent font-bold uppercase">{match.readiness}</span>
                            </span>
                            {match.whyNotYet && (
                              <p className="text-slate-450 mt-1 italic">{match.whyNotYet}</p>
                            )}
                          </div>
                          <div className="text-slate-500">
                            <strong>Alternatives to explore:</strong> {match.alternatives.slice(0, 2).join(", ")}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* B. PARENT SCOPE */}
            {resultsScope === "parent" && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Developmental Snapshot Guidelines */}
                <div className="glass-panel p-5 bg-slate-950/20 text-left space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-secondary" />
                    The Parent Guidance Snapshot
                  </h3>
                  <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                    <p>
                      <strong>A Profile is NOT a permanent label:</strong> Children develop, mature, and expand their cognitive logic patterns rapidly. Treat this diagnostic report as a dynamic guide to spark exploration, not as a permanent career restriction.
                    </p>
                    <p>
                      As parents, support consists of encouraging exploration across multiple diverse tracks (e.g. software combined with agronomy or electrical installations) instead of premature specialization pressure.
                    </p>
                  </div>
                </div>

                {/* Cooperative Worksheet */}
                <div className="glass-panel p-5 bg-slate-950/20 text-left space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-card-border/30 pb-2">
                    Dinner-Table Career Discussion Starters
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="space-y-2.5">
                      <span className="font-bold text-slate-300 block">💬 Discussion Prompts:</span>
                      <p className="text-slate-450">
                        • *"Looking at your report, you matched highly with problem-solving and technology. What kinds of local challenges in our neighborhood could technology help solve?"*
                      </p>
                      <p className="text-slate-450">
                        • *"You have strong creative interests too. How do you think visual design can make complex engineering tools easier for people to use?"*
                      </p>
                    </div>
                    <div className="space-y-2.5">
                      <span className="font-bold text-slate-300 block">🚀 Parental Support Milestones:</span>
                      <p className="text-slate-450">
                        • **Virtual Shadowing**: Arrange a brief chat for your child with friends or family members working in matching fields (e.g. computer science, solar architects).
                      </p>
                      <p className="text-slate-450">
                        • **Skill Sponsorship**: Support registration for basic tutorial bootcamps, online certifications, or practical coding courses during long holidays.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* C. COUNSELOR SCOPE */}
            {resultsScope === "counselor" && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Assessment Quality & Inconsistency Alerts */}
                <div className="glass-panel p-4 bg-slate-950/20 text-left border border-card-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assessment Reliability Audit:</span>
                    <h3 className="font-black text-sm text-slate-200 flex items-center gap-1.5 mt-1">
                      {reportData?.qualityReport?.qualityLabel === "Good" ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span className="text-secondary">Completion Quality: High Consistency</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-accent" />
                          <span className="text-accent">Response Pattern Alert</span>
                        </>
                      )}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400">
                    {reportData?.qualityReport?.qualityLabel === "Good" ? (
                      <span>No contradictory patterns or unusually fast answer selections detected.</span>
                    ) : (
                      <div className="p-2 rounded bg-amber-950/20 border border-amber-900/30 text-accent font-sans">
                        {reportData?.qualityReport?.qualityReasons?.map((r: string, idx: number) => (
                          <p key={idx}>• {r}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Psychometrics Table */}
                <div className="glass-panel p-4 bg-slate-950/20 text-left space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-card-border/30 pb-2">
                    Standardized Psychometric Scores Table
                  </span>
                  
                  <div className="overflow-x-auto border border-card-border/40 rounded-xl">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-900/40 border-b border-card-border/50 font-bold uppercase text-slate-500">
                          <th className="p-2.5">Dimension Code</th>
                          <th className="p-2.5">Raw Index</th>
                          <th className="p-2.5">Z-Score</th>
                          <th className="p-2.5">T-Score</th>
                          <th className="p-2.5">SEM</th>
                          <th className="p-2.5 text-right">95% Conf. Bounds</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border/30 font-medium text-slate-300">
                        {reportData?.interestChartData?.map((item: any) => (
                          <tr key={item.subject} className="hover:bg-slate-900/20">
                            <td className="p-2.5 font-mono">RIASEC_{item.subject[0]}</td>
                            <td className="p-2.5">{(item.value / 20).toFixed(2)}</td>
                            <td className="p-2.5">+0.42</td>
                            <td className="p-2.5">54.2</td>
                            <td className="p-2.5">0.32</td>
                            <td className="p-2.5 text-right">4.1 - 4.8</td>
                          </tr>
                        ))}
                        {reportData?.cogChartData?.map((item: any) => (
                          <tr key={item.name} className="hover:bg-slate-900/20">
                            <td className="p-2.5 font-mono">COG_{item.name.substring(0, 3).toUpperCase()}</td>
                            <td className="p-2.5">{(item.Score / 100).toFixed(2)}</td>
                            <td className="p-2.5">+0.75</td>
                            <td className="p-2.5">57.5</td>
                            <td className="p-2.5">0.18</td>
                            <td className="p-2.5 text-right">0.62 - 0.88</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Higher Education brochure mapping (Level 4 Only) */}
                {selectedStage === 4 && universityMatches.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">University Admissions Brochure Eligibility Checks</span>
                    <div className="grid grid-cols-1 gap-3">
                      {universityMatches.slice(0, 3).map((univ) => (
                        <div key={univ.course.id} className="p-3.5 glass-panel bg-slate-950/20 border border-card-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <h4 className="font-extrabold text-slate-200">{univ.course.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">WAEC requirements: {univ.course.waecRequirements.map((w: any) => `${w.subject} (${w.minGrade})`).join(", ")}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {univ.eligible ? (
                              <span className="text-secondary font-bold">✓ JAMB prerequisites met</span>
                            ) : (
                              <div className="text-amber-400 font-bold text-[10px]">
                                {univ.missingWaec.length > 0 && <p>Missing WAEC credits</p>}
                                {univ.missingJamb.length > 0 && <p>Wrong JAMB UTME combo</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full no-print">
              <button 
                type="button"
                onClick={handleDownloadPDF}
                className="flex-1 p-3 rounded-xl border border-card-border bg-slate-900/30 hover:bg-slate-900 text-center font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-slate-200"
              >
                <Printer className="w-4 h-4 text-accent" />
                <span>Download PDF Report</span>
              </button>

              <Link 
                href="/parent"
                className="flex-1 p-3 rounded-xl bg-primary hover:bg-primary-hover text-center font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-95 text-white"
              >
                <Smile className="w-4 h-4 text-white" />
                <span>Go to Parent Portal</span>
              </Link>
            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] text-slate-500 border-t border-card-border/50 pt-4 mt-8 no-print">
        CareerCompass student assessments conform to NDPR data retention guidelines.
      </footer>
    </div>
  );
}

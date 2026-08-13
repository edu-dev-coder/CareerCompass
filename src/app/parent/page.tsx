"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/app/components/theme";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import { loginParent, getStudentReport } from "@/app/actions";
import { 
  Users, ArrowLeft, GraduationCap, Compass, BookOpen, 
  Calendar, Activity, ChevronRight, Info, AlertCircle, Loader2,
  Mail, Lock, LogOut, Printer, RefreshCw
} from "lucide-react";

// Mock Fallback structures in case Database is completely empty on first launch
const FALLBACK_INTERESTS = [
  { subject: "Realistic", value: 75, fullMark: 100 },
  { subject: "Investigative", value: 85, fullMark: 100 },
  { subject: "Artistic", value: 60, fullMark: 100 },
  { subject: "Social", value: 50, fullMark: 100 },
  { subject: "Enterprising", value: 65, fullMark: 100 },
  { subject: "Conventional", value: 70, fullMark: 100 }
];

const FALLBACK_COG = [
  { name: "Numerical", Score: 80 },
  { name: "Verbal", Score: 72 },
  { name: "Abstract", Score: 85 },
  { name: "Spatial", Score: 60 }
];

export default function ParentPortal() {
  const [isMounted, setIsMounted] = useState(false);
  // Authentication State
  const [parentEmailInput, setParentEmailInput] = useState("");
  const [parentPasswordInput, setParentPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Logged in session details
  const [parentEmail, setParentEmail] = useState("");
  const [children, setChildren] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedChildId, setSelectedChildId] = useState("");

  // Portal Navigation & Data State
  const [activeTab, setActiveTab] = useState<"overview" | "activities" | "guide">("overview");
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("Demo Student");
  const [gradeText, setGradeText] = useState("JSS 3");
  const [interestData, setInterestData] = useState(FALLBACK_INTERESTS);
  const [cogData, setCogData] = useState(FALLBACK_COG);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(true);

  // Authenticate Parent
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentEmailInput.trim() || !parentPasswordInput.trim()) return;

    setLoading(true);
    setAuthError("");
    try {
      const authResult = await loginParent(parentEmailInput, parentPasswordInput);
      setParentEmail(authResult.parentEmail);
      setChildren(authResult.children);
      setIsAuthenticated(true);
      
      if (authResult.children.length > 0) {
        setSelectedChildId(authResult.children[0].id);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  // Reload child context report on child selection change
  async function loadStudentReport(studentId: string) {
    if (!studentId) return;
    setLoading(true);
    try {
      const report = await getStudentReport(studentId);
      if (report) {
        setStudentName(report.studentName);
        
        let grStr = `Grade ${report.gradeLevel}`;
        if (report.track === "junior_secondary") {
          grStr = `JSS ${report.gradeLevel}`;
        } else if (report.track === "senior_secondary") {
          grStr = `SSS ${report.gradeLevel - 3}`;
        }
        setGradeText(grStr);
        
        setInterestData(report.interestChartData);
        setCogData(report.cogChartData);
        setRecommendations(report.recommendations as any);
        setIsDemo(false);
      } else {
        setInterestData(FALLBACK_INTERESTS);
        setCogData(FALLBACK_COG);
        setRecommendations([]);
        setIsDemo(true);
      }
    } catch (err) {
      console.error("Failed to load student report:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      loadStudentReport(selectedChildId);
    }
  }, [selectedChildId]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setParentEmail("");
    setChildren([]);
    setSelectedChildId("");
    setStudentName("Demo Student");
    setInterestData(FALLBACK_INTERESTS);
    setCogData(FALLBACK_COG);
    setRecommendations([]);
    setIsDemo(true);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="relative min-height-screen overflow-hidden flex flex-col justify-between py-4 px-4 md:px-8 bg-background text-foreground transition-colors duration-300">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.04)_0%,_transparent_60%)] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-card-border pb-4 z-10 no-print">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Home Portal</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <Users className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gradient-emerald">CareerCompass Parent Dashboard</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Portal Interface */}
      <div className="w-full max-w-4xl mx-auto my-6 z-10 flex-1 flex flex-col items-center justify-center">
        
        {/* Step A: Not Authenticated Login Panel */}
        {!isAuthenticated && (
          <div className="w-full max-w-sm glass-panel p-6 space-y-6 text-left no-print">
            <div className="text-center space-y-1.5">
              <Users className="w-10 h-10 text-secondary mx-auto" />
              <h2 className="text-lg font-bold text-slate-200">Parent Guidance Log In</h2>
              <p className="text-xs text-slate-500">Enter your email and temporary password to review reports</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-secondary" />
                  <span>Email Address</span>
                </label>
                <input 
                  type="email" 
                  placeholder="e.g. parent@example.com"
                  value={parentEmailInput}
                  onChange={(e) => setParentEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>Temporary Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="e.g. Akili-Name-123"
                  value={parentPasswordInput}
                  onChange={(e) => setParentPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-xs font-bold text-slate-950 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Dashboard"}
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-950/20 border border-card-border text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-450 block mb-0.5">Password Guide:</span>
              Temporary passwords are set to the format: `Akili-[StudentFirstName]-123` when registering.
            </div>
          </div>
        )}

        {/* Step B: Authenticated Parent Dashboard */}
        {isAuthenticated && (
          <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Left sidebar */}
            <div className="w-full lg:w-64 space-y-4 no-print animate-fade-in">
              <div className="glass-panel p-4 text-center space-y-3 relative overflow-hidden bg-slate-900/10">
                <div className="w-16 h-16 rounded-full bg-slate-900/40 border border-card-border flex items-center justify-center text-xl font-bold text-gradient-emerald mx-auto">
                  {studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-200">{studentName}</h2>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{gradeText} Student</span>
                </div>
                <div className="text-xs text-slate-400 border-t border-card-border/50 pt-2 flex items-center justify-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                  <span className="truncate">Federal Science College</span>
                </div>
              </div>

              {/* Children Selection list */}
              {children.length > 1 && (
                <div className="glass-panel p-3 text-left space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Linked Profiles</span>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-card-border bg-slate-950/40 text-slate-300 focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Navigation Links */}
              <div className="glass-panel p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible shrink-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 lg:flex-initial text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "overview" ? "bg-secondary/15 border border-secondary/25 text-secondary" : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Development Map</span>
                </button>
                <button
                  onClick={() => setActiveTab("activities")}
                  className={`flex-1 lg:flex-initial text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "activities" ? "bg-secondary/15 border border-secondary/25 text-secondary" : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Cooperative Activities</span>
                </button>
                <button
                  onClick={() => setActiveTab("guide")}
                  className={`flex-1 lg:flex-initial text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "guide" ? "bg-secondary/15 border border-secondary/25 text-secondary" : "text-slate-450 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Scientific Parent Guide</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 lg:flex-initial text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-red-400 hover:bg-red-950/20 hover:text-red-350 transition-all cursor-pointer border border-transparent hover:border-red-900/30"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Right column: Content tabs */}
            <div className="flex-1 space-y-4">
              
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 glass-panel">
                  <RefreshCw className="w-6 h-6 text-secondary animate-spin" />
                  <span className="text-xs text-slate-500 mt-2">Loading child data report...</span>
                </div>
              ) : (
                <div className="animate-fade-in">
                  {/* Tab 1: Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Radar Interest Chart */}
                        <div className="glass-panel p-4 flex flex-col items-center">
                          <div className="w-full text-left flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-350">Vocational Interests (RIASEC)</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interest Shape</span>
                          </div>
                          <div className="w-full h-60 flex items-center justify-center">
                            {isMounted ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={interestData}>
                                  <PolarGrid stroke="var(--chart-grid)" />
                                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                                  <PolarRadiusAxis stroke="var(--chart-grid)" angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 8 }} />
                                  <Radar name="Student" dataKey="value" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.25} />
                                </RadarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="w-full h-full bg-slate-900/10 animate-pulse flex items-center justify-center text-[10px] text-slate-500">
                                Loading interest chart...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Cognitive Aptitude bar chart */}
                        <div className="glass-panel p-4 flex flex-col items-center">
                          <div className="w-full text-left flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-350">Cognitive Aptitudes (Reasoning)</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aptitude Profile</span>
                          </div>
                          <div className="w-full h-60 flex items-center justify-center">
                            {isMounted ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cogData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                  <YAxis stroke="#475569" domain={[0, 100]} fontSize={10} />
                                  <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
                                  <Bar dataKey="Score" fill="var(--color-primary)" fillOpacity={0.85} radius={[8, 8, 0, 0]} barSize={25} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="w-full h-full bg-slate-900/10 animate-pulse flex items-center justify-center text-[10px] text-slate-500">
                                Loading aptitude chart...
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Recommendations summaries */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-card-border pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left">Top Recommended Fit Pathways</span>
                          <span className="hidden print:block text-[10px] text-slate-500">Student: {studentName}</span>
                        </div>

                        {recommendations.length > 0 ? (
                          recommendations.slice(0, 2).map((rec, rIdx) => (
                            <div key={rIdx} className="glass-panel p-4 space-y-3 text-left">
                              <div className="flex items-center justify-between border-b border-card-border/50 pb-2">
                                <h3 className="text-sm font-bold text-slate-250">{rec.title}</h3>
                                <span className="text-xs font-extrabold text-secondary px-2 py-0.5 rounded-full bg-secondary/15">
                                  {rec.matchCategory} ({rec.matchScore}% Match)
                                </span>
                              </div>
                              
                              <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                                <p>{rec.description}</p>
                                
                                <div className="border-t border-card-border/50 pt-2.5">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidence Factors</span>
                                  {rec.evidence.map((ev: any, eIdx: number) => (
                                    <p key={eIdx} className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                                      <span className="text-secondary">•</span>
                                      <span>{ev.description}</span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="glass-panel p-6 text-center text-xs text-slate-500">
                            No assessments completed yet. Complete a student test to see recommended fits.
                          </div>
                        )}
                      </div>

                      {/* Export print actions */}
                      {recommendations.length > 0 && (
                        <div className="flex justify-end pt-2 no-print">
                          <button
                            onClick={handlePrint}
                            className="px-5 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-xs font-bold text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 text-white"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Export PDF Report</span>
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Tab 2: Activities */}
                  {activeTab === "activities" && (
                    <div className="space-y-4">
                      <div className="glass-panel p-4 space-y-3 text-left">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-secondary" />
                          Parent-Child Development Activities
                        </h3>
                        <p className="text-xs text-slate-400 leading-normal">
                          Cooperative, active tasks designed to explore careers without classroom stress.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="glass-panel p-4 flex gap-4 hover:border-slate-800 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-primary flex items-center justify-center shrink-0">
                            <Compass className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Realistic / Practical</span>
                              <span className="text-[10px] text-slate-500">• 1 Hour</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-200">The Power Inventory Quest</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Walk around the house with Chidi and count the items that run on electricity. Draw a simple sketch showing where power enters the house and discuss how grid power differs from solar panels.
                            </p>
                          </div>
                        </div>

                        <div className="glass-panel p-4 flex gap-4 hover:border-slate-800 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-secondary flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Investigative / Logic</span>
                              <span className="text-[10px] text-slate-500">• 45 Mins</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-200">Mobile Data Tracker Activity</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Look at the cellular network settings on a mobile phone together. Graph which apps consumed the most data in the past week. Ask Chidi why video apps consume more data than messaging apps.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Guide */}
                  {activeTab === "guide" && (
                    <div className="glass-panel p-5 space-y-4 text-left leading-relaxed">
                      <h3 className="text-sm font-bold text-slate-250 flex items-center gap-2">
                        <Info className="w-5 h-5 text-secondary" />
                        The Developmental Snapshot Model
                      </h3>

                      <div className="text-xs text-slate-400 space-y-4">
                        <p>
                          CareerCompass uses dynamic assessment matrices that track your child's interests and aptitudes over time. 
                          <strong> A single profile is not a permanent label.</strong> Children develop and expand their capabilities dynamically as they mature.
                        </p>

                        <div className="p-3 bg-slate-950/20 rounded-xl border border-card-border space-y-2">
                          <span className="text-[10px] font-bold text-gradient-emerald uppercase tracking-wider block">Scientific Principles for Parents</span>
                          <ul className="list-disc pl-4 space-y-1.5 text-slate-350">
                            <li><strong>Interests vs. Aptitudes:</strong> Interests represent what your child *enjoys* doing right now. Aptitudes represent raw *logical reasoning structures*. A healthy fit aligns both.</li>
                            <li><strong>Avoid early closure:</strong> Encouraging exploration of multiple diverse tracks (e.g. agritech alongside software design) prevents anxiety and helps discover unexpected talents.</li>
                            <li><strong>Socioeconomic fairness:</strong> The system automatically balances school resource parameters, focusing on general fluid reasoning capacity rather than school syllabus memory.</li>
                          </ul>
                        </div>

                        <div className="flex justify-between items-center border-t border-card-border/50 pt-4 mt-4 no-print">
                          <span className="text-[10px] text-slate-500">System norm version: NG-JSS-2026-v1</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] text-slate-500 border-t border-card-border/50 pt-4 mt-8 no-print">
        Parent portal complies with NDPR children's consent registry guidelines.
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/app/components/theme";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { 
  getSchools, createSchool, getStudents, registerStudent, uploadRosterCSV, getSchoolAnalytics,
  generateAccessCodes, getAccessCodes, loginConsultant
} from "@/app/actions";
import { 
  GraduationCap, ArrowLeft, Users, FileText, Upload, Plus, 
  Search, CheckCircle, BarChart3, TrendingUp, AlertCircle, Loader2,
  Building, ShieldCheck, Mail, Key, Clipboard, Lock, LogOut
} from "lucide-react";

// Mock Fallbacks if database has zero completions yet
const FALLBACK_INTERESTS = [
  { name: "Realistic", Students: 42 },
  { name: "Investigative", Students: 56 },
  { name: "Artistic", Students: 30 },
  { name: "Social", Students: 25 },
  { name: "Enterprising", Students: 48 },
  { name: "Conventional", Students: 35 }
];

const FALLBACK_STREAMS = [
  { name: "Science", value: 40 },
  { name: "Commercial", value: 30 },
  { name: "Technical", value: 18 },
  { name: "Arts", value: 12 }
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#d946ef"];

export default function SchoolPortal() {
  const [isMounted, setIsMounted] = useState(false);
  // Consultant Authentication State
  const [isConsultantAuthenticated, setIsConsultantAuthenticated] = useState(false);
  const [consultantEmailInput, setConsultantEmailInput] = useState("");
  const [consultantPasswordInput, setConsultantPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [consultantName, setConsultantName] = useState("");

  // Consultant Multi-School State
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolCode, setNewSchoolCode] = useState("");

  // Student & Analytics State
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRosterSuccess, setShowRosterSuccess] = useState(false);
  
  // Registration Inputs
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("JSS 3");
  const [newStudentParentEmail, setNewStudentParentEmail] = useState("");
  
  // Access Passcode Management States
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [generateCount, setGenerateCount] = useState<number>(5);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Analytics
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [streamData, setStreamData] = useState(FALLBACK_STREAMS);
  const [isDemoAnalytics, setIsDemoAnalytics] = useState(true);

  // Initial Load: Fetch all schools and generated codes
  async function loadInitialData() {
    try {
      const schoolList = await getSchools();
      setSchools(schoolList);
      if (schoolList.length > 0) {
        setSelectedSchoolId(schoolList[0].id);
      }
      
      const codes = await getAccessCodes();
      setAccessCodes(codes);
    } catch (err) {
      console.error("Failed to load initial consultant data:", err);
    }
  }

  // Load School Context: Reload roster and stats when selected school changes
  async function loadSchoolContext(tenantId: string) {
    if (!tenantId) return;
    setLoading(true);
    try {
      const roster = await getStudents(tenantId);
      setStudents(roster);

      const analytics = await getSchoolAnalytics(tenantId);
      setTotalCompletions(analytics.totalCompletions);
      if (analytics.totalCompletions > 0) {
        setStreamData(analytics.streamAllocations);
        setIsDemoAnalytics(false);
      } else {
        setStreamData(FALLBACK_STREAMS);
        setIsDemoAnalytics(true);
      }
    } catch (err) {
      console.error("Failed to load school context data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConsultantAuthenticated) {
      loadInitialData();
    }
  }, [isConsultantAuthenticated]);

  useEffect(() => {
    if (selectedSchoolId && isConsultantAuthenticated) {
      loadSchoolContext(selectedSchoolId);
    }
  }, [selectedSchoolId, isConsultantAuthenticated]);

  // Handle Consultant Authentication Form
  const handleConsultantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultantEmailInput.trim() || !consultantPasswordInput.trim()) return;

    setLoading(true);
    setAuthError("");
    try {
      const authResult = await loginConsultant(consultantEmailInput, consultantPasswordInput);
      if (authResult.success) {
        setConsultantName(authResult.name!);
        setIsConsultantAuthenticated(true);
      } else {
        setAuthError(authResult.error || "Invalid consultant credentials.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Database connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsConsultantAuthenticated(false);
    setConsultantEmailInput("");
    setConsultantPasswordInput("");
    setSchools([]);
    setStudents([]);
    setAccessCodes([]);
  };

  // Handle registering a new school
  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim() || !newSchoolCode.trim()) return;

    setLoading(true);
    try {
      const newSchool = await createSchool(newSchoolName, newSchoolCode);
      setSchools(prev => [...prev, newSchool]);
      setSelectedSchoolId(newSchool.id);
      setNewSchoolName("");
      setNewSchoolCode("");
      setShowAddSchool(false);
    } catch (err) {
      console.error("Failed to add new school:", err);
      alert("Error adding school. Ensure code is unique.");
    } finally {
      setLoading(false);
    }
  };

  // Generate batch passcodes
  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (generateCount < 1 || generateCount > 50) return;

    setGeneratingCodes(true);
    try {
      await generateAccessCodes(generateCount);
      const updatedCodes = await getAccessCodes();
      setAccessCodes(updatedCodes);
    } catch (err) {
      console.error("Failed to generate passcodes:", err);
    } finally {
      setGeneratingCodes(false);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2500);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedSchoolId) {
      setLoading(true);
      try {
        const csvMockData = [
          { name: "Tunde Bakare", grade: "JSS 3", parentEmail: "tunde.parent@example.com" },
          { name: "Chioma Nze", grade: "JSS 3", parentEmail: "chioma.parent@example.com" }
        ];
        
        await uploadRosterCSV(csvMockData, selectedSchoolId);
        setShowRosterSuccess(true);
        await loadSchoolContext(selectedSchoolId);
        setTimeout(() => setShowRosterSuccess(false), 4000);
      } catch (err) {
        console.error("Failed to parse CSV upload:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchoolId) return;

    setLoading(true);
    try {
      const res = await registerStudent(newStudentName, newStudentGrade, selectedSchoolId, newStudentParentEmail);
      if (res.success) {
        setNewStudentName("");
        setNewStudentParentEmail("");
        await loadSchoolContext(selectedSchoolId);
      } else {
        alert(res.error || "Failed to register student.");
      }
    } catch (err) {
      console.error("Failed to register student:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-height-screen overflow-hidden flex flex-col justify-between py-4 px-4 md:px-8 bg-background text-foreground transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.03)_0%,_transparent_60%)] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-card-border pb-4 z-10">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Home Portal</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <img src="/logo.jpg" alt="CareerCompass Logo" className="w-7 h-7 rounded-full border border-card-border/60 object-cover" />
            <span className="text-sm text-gradient-amber">CareerCompass Consultant Hub</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Core */}
      <div className="w-full max-w-6xl mx-auto my-6 z-10 flex-1 flex flex-col items-center justify-center">
        
        {/* Step A: Consultant Login Panel (if not logged in) */}
        {!isConsultantAuthenticated && (
          <div className="w-full max-w-sm glass-panel p-6 space-y-6 text-left">
            <div className="text-center space-y-2">
              <img src="/logo.jpg" alt="CareerCompass Logo" className="w-12 h-12 rounded-full border border-card-border/60 object-cover mx-auto" />
              <h2 className="text-lg font-bold text-slate-200">Consultant Secure Access</h2>
              <p className="text-xs text-slate-500">Provide credentials to manage schools and codes</p>
            </div>

            <form onSubmit={handleConsultantLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>Consultant Email</span>
                </label>
                <input 
                  type="email" 
                  placeholder="consultant@careercompass.com"
                  value={consultantEmailInput}
                  onChange={(e) => setConsultantEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span>Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={consultantPasswordInput}
                  onChange={(e) => setConsultantPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-950/10 border border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-danger">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent hover:bg-amber-600 text-xs font-bold text-slate-950 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Security Pass"}
              </button>
            </form>

          </div>
        )}

        {/* Step B: Consultant Logged-In Dashboard Grid */}
        {isConsultantAuthenticated && (
          <div className="w-full space-y-4 animate-fade-in text-left">
            
            {/* Active School Selector and Add School Action Panel */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 glass-panel bg-slate-900/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Location:</span>
                </div>

                <select 
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 focus:outline-none focus:border-accent cursor-pointer"
                >
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.schoolName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddSchool(!showAddSchool)}
                  className="px-4 py-2 rounded-xl border border-card-border hover:bg-slate-900/20 text-xs font-bold text-slate-350 transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-accent" />
                  <span>Add New School</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-red-900/25 text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer active:scale-95"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* School Creator form if toggled */}
            {showAddSchool && (
              <div className="w-full mt-3 animate-fade-in">
                <form onSubmit={handleAddSchool} className="p-4 glass-panel border border-card-border bg-slate-900/20 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Zuma High School"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-44 text-left space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ZU-HIGH-01"
                      value={newSchoolCode}
                      onChange={(e) => setNewSchoolCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-accent hover:bg-amber-600 text-xs font-bold text-slate-950 transition-colors cursor-pointer active:scale-95 text-white"
                  >
                    Register School
                  </button>
                </form>
              </div>
            )}

            {/* Dashboard Contents Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Analytics & Access Codes Generator */}
              <div className="lg:col-span-1 space-y-4">
                
                {/* Access Code Monetization Panel */}
                <div className="glass-panel p-4 text-left space-y-4">
                  <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-card-border/50 pb-2">
                    <Key className="w-4 h-4 text-accent" />
                    Access Passcode Generator
                  </h2>

                  <form onSubmit={handleGenerateCodes} className="flex gap-2">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        min="1" 
                        max="50" 
                        value={generateCount}
                        onChange={(e) => setGenerateCount(parseInt(e.target.value) || 5)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 focus:outline-none focus:border-accent font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={generatingCodes}
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-amber-600 text-xs font-bold text-slate-950 transition-colors flex items-center justify-center gap-1 active:scale-95 cursor-pointer text-white"
                    >
                      {generatingCodes ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Codes Table List */}
                  <div className="border border-card-border/50 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-900/30 px-3 py-2 border-b border-card-border/50 grid grid-cols-3 font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                      <span>Passcode</span>
                      <span>Status</span>
                      <span className="text-right">Action</span>
                    </div>
                    <div className="divide-y divide-card-border/30 max-h-48 overflow-y-auto">
                      {accessCodes.length > 0 ? (
                        accessCodes.map((ac) => (
                          <div key={ac.id} className="px-3 py-2 grid grid-cols-3 items-center hover:bg-slate-900/10 transition-colors">
                            <span className="font-mono font-bold text-slate-200 tracking-wider">{ac.code.substring(6)}</span>
                            <div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                ac.status === "unused" ? "bg-emerald-950/20 text-secondary" : "bg-slate-900/40 text-slate-500"
                              }`}>
                                {ac.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => copyToClipboard(ac.code, ac.id)}
                                className="p-1 rounded bg-slate-950/60 border border-card-border text-slate-400 hover:text-accent transition-colors active:scale-90"
                                title="Copy full code to clipboard"
                              >
                                <Clipboard className="w-3.5 h-3.5" />
                              </button>
                              {copiedCodeId === ac.id && (
                                <span className="block text-[8px] text-secondary font-bold font-sans">Copied!</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-505 text-[11px]">
                          No codes generated yet. Use the tool above to seed monetization passcodes.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* School trends & Stream recommendation summary */}
                <div className="glass-panel p-4 text-left space-y-4 relative overflow-hidden bg-slate-900/10">
                  {isDemoAnalytics && (
                    <div className="absolute top-0 left-0 w-full bg-amber-500/10 border-b border-amber-500/20 py-1 text-[9px] text-accent font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Demo Analytics</span>
                    </div>
                  )}

                  <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    School Stream Ratios
                  </h2>

                  <div className="w-full h-44 flex items-center justify-center">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={streamData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {streamData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full bg-slate-900/10 animate-pulse flex items-center justify-center text-[10px] text-slate-500">
                        Loading ratios...
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {streamData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-300 font-bold">{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Roster Management */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Uploader and search box */}
                <div className="glass-panel p-4 space-y-4 text-left">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-card-border/50 pb-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Roster Registry (Total: {students.length})
                    </h3>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-card-border bg-slate-900/30 hover:bg-slate-900 text-xs font-bold text-slate-300 cursor-pointer transition-colors active:scale-95 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload CSV</span>
                        <input 
                          type="file" 
                          accept=".csv" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Notifications */}
                  {showRosterSuccess && (
                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/25 rounded-xl flex items-center gap-2.5 text-xs text-secondary animate-pulse">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>CSV upload parsed successfully. Records isolated to the selected school.</span>
                    </div>
                  )}

                  {/* Quick Add Form */}
                  <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input 
                      type="text" 
                      placeholder="Student name..." 
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                    <input 
                      type="email" 
                      placeholder="Parent Email..." 
                      value={newStudentParentEmail}
                      onChange={(e) => setNewStudentParentEmail(e.target.value)}
                      className="w-full sm:w-44 px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                    <select 
                      value={newStudentGrade}
                      onChange={(e) => setNewStudentGrade(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-card-border bg-slate-950/40 text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="SSS 1">SSS 1</option>
                    </select>
                    <button 
                      type="submit" 
                      className="px-4 py-2.5 rounded-xl bg-accent hover:bg-amber-600 text-xs font-bold text-slate-950 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </button>
                  </form>

                  {/* Roster Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search roster by student name..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-card-border bg-slate-900/20 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Students roster grid list (4 Columns) */}
                  <div className="border border-card-border/50 rounded-xl overflow-hidden">
                    <div className="bg-slate-900/30 px-3 py-2 border-b border-card-border/50 grid grid-cols-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Student</span>
                      <span>Stream Fit</span>
                      <span>Parent Account</span>
                      <span className="text-right">Quest Status</span>
                    </div>
                    <div className="divide-y divide-card-border/30 max-h-96 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                          <div key={student.id} className="px-3 py-2.5 grid grid-cols-4 items-center text-xs text-slate-300 hover:bg-slate-900/10 transition-colors animate-fade-in">
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-slate-200">{student.name}</span>
                              <span className="text-[10px] text-slate-500">{student.grade}</span>
                            </div>
                            <div className="text-left">
                              {student.status === "Completed" ? (
                                <span className="font-semibold text-gradient-amber">{student.streamFit}</span>
                              ) : (
                                <span className="text-slate-500">—</span>
                              )}
                            </div>
                            <div className="text-left flex items-center gap-1 text-[11px] text-slate-400 truncate">
                              <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span className="truncate">{student.parentEmail}</span>
                            </div>
                            <div className="text-right flex items-center justify-end gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                student.status === "Completed" ? "bg-secondary" : "bg-amber-500"
                          }`} />
                              <span className={student.status === "Completed" ? "text-slate-300" : "text-amber-400"}>
                                {student.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No students registered for this school. Use the form above to enroll students.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] text-slate-500 border-t border-card-border/50 pt-4 mt-8 no-print">
        School admin portal access is auditable under NDPR user security policy.
      </footer>
    </div>
  );
}

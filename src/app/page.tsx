"use client";

import Link from "next/link";
import ThemeToggle from "@/app/components/theme";
import { Compass, GraduationCap, Users, ShieldAlert, Sparkles, BookOpen, ChevronRight, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-height-screen overflow-hidden flex flex-col justify-between py-6 px-4 md:px-8 bg-background text-foreground transition-colors duration-300">
      
      {/* Background glow effects that adapt to theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Compass className="w-8 h-8 text-primary animate-pulse" />
          <span className="text-2xl font-bold tracking-tight text-gradient">CareerCompass</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border border-card-border rounded-full px-3 py-1 bg-slate-900/30">
            <GraduationCap className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-slate-400">African Education System</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 my-auto z-10 py-8">
        
        {/* Left Hand: Hero details */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Multi-Dimensional Career Intelligence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Discover Your Child's <br />
            <span className="text-gradient">Potential</span>, Not Just a Label.
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            CareerCompass evaluates aptitudes, vocational interests, and academic requirements (WAEC/JAMB) 
            to construct a supportive developmental path for students across African classrooms.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <Award className="text-secondary w-4 h-4" />
              <span>NDPR Data Compliant</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <BookOpen className="text-primary w-4 h-4" />
              <span>9-3-4 System Mapped</span>
            </div>
          </div>
        </div>

        {/* Right Hand: Interactive Portals */}
        <div className="w-full lg:w-[480px] space-y-4">
          <div className="text-center lg:text-left">
            <h2 className="text-lg font-bold text-slate-300">Select Your Portal</h2>
            <p className="text-xs text-slate-500 mb-4">Tap on a path below to access the customized portal</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            
            {/* School Student Quest Card */}
            <Link 
              href="/student?mode=school"
              className="glass-panel glass-panel-hover p-4 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-primary transition-colors">School Assessment Quest</h3>
                  <p className="text-xs text-slate-400">Take an assessment coordinated by your visiting consultant</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-250" />
            </Link>

            {/* Independent Individual Quest Card */}
            <Link 
              href="/student?mode=individual"
              className="glass-panel glass-panel-hover p-4 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-violet-400 transition-colors">Independent Individual Quest</h3>
                  <p className="text-xs text-slate-400">Sign up independently to take a direct diagnostic career test</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors group-hover:translate-x-1 duration-250" />
            </Link>

            {/* Parent Dashboard Card */}
            <Link 
              href="/parent"
              className="glass-panel glass-panel-hover p-4 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-secondary transition-colors">Parent Guidance Dashboard</h3>
                  <p className="text-xs text-slate-400">Review developmental curves and student activity guides</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-secondary transition-colors group-hover:translate-x-1 duration-250" />
            </Link>

            {/* School Administrator Dashboard */}
            <Link 
              href="/school"
              className="glass-panel glass-panel-hover p-4 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-accent transition-colors">School & Administrator Portal</h3>
                  <p className="text-xs text-slate-400">Register rosters, manage streams, and access aggregates</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-accent transition-colors group-hover:translate-x-1 duration-250" />
            </Link>
          </div>

          <div className="p-3 bg-red-950/10 border border-red-900/25 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-danger">Safety Alert</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                CareerCompass enforces strict double-consent frameworks for data processing. PII is encrypted.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 z-10 border-t border-card-border pt-6 mt-8">
        <p>© 2026 CareerCompass System. Supported by African Education Research Initiatives.</p>
        <div className="flex gap-4 mt-2 md:mt-0 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Child Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Parent Consent Form</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
        </div>
      </footer>
    </div>
  );
}

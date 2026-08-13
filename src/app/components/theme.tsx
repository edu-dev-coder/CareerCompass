"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Read theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("akili-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Default is dark
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: "dark" | "light") => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (newTheme === "light") {
        root.classList.add("light-theme");
      } else {
        root.classList.remove("light-theme");
      }
    }
  };

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("akili-theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:text-primary transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 no-print"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle visual theme mode"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500" />
      )}
    </button>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to light for B2B Industrial
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-black/10 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 hover:border-[#A2C367] transition-all group overflow-hidden shadow-sm"
      aria-label="Toggle Theme"
    >
      <div className="relative z-10 text-zinc-600 dark:text-[#A2C367] group-hover:scale-110 transition-transform">
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </div>
      <div className="absolute inset-0 bg-[#A2C367]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

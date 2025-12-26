"use client";

import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { getTheme, setTheme, applyTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-zinc-100 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <button
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded transition-colors ${
          currentTheme === "light"
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Light mode"
      >
        <FiSun size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded transition-colors ${
          currentTheme === "system"
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="System theme"
      >
        <FiMonitor size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded transition-colors ${
          currentTheme === "dark"
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Dark mode"
      >
        <FiMoon size={18} />
      </button>
    </div>
  );
}


/**
 * Theme utilities for dark mode and theme management
 */

export type Theme = "light" | "dark" | "system";

/**
 * Gets the current theme from localStorage or system preference
 */
export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored && ["light", "dark", "system"].includes(stored)) {
    return stored;
  }

  return "system";
}

/**
 * Sets the theme
 */
export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

/**
 * Applies the theme to the document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

/**
 * Initializes theme on page load
 */
export function initTheme(): void {
  if (typeof window === "undefined") return;

  const theme = getTheme();
  applyTheme(theme);

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (getTheme() === "system") {
      applyTheme("system");
    }
  });
}


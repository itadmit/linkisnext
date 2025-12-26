"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/theme";

/**
 * Script to initialize theme on page load
 * Must be in <head> to prevent flash of wrong theme
 */
export function ThemeScript() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getTheme() {
              const stored = localStorage.getItem('theme');
              if (stored && ['light', 'dark', 'system'].includes(stored)) {
                return stored;
              }
              return 'system';
            }
            
            function applyTheme(theme) {
              const root = document.documentElement;
              if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.toggle('dark', prefersDark);
              } else {
                root.classList.toggle('dark', theme === 'dark');
              }
            }
            
            applyTheme(getTheme());
          })();
        `,
      }}
    />
  );
}


"use client";

import { useEffect } from "react";
import { registerShortcuts, DASHBOARD_SHORTCUTS } from "@/lib/keyboard-shortcuts";

/**
 * Component to register keyboard shortcuts for dashboard
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    const cleanup = registerShortcuts(DASHBOARD_SHORTCUTS);
    return cleanup;
  }, []);

  return null;
}


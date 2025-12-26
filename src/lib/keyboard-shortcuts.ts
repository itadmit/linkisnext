/**
 * Keyboard shortcuts utilities
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  description?: string;
}

/**
 * Registers keyboard shortcuts
 */
export function registerShortcuts(shortcuts: KeyboardShortcut[]): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    shortcuts.forEach((shortcut) => {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        shortcut.handler();
      }
    });
  };

  window.addEventListener("keydown", handleKeyDown);

  // Return cleanup function
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Common keyboard shortcuts for the dashboard
 */
export const DASHBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: "n",
    ctrl: true,
    handler: () => {
      // Navigate to new link
      window.location.href = "/dashboard";
      // Trigger new link modal (would need to be implemented)
    },
    description: "לינק חדש",
  },
  {
    key: "p",
    ctrl: true,
    handler: () => {
      window.location.href = "/dashboard/profile";
    },
    description: "פרופיל",
  },
  {
    key: "a",
    ctrl: true,
    handler: () => {
      window.location.href = "/dashboard/analytics";
    },
    description: "אנליטיקס",
  },
  {
    key: "/",
    handler: () => {
      // Focus search (would need to be implemented)
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: "חיפוש",
  },
];


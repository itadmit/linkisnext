"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const PRESET_COLORS = [
  "#ffffff", // לבן
  "#000000", // שחור
  "#6366f1", // אינדיגו
  "#8b5cf6", // סגול
  "#ec4899", // ורוד
  "#f59e0b", // ענבר
  "#10b981", // ירוק
  "#3b82f6", // כחול
  "#ef4444", // אדום
  "#f97316", // כתום
  "#14b8a6", // טורקיז
  "#64748b", // אפור
  "#f3f4f6", // אפור בהיר
  "#1f2937", // אפור כהה
  "#fef3c7", // צהוב בהיר
  "#dbeafe", // כחול בהיר
];

export function ColorPicker({ label, value, onChange, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className={`w-full ${className}`} dir="rtl" ref={dropdownRef}>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all duration-200 cursor-pointer group"
        >
          <div
            className="w-10 h-10 rounded-lg border-2 border-zinc-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <div className="flex-1 text-right">
            <div className="text-sm font-medium text-zinc-900">{value.toUpperCase()}</div>
            <div className="text-xs text-zinc-500">לחץ לבחירת צבע</div>
          </div>
          <FiChevronDown
            className={`text-zinc-400 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            size={18}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-4">
            {/* Preset Colors */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-zinc-700 mb-2">צבעים מוגדרים</div>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      value.toLowerCase() === color.toLowerCase()
                        ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-1"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {value.toLowerCase() === color.toLowerCase() && (
                      <FiCheck className="text-white m-auto" size={14} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div className="border-t border-zinc-200 pt-4">
              <div className="text-xs font-semibold text-zinc-700 mb-2">צבע מותאם אישית</div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



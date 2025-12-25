"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-2 text-right">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-right ${
              icon ? "pr-10" : ""
            } ${error ? "border-red-500" : ""} ${className}`}
            dir="rtl"
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-400 text-right">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";


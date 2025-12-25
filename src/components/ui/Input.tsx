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
          <label className="block text-sm font-semibold text-zinc-900 mb-2 text-right">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-all duration-200 text-right hover:border-zinc-300 ${
              icon ? "pr-10" : ""
            } ${error ? "border-red-400 focus:ring-red-400" : ""} ${className}`}
            dir="rtl"
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";


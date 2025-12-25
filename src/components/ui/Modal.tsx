"use client";

import { ReactNode, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative bg-white rounded-2xl border-2 border-zinc-300 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-zinc-200 bg-zinc-50">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-200 rounded-lg border border-transparent hover:border-zinc-300"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}


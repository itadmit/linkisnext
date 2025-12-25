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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 hover:bg-zinc-100 rounded-md"
          >
            <FiX size={20} />
          </button>
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}


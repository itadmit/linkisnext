"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiCopy, FiExternalLink, FiMenu } from "react-icons/fi";
import { IconRenderer } from "@/lib/icons";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  couponCode: string | null;
  discountDescription: string | null;
  isActive: boolean;
  clicks: number;
  order: number;
  startsAt: string | null;
  endsAt: string | null;
}

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function LinkCard({ link, onEdit, onDelete, onToggle }: LinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-zinc-200 rounded-lg p-4 transition-all duration-200 shadow-sm ${
        isDragging ? "opacity-50 scale-105 shadow-xl ring-2 ring-zinc-200" : "hover:border-zinc-300 hover:shadow-md"
      } ${!link.isActive ? "opacity-60 bg-zinc-50/50 grayscale" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-zinc-300 hover:text-zinc-600 cursor-grab active:cursor-grabbing p-1.5 hover:bg-zinc-50 rounded-md transition-colors"
        >
          <FiMenu size={18} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 text-zinc-600">
          <IconRenderer iconValue={link.icon} size={22} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-right">
          <h3 className="font-semibold text-zinc-900 truncate text-base">{link.title}</h3>
          <p className="text-sm text-zinc-500 truncate mt-0.5 flex items-center gap-1">
            {link.url}
            <FiExternalLink size={12} className="opacity-50" />
          </p>
          {link.couponCode && (
            <div className="flex items-center gap-2 mt-2 justify-end">
              <span className="text-xs bg-amber-50/80 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100 font-medium">
                קופון: {link.couponCode}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-center px-6 border-r border-zinc-100 mx-2">
          <p className="text-xl font-bold text-zinc-900 tracking-tight">{link.clicks}</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">קליקים</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(link.id, !link.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              link.isActive
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-zinc-400 hover:bg-zinc-100"
            }`}
            title={link.isActive ? "הסתר לינק" : "הצג לינק"}
          >
            {link.isActive ? <FiEye size={18} /> : <FiEyeOff size={18} />}
          </button>
          <button
            onClick={() => onEdit(link)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="ערוך"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="מחק"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}


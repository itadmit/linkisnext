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
      className={`bg-white border border-zinc-200 rounded-lg p-4 transition-all duration-200 ${
        isDragging ? "opacity-50 scale-105 shadow-xl ring-2 ring-zinc-200" : "hover:border-zinc-300 hover:shadow-sm"
      } ${!link.isActive ? "opacity-60 grayscale bg-zinc-50" : ""}`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing p-1.5 hover:bg-zinc-100 rounded-md"
        >
          <FiMenu size={18} />
        </button>

        {/* Icon */}
        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0 border border-zinc-200 text-zinc-600">
          <IconRenderer iconValue={link.icon} size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-right">
          <h3 className="font-medium text-zinc-900 truncate text-sm">{link.title}</h3>
          <p className="text-xs text-zinc-500 truncate mt-0.5">{link.url}</p>
          {link.couponCode && (
            <div className="flex items-center gap-2 mt-1.5 justify-end">
              <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200 font-medium">
                קופון: {link.couponCode}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-center px-4 border-r border-zinc-100">
          <p className="text-lg font-bold text-zinc-900">{link.clicks}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">קליקים</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(link.id, !link.isActive)}
            className={`p-2 rounded-md transition-colors ${
              link.isActive
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-zinc-400 hover:bg-zinc-100"
            }`}
            title={link.isActive ? "הסתר לינק" : "הצג לינק"}
          >
            {link.isActive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
          </button>
          <button
            onClick={() => onEdit(link)}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="ערוך"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="מחק"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


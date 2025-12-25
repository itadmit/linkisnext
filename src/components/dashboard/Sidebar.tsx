"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FiLink,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiExternalLink,
  FiLayout,
  FiMail,
} from "react-icons/fi";

const menuItems = [
  { href: "/dashboard", label: "לינקים", icon: FiLink },
  { href: "/dashboard/landing-pages", label: "דפי נחיתה", icon: FiLayout },
  { href: "/dashboard/leads", label: "לידים", icon: FiMail },
  { href: "/dashboard/profile", label: "פרופיל", icon: FiUser },
  { href: "/dashboard/analytics", label: "אנליטיקס", icon: FiBarChart2 },
  { href: "/dashboard/subscription", label: "מנוי", icon: FiCreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-zinc-50 border-l border-zinc-200 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          LinkHub
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* View Page Link */}
        {session?.user?.slug && (
          <Link
            href={`/${session.user.slug}`}
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200 text-sm font-medium mt-6"
          >
            <FiExternalLink size={18} />
            <span>צפה בדף</span>
          </Link>
        )}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-zinc-200 pt-4 mt-4 px-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs text-zinc-700 font-medium">
            {session?.user?.name?.[0] || session?.user?.email?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {session?.user?.name || "משתמש"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-xs font-medium"
        >
          <FiLogOut size={14} />
          <span>התנתק</span>
        </button>
      </div>
    </aside>
  );
}


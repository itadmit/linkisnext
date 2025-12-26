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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
    <aside className="w-64 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 min-h-screen p-4 flex flex-col shadow-sm z-10">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-zinc-900 dark:bg-zinc-100 rounded-full inline-block"></span>
          Linkis
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer ${
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-sm active:scale-[0.98]"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* View Page Link */}
        {session?.user?.slug && (
          <Link
            href={`/${session.user.slug}`}
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-sm active:scale-[0.98] transition-all duration-200 text-sm font-medium mt-6 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 cursor-pointer"
          >
            <FiExternalLink size={18} />
            <span>צפה בדף</span>
          </Link>
        )}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4 px-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-400 font-medium border border-zinc-200 dark:border-zinc-700">
            {session?.user?.name?.[0] || session?.user?.email?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {session?.user?.name || "משתמש"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <div className="mb-3 flex justify-center">
          <ThemeToggle />
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:shadow-sm active:scale-[0.98] transition-all duration-200 w-full text-xs font-medium cursor-pointer"
        >
          <FiLogOut size={14} />
          <span>התנתק</span>
        </button>
      </div>
    </aside>
  );
}


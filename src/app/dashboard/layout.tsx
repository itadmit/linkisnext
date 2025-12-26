"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import { KeyboardShortcuts } from "@/components/dashboard/KeyboardShortcuts";
import { FiSearch } from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Check if this is the landing page builder - if so, render without dashboard layout
  const isBuilderPage = pathname?.includes("/landing-pages/") && pathname?.match(/\/landing-pages\/[^/]+$/);

  if (isBuilderPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900" dir="rtl">
      <KeyboardShortcuts />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="חפש..."
                  className="w-full pr-10 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationsDropdown />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs text-zinc-600 font-medium border border-zinc-200">
                  {session?.user?.name?.[0] || session?.user?.email?.[0]}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {session?.user?.name || "משתמש"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <SubscriptionBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

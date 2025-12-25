"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPageBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return <div className="min-h-screen bg-zinc-100" dir="rtl">{children}</div>;
}


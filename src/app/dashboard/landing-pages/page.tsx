"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    leads: number;
  };
}

export default function LandingPagesPage() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLandingPages = useCallback(async () => {
    try {
      const res = await fetch("/api/landing-pages");
      const data = await res.json();
      setLandingPages(data);
    } catch (error) {
      toast.error("שגיאה בטעינת דפי הנחיתה");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLandingPages();
  }, [fetchLandingPages]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`האם למחוק את דף הנחיתה "${name}"?`)) return;

    try {
      const res = await fetch(`/api/landing-pages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("שגיאה במחיקת דף הנחיתה");

      toast.success("דף הנחיתה נמחק");
      fetchLandingPages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const res = await fetch(`/api/landing-pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus === "published" ? "draft" : "published",
        }),
      });

      if (!res.ok) throw new Error("שגיאה בעדכון הסטטוס");

      toast.success(
        currentStatus === "published" ? "הדף הוסתר" : "הדף פורסם"
      );
      fetchLandingPages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">דפי נחיתה</h1>
          <p className="text-zinc-500 text-sm mt-1">
            צור וניהול דפי נחיתה מותאמים אישית
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/landing-pages/new")}>
          <FiPlus className="ml-2" />
          דף נחיתה חדש
        </Button>
      </div>

      {/* Landing Pages List */}
      {landingPages.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-white/50">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 shadow-sm">
            <FiPlus size={24} className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            אין לך דפי נחיתה עדיין
          </h3>
          <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">
            התחל ליצור דף נחיתה מותאם אישית עם בילדר חזותי מתקדם
          </p>
          <Button onClick={() => router.push("/dashboard/landing-pages/new")} size="lg">
            <FiPlus className="ml-2" />
            צור דף נחיתה ראשון
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-300 hover:shadow-lg transition-all duration-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                    {page.name}
                  </h3>
                  {page.description && (
                    <p className="text-zinc-500 text-sm">{page.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    page.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {page.status === "published" ? "פורסם" : "טיוטה"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <FiEye size={16} />
                  <span>{page.views} צפיות</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiMail size={16} />
                  <span>{page._count.leads} לידים</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/landing-pages/${page.id}`)
                  }
                  className="flex-1"
                >
                  <FiEdit2 className="ml-1" size={14} />
                  ערוך
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleStatus(page.id, page.status)}
                >
                  {page.status === "published" ? (
                    <FiEyeOff size={14} />
                  ) : (
                    <FiEye size={14} />
                  )}
                </Button>
                {page.status === "published" && (
                  <a
                    href={`/landing/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors border border-zinc-200"
                  >
                    <FiExternalLink size={14} />
                  </a>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(page.id, page.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FiTrash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


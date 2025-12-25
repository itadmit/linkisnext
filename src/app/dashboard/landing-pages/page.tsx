"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from "react-icons/fi";
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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">דפי נחיתה</h1>
          <p className="text-white/60 mt-1">
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
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPlus size={32} className="text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            אין לך דפי נחיתה עדיין
          </h3>
          <p className="text-white/60 mb-6">
            התחל ליצור דף נחיתה מותאם אישית
          </p>
          <Button onClick={() => router.push("/dashboard/landing-pages/new")}>
            <FiPlus className="ml-2" />
            צור דף נחיתה ראשון
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <div
              key={page.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {page.name}
                  </h3>
                  {page.description && (
                    <p className="text-white/60 text-sm">{page.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    page.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {page.status === "published" ? "פורסם" : "טיוטה"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <FiEye size={16} />
                  <span>{page.views} צפיות</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📧</span>
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
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <FiExternalLink size={14} />
                  </a>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(page.id, page.name)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
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


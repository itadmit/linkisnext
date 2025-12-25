"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function NewLandingPagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "שגיאה ביצירת דף הנחיתה");
      }

      const landingPage = await res.json();
      toast.success("דף הנחיתה נוצר בהצלחה!");
      router.push(`/dashboard/landing-pages/${landingPage.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">דף נחיתה חדש</h1>

      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <Input
          label="שם הדף"
          placeholder="דף נחיתה למוצר X"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <Input
            label="סלאג (כתובת הדף)"
            placeholder="my-landing-page"
            value={formData.slug}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            dir="ltr"
            className="text-left"
            required
          />
          <p className="text-white/60 text-sm mt-1">
            הכתובת תהיה: yourdomain.com/landing/{formData.slug || "[סלאג]"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            תיאור (אופציונלי)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="תיאור קצר של דף הנחיתה..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            dir="rtl"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading} className="flex-1">
            צור דף נחיתה
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
}


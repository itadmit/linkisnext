"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface User {
  name: string | null;
  slug: string;
  bio: string | null;
  avatar: string | null;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

interface ProfileFormProps {
  user: User | null;
  onSubmit: (data: Partial<User>) => void;
  isLoading?: boolean;
}

const PRESET_THEMES = [
  {
    name: "סגול כהה",
    backgroundColor: "#1a1a2e",
    textColor: "#ffffff",
    buttonColor: "#6366f1",
    buttonTextColor: "#ffffff",
  },
  {
    name: "ים עמוק",
    backgroundColor: "#0f172a",
    textColor: "#e2e8f0",
    buttonColor: "#0ea5e9",
    buttonTextColor: "#ffffff",
  },
  {
    name: "יער לילי",
    backgroundColor: "#14532d",
    textColor: "#dcfce7",
    buttonColor: "#22c55e",
    buttonTextColor: "#052e16",
  },
  {
    name: "שקיעה",
    backgroundColor: "#7c2d12",
    textColor: "#fff7ed",
    buttonColor: "#f97316",
    buttonTextColor: "#ffffff",
  },
  {
    name: "ורוד מודרני",
    backgroundColor: "#831843",
    textColor: "#fdf2f8",
    buttonColor: "#ec4899",
    buttonTextColor: "#ffffff",
  },
  {
    name: "מינימלי לבן",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    buttonColor: "#1e293b",
    buttonTextColor: "#ffffff",
  },
];

export function ProfileForm({ user, onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    slug: "",
    bio: "",
    avatar: "",
    backgroundColor: "#1a1a2e",
    textColor: "#ffffff",
    buttonColor: "#6366f1",
    buttonTextColor: "#ffffff",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        slug: user.slug || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        backgroundColor: user.backgroundColor,
        textColor: user.textColor,
        buttonColor: user.buttonColor,
        buttonTextColor: user.buttonTextColor,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    setFormData({
      ...formData,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      buttonColor: theme.buttonColor,
      buttonTextColor: theme.buttonTextColor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Avatar */}
      <Input
        label="כתובת תמונת פרופיל"
        placeholder="https://example.com/avatar.jpg"
        value={formData.avatar || ""}
        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
        dir="ltr"
        className="text-left"
      />

      {/* Name */}
      <Input
        label="שם"
        placeholder="השם שלך"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      {/* Slug */}
      <Input
        label="סלאג (כתובת הדף)"
        placeholder="your-name"
        value={formData.slug || ""}
        onChange={(e) =>
          setFormData({ ...formData, slug: e.target.value.toLowerCase() })
        }
        dir="ltr"
        className="text-left"
      />

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          ביו
        </label>
        <textarea
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
          rows={3}
          placeholder="ספר על עצמך..."
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          dir="rtl"
        />
      </div>

      {/* Theme Presets */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          ערכות נושא מוכנות
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => applyTheme(theme)}
              className="p-3 rounded-xl border border-white/20 hover:border-indigo-500 transition-all duration-200"
              style={{ backgroundColor: theme.backgroundColor }}
            >
              <div
                className="w-full h-6 rounded-lg mb-2"
                style={{ backgroundColor: theme.buttonColor }}
              />
              <p
                className="text-xs font-medium"
                style={{ color: theme.textColor }}
              >
                {theme.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            צבע רקע
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData({ ...formData, backgroundColor: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData({ ...formData, backgroundColor: e.target.value })
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            צבע טקסט
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.textColor}
              onChange={(e) =>
                setFormData({ ...formData, textColor: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.textColor}
              onChange={(e) =>
                setFormData({ ...formData, textColor: e.target.value })
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            צבע כפתורים
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.buttonColor}
              onChange={(e) =>
                setFormData({ ...formData, buttonColor: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.buttonColor}
              onChange={(e) =>
                setFormData({ ...formData, buttonColor: e.target.value })
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              dir="ltr"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            צבע טקסט בכפתורים
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.buttonTextColor}
              onChange={(e) =>
                setFormData({ ...formData, buttonTextColor: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.buttonTextColor}
              onChange={(e) =>
                setFormData({ ...formData, buttonTextColor: e.target.value })
              }
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" isLoading={isLoading} className="w-full">
        שמור שינויים
      </Button>
    </form>
  );
}


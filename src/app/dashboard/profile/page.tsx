"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { QRCodeGenerator } from "@/components/dashboard/QRCodeGenerator";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FiCopy, FiCheck, FiChevronDown, FiChevronUp, FiLayers, FiZap, FiTrendingUp, FiPackage, FiMinimize2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface SocialLink {
  platform: string;
  url: string;
}

interface User {
  name: string | null;
  slug: string;
  bio: string | null;
  avatar: string | null;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonStyle: string;
  backgroundStyle: string;
  theme: string;
  socialLinks: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

const BUTTON_STYLES = [
  { id: "rounded", name: "מעוגל", preview: "rounded-xl" },
  { id: "pill", name: "כדורי", preview: "rounded-full" },
  { id: "square", name: "מרובע", preview: "rounded-none" },
  { id: "outline", name: "מסגרת", preview: "rounded-xl border-2 bg-transparent" },
];

const BACKGROUND_STYLES = [
  { id: "gradient", name: "גרדיאנט", icon: FiLayers },
  { id: "particles", name: "חלקיקים", icon: FiZap },
  { id: "waves", name: "גלים", icon: FiTrendingUp },
  { id: "geometric", name: "גאומטרי", icon: FiPackage },
  { id: "none", name: "ללא", icon: FiMinimize2 },
];

const TEMPLATES = [
  { id: "default", name: "ברירת מחדל", description: "עיצוב קלאסי" },
  { id: "linkiz", name: "לינקיז", description: "עיצוב נקי ומינימליסטי" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("profile");
  
  // Form state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [buttonStyle, setButtonStyle] = useState("rounded");
  const [backgroundStyle, setBackgroundStyle] = useState("gradient");
  const [theme, setTheme] = useState("default");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [avatar, setAvatar] = useState("");

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
      setSocialLinks(data.socialLinks ? JSON.parse(data.socialLinks) : []);
      setButtonStyle(data.buttonStyle || "rounded");
      setBackgroundStyle(data.backgroundStyle || "gradient");
      setTheme(data.theme || "default");
      setSeoTitle(data.seoTitle || "");
      setSeoDescription(data.seoDescription || "");
      setAvatar(data.avatar || "");
    } catch (error) {
      toast.error("שגיאה בטעינת הפרופיל");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async (data: Partial<User>) => {
    setIsSaving(true);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          avatar: data.avatar || avatar, // Use avatar from form or from ImageUpload
          socialLinks: JSON.stringify(socialLinks),
          buttonStyle,
          backgroundStyle,
          theme,
          seoTitle,
          seoDescription,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "שגיאה בעדכון הפרופיל");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      toast.success("הפרופיל עודכן בהצלחה");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSocialLinks = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialLinks: JSON.stringify(socialLinks),
        }),
      });

      if (!res.ok) throw new Error("שגיאה בשמירה");
      toast.success("הרשתות החברתיות נשמרו!");
    } catch (error) {
      toast.error("שגיאה בשמירה");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAdvancedSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buttonStyle,
          backgroundStyle,
          theme,
          seoTitle,
          seoDescription,
          avatar,
        }),
      });

      if (!res.ok) throw new Error("שגיאה בשמירה");
      toast.success("ההגדרות נשמרו!");
    } catch (error) {
      toast.error("שגיאה בשמירה");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    if (user?.slug) {
      navigator.clipboard.writeText(`${window.location.origin}/${user.slug}`);
      setCopied(true);
      toast.success("הלינק הועתק!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user?.slug}`;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8">הפרופיל שלי</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("profile")}
              className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="flex items-center gap-2 text-zinc-400">
                {expandedSection === "profile" ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </span>
              <h3 className="text-lg font-semibold text-zinc-900">פרטים בסיסיים</h3>
            </button>
            {expandedSection === "profile" && (
              <div className="p-6 pt-0">
                <ProfileForm
                  user={user}
                  onSubmit={handleSubmit}
                  isLoading={isSaving}
                />
              </div>
            )}
          </div>

          {/* Social Links Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("social")}
              className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="flex items-center gap-2 text-zinc-400">
                {expandedSection === "social" ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </span>
              <h3 className="text-lg font-semibold text-zinc-900">רשתות חברתיות</h3>
            </button>
            {expandedSection === "social" && (
              <div className="p-6 pt-0 space-y-4">
                <SocialLinks links={socialLinks} onChange={setSocialLinks} />
                <Button onClick={saveSocialLinks} isLoading={isSaving}>
                  שמור רשתות חברתיות
                </Button>
              </div>
            )}
          </div>

          {/* Advanced Settings Section */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("advanced")}
              className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="flex items-center gap-2 text-zinc-400">
                {expandedSection === "advanced" ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </span>
              <h3 className="text-lg font-semibold text-zinc-900">הגדרות מתקדמות</h3>
            </button>
            {expandedSection === "advanced" && (
              <div className="p-5 space-y-6" dir="rtl">
                {/* Avatar Upload */}
                <ImageUpload
                  label="תמונת פרופיל"
                  value={avatar}
                  onChange={async (newAvatar) => {
                    setAvatar(newAvatar);
                    // Auto-save avatar when uploaded
                    try {
                      const res = await fetch("/api/user", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ avatar: newAvatar }),
                      });
                      if (res.ok) {
                        const updatedUser = await res.json();
                        setUser(updatedUser);
                        toast.success("תמונת הפרופיל נשמרה!");
                      }
                    } catch (error) {
                      console.error("Failed to save avatar:", error);
                    }
                  }}
                />

                {/* Button Style */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    סגנון כפתורים
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BUTTON_STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setButtonStyle(style.id)}
                        className={`p-4 border transition-all duration-200 rounded-lg ${
                          buttonStyle === style.id
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                            : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                        } ${style.preview}`}
                      >
                        <span className="text-sm font-medium">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    תבנית עיצוב
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setTheme(template.id)}
                        className={`p-4 rounded-xl border transition-all duration-200 text-right ${
                          theme === template.id
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                            : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                        }`}
                      >
                        <div className="font-semibold mb-1">{template.name}</div>
                        <div className="text-xs text-zinc-500">{template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Style */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    אפקט רקע
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {BACKGROUND_STYLES.map((style) => {
                      const IconComponent = style.icon;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setBackgroundStyle(style.id)}
                          className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                            backgroundStyle === style.id
                              ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                              : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                          }`}
                        >
                          <IconComponent size={24} />
                          <span className="text-xs font-medium">{style.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="space-y-4">
                  <h4 className="text-zinc-900 font-semibold">הגדרות SEO</h4>
                  <Input
                    label="כותרת לשיתוף"
                    placeholder="הכותרת שתופיע בשיתוף לרשתות"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      תיאור לשיתוף
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="התיאור שיופיע בשיתוף לרשתות"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={saveAdvancedSettings} isLoading={isSaving}>
                  שמור הגדרות מתקדמות
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Page Link */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900 mb-4 text-right">
              הלינק שלך
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={copyLink}
                className="shrink-0"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </Button>
              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-600 text-sm truncate" dir="ltr">
                {pageUrl}
              </div>
            </div>
          </div>

          {/* QR Code */}
          {user?.slug && (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-zinc-900 mb-4 text-right">
                QR Code
              </h3>
              <QRCodeGenerator url={pageUrl} slug={user.slug} />
            </div>
          )}

          {/* Live Preview */}
          {user && (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-zinc-900 mb-4 text-right">
                תצוגה מקדימה
              </h3>
              <div
                className="rounded-xl p-6 text-center relative overflow-hidden"
                style={{ backgroundColor: user.backgroundColor }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user.name || ""}
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2"
                    style={{ borderColor: user.buttonColor + "60" }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: user.buttonColor,
                      color: user.buttonTextColor,
                    }}
                  >
                    {(user.name || user.slug).charAt(0).toUpperCase()}
                  </div>
                )}
                <h4
                  className="font-bold text-lg"
                  style={{ color: user.textColor }}
                >
                  {user.name || user.slug}
                </h4>
                {user.bio && (
                  <p
                    className="text-sm mt-1 opacity-80"
                    style={{ color: user.textColor }}
                  >
                    {user.bio}
                  </p>
                )}
                <div
                  className={`mt-4 py-2 text-sm ${
                    buttonStyle === "pill"
                      ? "rounded-full"
                      : buttonStyle === "square"
                      ? "rounded-none"
                      : buttonStyle === "outline"
                      ? "rounded-xl border-2 bg-transparent"
                      : "rounded-xl"
                  }`}
                  style={{
                    backgroundColor:
                      buttonStyle === "outline"
                        ? "transparent"
                        : user.buttonColor,
                    color: user.buttonTextColor,
                    borderColor:
                      buttonStyle === "outline" ? user.buttonColor : undefined,
                  }}
                >
                  לינק לדוגמה
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

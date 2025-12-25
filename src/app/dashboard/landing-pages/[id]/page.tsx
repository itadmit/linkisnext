"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FiSave, FiEye, FiArrowRight, FiTarget, FiZap, FiMessageCircle, FiBook, FiSend, FiMail, FiHelpCircle } from "react-icons/fi";
import { IconRenderer } from "@/lib/icons";
import { SectionSettings } from "@/components/landing/SectionSettings";
import toast from "react-hot-toast";

interface Section {
  type: string;
  id: string;
  data: any;
  style?: any;
}

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  sections: string; // JSON string
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
}

export default function EditLandingPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [pageId, setPageId] = useState<string | null>(null);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setPageId(p.id));
  }, [params]);

  const fetchLandingPage = useCallback(async () => {
    if (!pageId) return;

    try {
      const res = await fetch(`/api/landing-pages/${pageId}`);
      if (!res.ok) throw new Error("שגיאה בטעינת דף הנחיתה");

      const data = await res.json();
      setLandingPage(data);
      
      // Parse sections JSON
      try {
        const parsedSections = JSON.parse(data.sections || "[]");
        setSections(parsedSections);
      } catch {
        setSections([]);
      }
    } catch (error: any) {
      toast.error(error.message);
      router.push("/dashboard/landing-pages");
    } finally {
      setIsLoading(false);
    }
  }, [pageId, router]);

  useEffect(() => {
    fetchLandingPage();
  }, [fetchLandingPage]);

  const handleSave = async () => {
    if (!pageId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/landing-pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: JSON.stringify(sections),
        }),
      });

      if (!res.ok) throw new Error("שגיאה בשמירה");

      toast.success("הדף נשמר בהצלחה!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!pageId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/landing-pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: landingPage?.status === "published" ? "draft" : "published",
        }),
      });

      if (!res.ok) throw new Error("שגיאה בפרסום");

      toast.success(
        landingPage?.status === "published"
          ? "הדף הוסתר"
          : "הדף פורסם בהצלחה!"
      );
      fetchLandingPage();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      type,
      id: `${type}-${Date.now()}`,
      data: getDefaultSectionData(type),
      style: {},
    };
    setSections([...sections, newSection]);
    setSelectedSectionId(newSection.id);
  };

  const getDefaultSectionData = (type: string): any => {
    switch (type) {
      case "hero":
        return {
          title: "ברוכים הבאים",
          subtitle: "הפתרון המושלם עבורך",
          ctaText: "התחל עכשיו",
          ctaUrl: "#contact",
        };
      case "features":
        return {
          title: "התכונות שלנו",
          items: [
            { icon: "FiZap", title: "מהיר", description: "מהירות גבוהה" },
            { icon: "FiShield", title: "בטוח", description: "אבטחה מתקדמת" },
            { icon: "FiStar", title: "איכותי", description: "איכות מעולה" },
          ],
        };
      case "testimonials":
        return {
          title: "מה אומרים עלינו",
          items: [
            {
              name: "יוסי כהן",
              role: "מנכ\"ל",
              text: "שירות מעולה!",
              avatar: null,
            },
            {
              name: "מיכל לוי",
              role: "מעצבת",
              text: "מומלץ מאוד!",
              avatar: null,
            },
          ],
        };
      case "about":
        return {
          title: "אודותינו",
          content: "אנחנו חברה מובילה בתחום...",
          image: null,
          imagePosition: "right", // left or right
        };
      case "cta":
        return {
          title: "מוכן להתחיל?",
          description: "הצטרף אלינו עוד היום",
          ctaText: "התחל עכשיו",
          ctaUrl: "#contact",
        };
      case "contact-form":
        return {
          title: "צור קשר",
          description: "נשמח לשמוע ממך",
          formFields: ["name", "email", "phone", "message"], // Standard fields
          customFields: [], // Custom fields
        };
      case "faq":
        return {
          title: "שאלות נפוצות",
          items: [
            {
              question: "איך זה עובד?",
              answer: "זה פשוט מאוד...",
            },
            {
              question: "כמה זה עולה?",
              answer: "המחיר משתנה...",
            },
          ],
        };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    setSections(newSections);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!landingPage) {
    return null;
  }

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-white/10 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{landingPage.name}</h1>
          <p className="text-white/60 text-sm">עורך דף נחיתה</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleSave} isLoading={isSaving}>
            <FiSave className="ml-2" />
            שמור
          </Button>
          <Button onClick={handlePublish} isLoading={isSaving}>
            {landingPage.status === "published" ? (
              <>
                <FiEye className="ml-2" />
                הסתר
              </>
            ) : (
              <>
                <FiEye className="ml-2" />
                פרסם
              </>
            )}
          </Button>
          {landingPage.status === "published" && (
            <a
              href={`/landing/${landingPage.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary">
                <FiArrowRight className="ml-2" />
                צפה בדף
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Available Sections */}
        <div className="w-64 bg-slate-900/30 border-r border-white/10 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">הוסף סקשן</h3>
          <div className="space-y-2">
            {[
              { type: "hero", label: "Hero", icon: FiTarget },
              { type: "features", label: "תכונות", icon: FiZap },
              { type: "testimonials", label: "המלצות", icon: FiMessageCircle },
              { type: "about", label: "אודות", icon: FiBook },
              { type: "cta", label: "CTA", icon: FiSend },
              { type: "contact-form", label: "טופס יצירת קשר", icon: FiMail },
              { type: "faq", label: "שאלות נפוצות", icon: FiHelpCircle },
            ].map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.type}
                  onClick={() => addSection(section.type)}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-right transition-all duration-200 flex items-center gap-2"
                >
                  <IconComponent size={18} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center - Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg min-h-full p-8">
            {sections.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">אין סקשנים עדיין</p>
                <p className="text-gray-400 text-sm">
                  לחץ על סקשן מהסיידבר כדי להוסיף
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      selectedSectionId === section.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    {/* Section Preview */}
                    <div className="text-gray-800">
                      {section.type === "hero" && (
                        <div className="text-center py-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg">
                          <h2 className="text-4xl font-bold mb-4">
                            {section.data.title || "כותרת"}
                          </h2>
                          <p className="text-xl mb-6">
                            {section.data.subtitle || "תת-כותרת"}
                          </p>
                          <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold">
                            {section.data.ctaText || "כפתור"}
                          </button>
                        </div>
                      )}
                      {section.type === "features" && (
                        <div>
                          <h3 className="text-2xl font-bold mb-6 text-center">
                            {section.data.title || "תכונות"}
                          </h3>
                          <div className={`grid gap-4 ${
                            section.data.columns === 2 ? "grid-cols-2" :
                            section.data.columns === 4 ? "grid-cols-4" :
                            "grid-cols-3"
                          }`}>
                            {section.data.items?.map((item: any, i: number) => (
                              <div key={i} className="text-center">
                                {item.icon && (
                                  <div className="mb-2 flex justify-center">
                                    <IconRenderer iconValue={item.icon} size={32} />
                                  </div>
                                )}
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "testimonials" && (
                        <div>
                          <h3 className="text-2xl font-bold mb-6 text-center">
                            {section.data.title || "המלצות"}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {section.data.items?.map((item: any, i: number) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-700 mb-3">"{item.text || "המלצה"}"</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                                    {(item.name || "א")[0]}
                                  </div>
                                  <div>
                                    <p className="font-semibold">{item.name || "שם"}</p>
                                    <p className="text-sm text-gray-600">{item.role || "תפקיד"}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "about" && (
                        <div className="flex items-center gap-6">
                          {section.data.imagePosition === "left" && section.data.image && (
                            <img src={section.data.image} alt="" className="w-48 h-48 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-4">
                              {section.data.title || "אודותינו"}
                            </h3>
                            <p className="text-gray-700 whitespace-pre-line">
                              {section.data.content || "תוכן..."}
                            </p>
                          </div>
                          {section.data.imagePosition === "right" && section.data.image && (
                            <img src={section.data.image} alt="" className="w-48 h-48 rounded-lg object-cover" />
                          )}
                        </div>
                      )}
                      {section.type === "cta" && (
                        <div className="text-center py-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg">
                          <h3 className="text-3xl font-bold mb-4">
                            {section.data.title || "מוכן להתחיל?"}
                          </h3>
                          <p className="text-xl mb-6 opacity-90">
                            {section.data.description || "תיאור"}
                          </p>
                          <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg">
                            {section.data.ctaText || "כפתור"}
                          </button>
                        </div>
                      )}
                      {section.type === "faq" && (
                        <div>
                          <h3 className="text-2xl font-bold mb-6 text-center">
                            {section.data.title || "שאלות נפוצות"}
                          </h3>
                          <div className="space-y-3">
                            {section.data.items?.map((item: any, i: number) => (
                              <div key={i} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">{item.question || "שאלה?"}</h4>
                                <p className="text-sm text-gray-600">{item.answer || "תשובה..."}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "contact-form" && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <h3 className="text-2xl font-bold mb-2">
                            {section.data.title || "טופס יצירת קשר"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {section.data.description || "תיאור"}
                          </p>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-gray-500 text-sm">טופס יופיע כאן</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index > 0) moveSection(index, index - 1);
                        }}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index < sections.length - 1)
                            moveSection(index, index + 1);
                        }}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                        disabled={index === sections.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-red-400 hover:text-red-600 text-sm mr-auto"
                      >
                        מחק
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Section Settings */}
        {selectedSection && (
          <div className="w-80 bg-slate-900/30 border-l border-white/10 p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">הגדרות סקשן</h3>
            <SectionSettings
              section={selectedSection}
              onUpdate={(updates) => updateSection(selectedSection.id, updates)}
            />
          </div>
        )}
      </div>
    </div>
  );
}


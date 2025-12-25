"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FiSave, FiEye, FiArrowRight, FiTarget, FiZap, FiMessageCircle, FiBook, FiSend, FiMail, FiHelpCircle, FiArrowLeft, FiChevronUp, FiChevronDown, FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { IconRenderer } from "@/lib/icons";
import { SectionSettings } from "@/components/landing/SectionSettings";
import { Modal } from "@/components/ui/Modal";
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
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

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

  const handleDelete = async () => {
    if (!pageId) return;
    
    if (!confirm(`האם למחוק את דף הנחיתה "${landingPage?.name}"? פעולה זו לא ניתנת לביטול.`)) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/landing-pages/${pageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("שגיאה במחיקה");

      toast.success("דף הנחיתה נמחק בהצלחה");
      router.push("/dashboard/landing-pages");
    } catch (error: any) {
      toast.error(error.message);
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
    setShowAddSectionModal(false);
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
      <div className="flex justify-center items-center h-screen bg-zinc-100">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!landingPage) {
    return null;
  }

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="h-screen flex flex-col bg-zinc-100 w-full">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 shadow-sm p-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard/landing-pages")}
            className="shrink-0"
          >
            <FiArrowLeft className="ml-2" />
            חזור לדשבורד
          </Button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{landingPage.name}</h1>
            <p className="text-zinc-500 text-sm">עורך דף נחיתה</p>
          </div>
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
          <Button 
            variant="secondary" 
            onClick={handleDelete} 
            isLoading={isSaving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <FiTrash2 className="ml-2" />
            מחק
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden w-full">

        {/* Center - Preview */}
        <div className="flex-1 overflow-y-auto bg-zinc-100 p-8">
          <div className="max-w-4xl mx-auto min-h-full bg-white rounded-xl shadow-2xl border border-zinc-200 p-8">
            {sections.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-700 mb-2 font-medium">אין סקשנים עדיין</p>
                <p className="text-zinc-500 text-sm">
                  לחץ על סקשן מהסיידבר כדי להוסיף
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`rounded-xl transition-all cursor-pointer group relative ${
                      selectedSectionId === section.id
                        ? "ring-2 ring-zinc-900 ring-offset-2"
                        : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2"
                    }`}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    {/* Section Actions - Floating on hover */}
                    <div className="absolute top-2 left-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index > 0) moveSection(index, index - 1);
                        }}
                        className="p-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg shadow-lg text-zinc-600 hover:text-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={index === 0}
                        title="הזז למעלה"
                      >
                        <FiChevronUp size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index < sections.length - 1)
                            moveSection(index, index + 1);
                        }}
                        className="p-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg shadow-lg text-zinc-600 hover:text-zinc-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={index === sections.length - 1}
                        title="הזז למטה"
                      >
                        <FiChevronDown size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="p-2 bg-white hover:bg-red-50 border border-red-200 rounded-lg shadow-lg text-red-500 hover:text-red-700 transition-all"
                        title="מחק סקשן"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    {/* Section Preview */}
                    <div className={section.data.width === "full" ? "w-full" : ""}>
                      <div className={section.data.width === "container" ? "max-w-4xl mx-auto" : ""}>
                      {section.type === "hero" && (
                        <div
                          className="text-center py-12 rounded-lg"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#6366f1",
                            color: section.style?.textColor || "#ffffff",
                          }}
                        >
                          <h2
                            className={`font-bold mb-4 ${
                              section.data.titleSize === "2xl" ? "text-2xl" :
                              section.data.titleSize === "3xl" ? "text-3xl" :
                              section.data.titleSize === "5xl" ? "text-5xl" :
                              "text-4xl"
                            }`}
                            style={{ color: section.style?.textColor || "#ffffff" }}
                          >
                            {section.data.title || "כותרת"}
                          </h2>
                          <p className="text-xl mb-6" style={{ color: section.style?.textColor || "#ffffff" }}>
                            {section.data.subtitle || "תת-כותרת"}
                          </p>
                          <button
                            className="px-6 py-3 rounded-lg font-semibold"
                            style={{
                              backgroundColor: section.data.buttonColor || "#ffffff",
                              color: section.data.buttonTextColor || "#6366f1",
                            }}
                          >
                            {section.data.ctaText || "כפתור"}
                          </button>
                        </div>
                      )}
                      {section.type === "features" && (
                        <div
                          className="rounded-lg p-6"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#f9fafb",
                          }}
                        >
                          <h3
                            className="text-2xl font-bold mb-6 text-center"
                            style={{ color: section.style?.textColor || "#000000" }}
                          >
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
                                <h4 className="font-semibold" style={{ color: section.style?.textColor || "#000000" }}>
                                  {item.title}
                                </h4>
                                <p className="text-sm" style={{ color: section.style?.textColor || "#666666", opacity: 0.8 }}>
                                  {item.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "testimonials" && (
                        <div
                          className="rounded-lg p-6"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#f9fafb",
                          }}
                        >
                          <h3
                            className="text-2xl font-bold mb-6 text-center"
                            style={{ color: section.style?.textColor || "#000000" }}
                          >
                            {section.data.title || "המלצות"}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {section.data.items?.map((item: any, i: number) => (
                              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="mb-3" style={{ color: section.style?.textColor || "#374151" }}>
                                  "{item.text || "המלצה"}"
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                                    {(item.name || "א")[0]}
                                  </div>
                                  <div>
                                    <p className="font-semibold" style={{ color: section.style?.textColor || "#000000" }}>
                                      {item.name || "שם"}
                                    </p>
                                    <p className="text-sm" style={{ color: section.style?.textColor || "#666666", opacity: 0.8 }}>
                                      {item.role || "תפקיד"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "about" && (
                        <div
                          className="flex items-center gap-6 rounded-lg p-6"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#ffffff",
                          }}
                        >
                          {section.data.imagePosition === "left" && section.data.image && (
                            <img src={section.data.image} alt="" className="w-48 h-48 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <h3
                              className="text-2xl font-bold mb-4"
                              style={{ color: section.style?.textColor || "#000000" }}
                            >
                              {section.data.title || "אודותינו"}
                            </h3>
                            <p
                              className="whitespace-pre-line"
                              style={{ color: section.style?.textColor || "#374151" }}
                            >
                              {section.data.content || "תוכן..."}
                            </p>
                          </div>
                          {section.data.imagePosition === "right" && section.data.image && (
                            <img src={section.data.image} alt="" className="w-48 h-48 rounded-lg object-cover" />
                          )}
                        </div>
                      )}
                      {section.type === "cta" && (
                        <div
                          className="text-center py-12 rounded-lg"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#6366f1",
                            color: section.style?.textColor || "#ffffff",
                          }}
                        >
                          <h3 className="text-3xl font-bold mb-4" style={{ color: section.style?.textColor || "#ffffff" }}>
                            {section.data.title || "מוכן להתחיל?"}
                          </h3>
                          <p className="text-xl mb-6 opacity-90" style={{ color: section.style?.textColor || "#ffffff" }}>
                            {section.data.description || "תיאור"}
                          </p>
                          <button
                            className="px-8 py-4 rounded-lg font-semibold text-lg"
                            style={{
                              backgroundColor: section.data.buttonColor || "#ffffff",
                              color: section.data.buttonTextColor || "#6366f1",
                            }}
                          >
                            {section.data.ctaText || "כפתור"}
                          </button>
                        </div>
                      )}
                      {section.type === "faq" && (
                        <div
                          className="rounded-lg p-6"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#f9fafb",
                          }}
                        >
                          <h3
                            className="text-2xl font-bold mb-6 text-center"
                            style={{ color: section.style?.textColor || "#000000" }}
                          >
                            {section.data.title || "שאלות נפוצות"}
                          </h3>
                          <div className="space-y-3">
                            {section.data.items?.map((item: any, i: number) => (
                              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-2" style={{ color: section.style?.textColor || "#000000" }}>
                                  {item.question || "שאלה?"}
                                </h4>
                                <p className="text-sm" style={{ color: section.style?.textColor || "#666666", opacity: 0.8 }}>
                                  {item.answer || "תשובה..."}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.type === "contact-form" && (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                          style={{
                            backgroundColor: section.style?.backgroundColor || "#ffffff",
                          }}
                        >
                          <h3
                            className="text-2xl font-bold mb-2"
                            style={{ color: section.style?.textColor || "#000000" }}
                          >
                            {section.data.title || "טופס יצירת קשר"}
                          </h3>
                          <p
                            className="mb-4"
                            style={{ color: section.style?.textColor || "#666666", opacity: 0.8 }}
                          >
                            {section.data.description || "תיאור"}
                          </p>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-gray-500 text-sm">טופס יופיע כאן</p>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Sections List & Settings */}
        <div className="w-80 bg-white border-r border-zinc-200 overflow-hidden flex flex-col shrink-0">
          {/* Sections List */}
          <div className="p-4 border-b border-zinc-200 overflow-y-auto flex-1">
            <h3 className="text-zinc-900 font-semibold mb-4 text-sm">סקשנים</h3>
            {sections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm mb-4">אין סקשנים עדיין</p>
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiPlus size={18} />
                  <span className="text-sm font-medium">הוסף סקשן ראשון</span>
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {sections.map((section, index) => {
                    const sectionIcons: Record<string, any> = {
                      hero: FiTarget,
                      features: FiZap,
                      testimonials: FiMessageCircle,
                      about: FiBook,
                      cta: FiSend,
                      "contact-form": FiMail,
                      faq: FiHelpCircle,
                    };
                    const IconComponent = sectionIcons[section.type] || FiTarget;
                    const sectionLabels: Record<string, string> = {
                      hero: "Hero",
                      features: "תכונות",
                      testimonials: "המלצות",
                      about: "אודות",
                      cta: "CTA",
                      "contact-form": "טופס יצירת קשר",
                      faq: "שאלות נפוצות",
                    };
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`w-full p-3 rounded-lg text-right transition-all duration-200 flex items-center gap-2 ${
                          selectedSectionId === section.id
                            ? "bg-zinc-900 text-white shadow-md"
                            : "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900"
                        }`}
                      >
                        <IconComponent size={18} />
                        <span className="text-sm font-medium flex-1">{sectionLabels[section.type] || section.type}</span>
                        <span className="text-xs opacity-60">#{index + 1}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Add Section Button */}
                <div className="mt-4 pt-4 border-t border-zinc-200">
                <button
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-zinc-900 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiPlus size={18} />
                  <span className="text-sm font-medium">הוסף סקשן</span>
                </button>
                </div>
              </>
            )}
          </div>

          {/* Section Settings */}
          {selectedSection && (
            <div className="p-4 border-t border-zinc-200 overflow-y-auto flex-1 max-h-[50vh]">
              <h3 className="text-zinc-900 font-semibold mb-4 text-sm">הגדרות סקשן</h3>
              <SectionSettings
                section={selectedSection}
                onUpdate={(updates) => updateSection(selectedSection.id, updates)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        title="בחר סוג סקשן"
      >
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
                className="w-full p-4 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-right transition-all duration-200 flex items-center gap-3 hover:shadow-md"
              >
                <IconComponent size={20} className="text-zinc-600" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}


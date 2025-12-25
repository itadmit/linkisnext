"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { IconPickerModal } from "@/components/dashboard/IconPickerModal";
import { IconRenderer } from "@/lib/icons";

interface Section {
  type: string;
  id: string;
  data: any;
  style?: any;
}

interface SectionSettingsProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
}

export function SectionSettings({ section, onUpdate }: SectionSettingsProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerIndex, setIconPickerIndex] = useState<number | null>(null);

  const updateData = (key: string, value: any) => {
    onUpdate({
      data: { ...section.data, [key]: value },
    });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      style: { ...section.style, [key]: value },
    });
  };

  return (
    <>
      <div className="space-y-4" dir="rtl">
        {/* Hero Section */}
        {section.type === "hero" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תת-כותרת
              </label>
              <input
                type="text"
                value={section.data.subtitle || ""}
                onChange={(e) => updateData("subtitle", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                טקסט כפתור
              </label>
              <input
                type="text"
                value={section.data.ctaText || ""}
                onChange={(e) => updateData("ctaText", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כתובת כפתור
              </label>
              <input
                type="text"
                value={section.data.ctaUrl || ""}
                onChange={(e) => updateData("ctaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תמונת רקע
              </label>
              <ImageUpload
                value={section.data.backgroundImage || ""}
                onChange={(url) => updateData("backgroundImage", url)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#6366f1"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע טקסט
              </label>
              <input
                type="color"
                value={section.style?.textColor || "#ffffff"}
                onChange={(e) => updateStyle("textColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                גודל כותרת
              </label>
              <select
                value={section.data.titleSize || "4xl"}
                onChange={(e) => updateData("titleSize", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="2xl">קטן</option>
                <option value="3xl">בינוני</option>
                <option value="4xl">גדול</option>
                <option value="5xl">גדול מאוד</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                יישור טקסט
              </label>
              <select
                value={section.data.textAlign || "center"}
                onChange={(e) => updateData("textAlign", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="right">ימין</option>
                <option value="center">מרכז</option>
                <option value="left">שמאל</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                גובה סקשן
              </label>
              <select
                value={section.data.height || "normal"}
                onChange={(e) => updateData("height", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="small">קטן</option>
                <option value="normal">רגיל</option>
                <option value="large">גדול</option>
                <option value="full">מסך מלא</option>
              </select>
            </div>
          </>
        )}

        {/* Features Section */}
        {section.type === "features" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת סקשן
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                מספר עמודות
              </label>
              <select
                value={section.data.columns || 3}
                onChange={(e) => updateData("columns", parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#f9fafb"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תכונות
              </label>
              <div className="space-y-2">
                {section.data.items?.map((item: any, index: number) => (
                  <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon && (
                        <IconRenderer iconValue={item.icon} size={20} className="text-zinc-600" />
                      )}
                      <button
                        onClick={() => {
                          setIconPickerIndex(index);
                          setIconPickerOpen(true);
                        }}
                        className="px-2 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded text-zinc-700 text-xs shadow-sm"
                      >
                        {item.icon ? "שנה אייקון" : "בחר אייקון"}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="כותרת"
                      value={item.title || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm mb-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="תיאור"
                      value={item.description || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(section.data.items || []), { icon: "FiStar", title: "", description: "" }];
                    updateData("items", newItems);
                  }}
                  className="w-full px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-sm shadow-sm transition-colors"
                >
                  + הוסף תכונה
                </button>
              </div>
            </div>
            {iconPickerIndex !== null && (
              <IconPickerModal
                isOpen={iconPickerOpen}
                onClose={() => {
                  setIconPickerOpen(false);
                  setIconPickerIndex(null);
                }}
                onSelect={(icon) => {
                  const newItems = [...(section.data.items || [])];
                  newItems[iconPickerIndex] = { ...newItems[iconPickerIndex], icon };
                  updateData("items", newItems);
                  setIconPickerOpen(false);
                  setIconPickerIndex(null);
                }}
                currentIcon={section.data.items?.[iconPickerIndex]?.icon}
              />
            )}
          </>
        )}

        {/* Testimonials Section */}
        {section.type === "testimonials" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת סקשן
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                מספר עמודות
              </label>
              <select
                value={section.data.columns || 2}
                onChange={(e) => updateData("columns", parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#f9fafb"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                המלצות
              </label>
              <div className="space-y-2">
                {section.data.items?.map((item: any, index: number) => (
                  <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 shadow-sm">
                    <div className="mb-2">
                      <ImageUpload
                        value={item.avatar || ""}
                        onChange={(url) => {
                          const newItems = [...(section.data.items || [])];
                          newItems[index] = { ...newItems[index], avatar: url };
                          updateData("items", newItems);
                        }}
                        label="תמונת פרופיל"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="שם"
                      value={item.name || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], name: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm mb-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="תפקיד"
                      value={item.role || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], role: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm mb-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                    <textarea
                      placeholder="המלצה"
                      value={item.text || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], text: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(section.data.items || []), { name: "", role: "", text: "", avatar: null }];
                    updateData("items", newItems);
                  }}
                  className="w-full px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-sm shadow-sm transition-colors"
                >
                  + הוסף המלצה
                </button>
              </div>
            </div>
          </>
        )}

        {/* About Section */}
        {section.type === "about" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תוכן
              </label>
              <textarea
                value={section.data.content || ""}
                onChange={(e) => updateData("content", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                rows={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תמונה
              </label>
              <ImageUpload
                value={section.data.image || ""}
                onChange={(url) => updateData("image", url)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                מיקום תמונה
              </label>
              <select
                value={section.data.imagePosition || "right"}
                onChange={(e) => updateData("imagePosition", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="left">שמאל</option>
                <option value="right">ימין</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#ffffff"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע טקסט
              </label>
              <input
                type="color"
                value={section.style?.textColor || "#000000"}
                onChange={(e) => updateStyle("textColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
          </>
        )}

        {/* CTA Section */}
        {section.type === "cta" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תיאור
              </label>
              <input
                type="text"
                value={section.data.description || ""}
                onChange={(e) => updateData("description", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                טקסט כפתור
              </label>
              <input
                type="text"
                value={section.data.ctaText || ""}
                onChange={(e) => updateData("ctaText", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כתובת כפתור
              </label>
              <input
                type="text"
                value={section.data.ctaUrl || ""}
                onChange={(e) => updateData("ctaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#6366f1"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע טקסט
              </label>
              <input
                type="color"
                value={section.style?.textColor || "#ffffff"}
                onChange={(e) => updateStyle("textColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע כפתור
              </label>
              <input
                type="color"
                value={section.data.buttonColor || "#ffffff"}
                onChange={(e) => updateData("buttonColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע טקסט כפתור
              </label>
              <input
                type="color"
                value={section.data.buttonTextColor || "#6366f1"}
                onChange={(e) => updateData("buttonTextColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
          </>
        )}

        {/* FAQ Section */}
        {section.type === "faq" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת סקשן
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#f9fafb"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                שאלות ותשובות
              </label>
              <div className="space-y-2">
                {section.data.items?.map((item: any, index: number) => (
                  <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 shadow-sm">
                    <input
                      type="text"
                      placeholder="שאלה"
                      value={item.question || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], question: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm mb-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    />
                    <textarea
                      placeholder="תשובה"
                      value={item.answer || ""}
                      onChange={(e) => {
                        const newItems = [...(section.data.items || [])];
                        newItems[index] = { ...newItems[index], answer: e.target.value };
                        updateData("items", newItems);
                      }}
                      className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newItems = [...(section.data.items || []), { question: "", answer: "" }];
                    updateData("items", newItems);
                  }}
                  className="w-full px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-sm shadow-sm transition-colors"
                >
                  + הוסף שאלה
                </button>
              </div>
            </div>
          </>
        )}

        {/* Contact Form Section */}
        {section.type === "contact-form" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                כותרת
              </label>
              <input
                type="text"
                value={section.data.title || ""}
                onChange={(e) => updateData("title", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                תיאור
              </label>
              <textarea
                value={section.data.description || ""}
                onChange={(e) => updateData("description", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                צבע רקע
              </label>
              <input
                type="color"
                value={section.style?.backgroundColor || "#ffffff"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                שדות טופס
              </label>
              <div className="space-y-2">
                {["name", "email", "phone", "message"].map((field) => (
                  <label key={field} className="flex items-center gap-2 text-zinc-700 text-sm">
                    <input
                      type="checkbox"
                      checked={section.data.formFields?.includes(field) ?? true}
                      onChange={(e) => {
                        const currentFields = section.data.formFields || ["name", "email", "phone", "message"];
                        const newFields = e.target.checked
                          ? [...currentFields, field]
                          : currentFields.filter((f: string) => f !== field);
                        updateData("formFields", newFields);
                      }}
                      className="rounded"
                    />
                    <span>
                      {field === "name" ? "שם" :
                       field === "email" ? "אימייל" :
                       field === "phone" ? "טלפון" :
                       "הודעה"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}


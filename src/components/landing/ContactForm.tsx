"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface ContactFormProps {
  landingPageId: string;
  formFields: string[];
}

export function ContactForm({ landingPageId, formFields }: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landingPageId,
          formData,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "שגיאה בשליחת הטופס");
      }

      toast.success("הטופס נשלח בהצלחה! נחזור אליך בהקדם.");
      setIsSubmitted(true);
      setFormData({});
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <FiCheck className="text-green-500 text-5xl mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          תודה על פנייתך!
        </h3>
        <p className="text-green-700">
          נחזור אליך בהקדם האפשרי
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {formFields.includes("name") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            dir="rtl"
          />
        </div>
      )}

      {formFields.includes("email") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            אימייל <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            dir="ltr"
          />
        </div>
      )}

      {formFields.includes("phone") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            טלפון
          </label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            dir="ltr"
          />
        </div>
      )}

      {formFields.includes("message") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הודעה
          </label>
          <textarea
            value={formData.message || ""}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={5}
            dir="rtl"
          />
        </div>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
        style={{
          backgroundColor: "#6366f1",
          color: "#ffffff",
        }}
      >
        שלח הודעה
      </Button>
    </form>
  );
}



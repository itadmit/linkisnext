"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IconPicker } from "@/components/dashboard/IconPicker";
import { FiClock } from "react-icons/fi";

interface Link {
  id?: string;
  title: string;
  url: string;
  icon: string | null;
  couponCode: string | null;
  discountDescription: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

interface LinkFormProps {
  link?: Link | null;
  onSubmit: (link: Omit<Link, "id"> & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LinkForm({ link, onSubmit, onCancel, isLoading }: LinkFormProps) {
  const [formData, setFormData] = useState<Link>({
    title: "",
    url: "",
    icon: "FiLink",
    couponCode: null,
    discountDescription: null,
    startsAt: null,
    endsAt: null,
  });
  const [showScheduling, setShowScheduling] = useState(false);

  useEffect(() => {
    if (link) {
      // Convert ISO date strings to datetime-local format (YYYY-MM-DDTHH:mm)
      const formatForInput = (dateString: string | null) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          // Get local date/time components
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return "";
        }
      };

      setFormData({
        title: link.title,
        url: link.url,
        icon: link.icon || "FiLink",
        couponCode: link.couponCode,
        discountDescription: link.discountDescription || null,
        startsAt: formatForInput(link.startsAt),
        endsAt: formatForInput(link.endsAt),
      });
      setShowScheduling(!!(link.startsAt || link.endsAt));
    }
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...(link?.id && { id: link.id }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Icon Selection */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          אייקון
        </label>
        <IconPicker
          value={formData.icon}
          onChange={(icon) => setFormData({ ...formData, icon })}
        />
      </div>

      {/* Title */}
      <Input
        label="כותרת"
        placeholder="שם הלינק"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      {/* URL */}
      <Input
        label="כתובת URL"
        type="url"
        placeholder="https://example.com"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        required
        dir="ltr"
        className="text-left"
      />

      {/* Coupon Code */}
      <Input
        label="קוד קופון (אופציונלי)"
        placeholder="SAVE20"
        value={formData.couponCode || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            couponCode: e.target.value || null,
          })
        }
        dir="ltr"
        className="text-left"
      />
      
      {/* Discount Description - Only show if coupon code exists */}
      {formData.couponCode && (
        <>
          <Input
            label="פירוט הנחה (אופציונלי)"
            placeholder="20% הנחה, 50 ש״ח הנחה, הנחה משתנה"
            value={formData.discountDescription || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountDescription: e.target.value || null,
              })
            }
          />
          <p className="text-sm text-amber-400">
            * יופיע כפתור להעתקת הקופון לפני המעבר לאתר
          </p>
        </>
      )}

      {/* Scheduling Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowScheduling(!showScheduling)}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <FiClock size={16} />
          {showScheduling ? "הסתר תזמון" : "הוסף תזמון"}
        </button>
      </div>

      {/* Scheduling Fields */}
      {showScheduling && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="מתאריך"
              type="datetime-local"
              value={formData.startsAt || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startsAt: e.target.value || null,
                })
              }
              dir="ltr"
              className="text-left"
            />
            <Input
              label="עד תאריך"
              type="datetime-local"
              value={formData.endsAt || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endsAt: e.target.value || null,
                })
              }
              dir="ltr"
              className="text-left"
            />
          </div>
          {(formData.startsAt || formData.endsAt) && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-sm text-indigo-300">
              <p className="font-medium mb-1">ℹ️ מידע על תזמון:</p>
              {formData.startsAt && (
                <p>הלינק יופיע החל מ: {new Date(formData.startsAt).toLocaleString("he-IL")}</p>
              )}
              {formData.endsAt && (
                <p>הלינק יופיע עד: {new Date(formData.endsAt).toLocaleString("he-IL")}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {link ? "עדכן לינק" : "הוסף לינק"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </form>
  );
}


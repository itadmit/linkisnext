"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IconPicker } from "@/components/dashboard/IconPicker";
import { FiClock, FiInfo } from "react-icons/fi";

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
      <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
        <label className="block text-sm font-medium text-zinc-900 mb-3">
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
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">
              * יופיע כפתור להעתקת הקופון לפני המעבר לאתר
            </p>
          </div>
        </>
      )}

      {/* Scheduling Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowScheduling(!showScheduling)}
          className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 px-4 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white transition-all duration-200 cursor-pointer active:scale-95"
        >
          <FiClock size={16} />
          {showScheduling ? "הסתר תזמון" : "הוסף תזמון"}
        </button>
      </div>

      {/* Scheduling Fields */}
      {showScheduling && (
        <div className="space-y-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50/30">
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
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <FiInfo size={18} />
                מידע על תזמון:
              </p>
              {formData.startsAt && (
                <p className="mb-1">הלינק יופיע החל מ: <span className="font-medium">{new Date(formData.startsAt).toLocaleString("he-IL")}</span></p>
              )}
              {formData.endsAt && (
                <p>הלינק יופיע עד: <span className="font-medium">{new Date(formData.endsAt).toLocaleString("he-IL")}</span></p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-zinc-200">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {link ? "עדכן לינק" : "הוסף לינק"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="border-2">
          ביטול
        </Button>
      </div>
    </form>
  );
}


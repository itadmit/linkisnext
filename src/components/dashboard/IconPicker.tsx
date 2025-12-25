"use client";

import { useState } from "react";
import {
  FiLink,
  FiGlobe,
  FiHome,
  FiMail,
  FiPhone,
  FiYoutube,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiShoppingCart,
  FiBriefcase,
  FiMusic,
  FiCamera,
  FiHeart,
  FiStar,
  FiGift,
  FiMapPin,
  FiShare2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

// 20 אייקונים בסיסיים בלבד
const SIMPLE_ICONS = [
  { name: "לינק", icon: FiLink, value: "FiLink" },
  { name: "גלובוס", icon: FiGlobe, value: "FiGlobe" },
  { name: "בית", icon: FiHome, value: "FiHome" },
  { name: "אימייל", icon: FiMail, value: "FiMail" },
  { name: "טלפון", icon: FiPhone, value: "FiPhone" },
  { name: "יוטיוב", icon: FiYoutube, value: "FiYoutube" },
  { name: "אינסטגרם", icon: FiInstagram, value: "FiInstagram" },
  { name: "טוויטר", icon: FiTwitter, value: "FiTwitter" },
  { name: "פייסבוק", icon: FiFacebook, value: "FiFacebook" },
  { name: "לינקדאין", icon: FiLinkedin, value: "FiLinkedin" },
  { name: "גיטהאב", icon: FiGithub, value: "FiGithub" },
  { name: "קניות", icon: FiShoppingCart, value: "FiShoppingCart" },
  { name: "עסקים", icon: FiBriefcase, value: "FiBriefcase" },
  { name: "מוזיקה", icon: FiMusic, value: "FiMusic" },
  { name: "מצלמה", icon: FiCamera, value: "FiCamera" },
  { name: "לב", icon: FiHeart, value: "FiHeart" },
  { name: "כוכב", icon: FiStar, value: "FiStar" },
  { name: "מתנה", icon: FiGift, value: "FiGift" },
  { name: "מיקום", icon: FiMapPin, value: "FiMapPin" },
  { name: "שיתוף", icon: FiShare2, value: "FiShare2" },
];

interface IconPickerProps {
  value: string | null;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [showAll, setShowAll] = useState(false);
  
  const visibleIcons = showAll ? SIMPLE_ICONS : SIMPLE_ICONS.slice(0, 5);
  const remainingCount = SIMPLE_ICONS.length - 5;

  return (
    <div className="space-y-3" dir="rtl">
      {/* Icons Grid */}
      <div className="grid grid-cols-5 gap-3 p-3 bg-white rounded-xl border border-zinc-200">
        {visibleIcons.map((iconData) => {
          const IconComponent = iconData.icon;
          const isSelected = value === iconData.value;

          return (
            <button
              key={iconData.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(iconData.value);
              }}
              className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isSelected
                  ? "bg-zinc-900 ring-2 ring-zinc-900"
                  : "bg-white hover:bg-zinc-50 active:scale-95 border border-zinc-200"
              }`}
              title={iconData.name}
            >
              <IconComponent
                size={24}
                className={isSelected ? "text-white" : "text-zinc-600"}
              />
            </button>
          );
        })}
      </div>

      {/* Show More Button */}
      {!showAll && remainingCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAll(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg border border-zinc-200 transition-all duration-200 cursor-pointer"
        >
          <span>הצג עוד {remainingCount} אייקונים</span>
          <FiChevronDown size={16} />
        </button>
      )}

      {/* Show Less Button */}
      {showAll && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAll(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg border border-zinc-200 transition-all duration-200 cursor-pointer"
        >
          <span>הצג פחות</span>
          <FiChevronUp size={16} />
        </button>
      )}
    </div>
  );
}

// Export icon mapping for use in other components
export const ICON_MAP: Record<string, any> = {};
SIMPLE_ICONS.forEach((icon) => {
  ICON_MAP[icon.value] = icon.icon;
});


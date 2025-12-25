"use client";

import { useState } from "react";
import {
  FiLink,
  FiGlobe,
  FiBriefcase,
  FiSmartphone,
  FiMonitor,
  FiMusic,
  FiCamera,
  FiShoppingCart,
  FiDollarSign,
  FiGift,
  FiMail,
  FiPhone,
  FiHome,
  FiBook,
  FiZap,
  FiStar,
  FiHeart,
  FiTrendingUp,
  FiTarget,
  FiVolume2,
  FiYoutube,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiMessageCircle,
  FiVideo,
  FiImage,
  FiFileText,
  FiDownload,
  FiUpload,
  FiShare2,
  FiSettings,
  FiUser,
  FiUsers,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiCompass,
  FiSearch,
  FiBell,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash,
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiRefreshCw,
  FiRotateCw,
  FiSave,
  FiCopy,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSpotify,
  FaPinterest,
  FaSnapchat,
  FaTwitch,
  FaApple,
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaPaypal,
  FaStripe,
} from "react-icons/fa";
import {
  SiShopify,
  SiWoo,
  SiEtsy,
} from "react-icons/si";

const ICON_CATEGORIES = {
  כללי: [
    { name: "לינק", icon: FiLink, value: "FiLink" },
    { name: "גלובוס", icon: FiGlobe, value: "FiGlobe" },
    { name: "בית", icon: FiHome, value: "FiHome" },
    { name: "ניווט", icon: FiNavigation, value: "FiNavigation" },
    { name: "מצפן", icon: FiCompass, value: "FiCompass" },
    { name: "מיקום", icon: FiMapPin, value: "FiMapPin" },
  ],
  עסקים: [
    { name: "תיק", icon: FiBriefcase, value: "FiBriefcase" },
    { name: "קניות", icon: FiShoppingCart, value: "FiShoppingCart" },
    { name: "כסף", icon: FiDollarSign, value: "FiDollarSign" },
    { name: "מתנה", icon: FiGift, value: "FiGift" },
    { name: "מטרה", icon: FiTarget, value: "FiTarget" },
    { name: "עלייה", icon: FiTrendingUp, value: "FiTrendingUp" },
  ],
  מדיה: [
    { name: "יוטיוב", icon: FiYoutube, value: "FiYoutube" },
    { name: "אינסטגרם", icon: FiInstagram, value: "FiInstagram" },
    { name: "טוויטר", icon: FiTwitter, value: "FiTwitter" },
    { name: "פייסבוק", icon: FiFacebook, value: "FiFacebook" },
    { name: "לינקדאין", icon: FiLinkedin, value: "FiLinkedin" },
    { name: "טיקטוק", icon: FaTiktok, value: "FaTiktok" },
    { name: "וואטסאפ", icon: FaWhatsapp, value: "FaWhatsapp" },
    { name: "טלגרם", icon: FaTelegram, value: "FaTelegram" },
    { name: "דיסקורד", icon: FaDiscord, value: "FaDiscord" },
    { name: "ספוטיפיי", icon: FaSpotify, value: "FaSpotify" },
    { name: "פינטרסט", icon: FaPinterest, value: "FaPinterest" },
    { name: "סנאפצ'אט", icon: FaSnapchat, value: "FaSnapchat" },
    { name: "טוויץ'", icon: FaTwitch, value: "FaTwitch" },
    { name: "גיטהאב", icon: FiGithub, value: "FiGithub" },
  ],
  תוכן: [
    { name: "מוזיקה", icon: FiMusic, value: "FiMusic" },
    { name: "מצלמה", icon: FiCamera, value: "FiCamera" },
    { name: "וידאו", icon: FiVideo, value: "FiVideo" },
    { name: "תמונה", icon: FiImage, value: "FiImage" },
    { name: "מסמך", icon: FiFileText, value: "FiFileText" },
    { name: "הורדה", icon: FiDownload, value: "FiDownload" },
    { name: "העלאה", icon: FiUpload, value: "FiUpload" },
    { name: "שיתוף", icon: FiShare2, value: "FiShare2" },
  ],
  תקשורת: [
    { name: "אימייל", icon: FiMail, value: "FiMail" },
    { name: "טלפון", icon: FiPhone, value: "FiPhone" },
    { name: "הודעה", icon: FiMessageCircle, value: "FiMessageCircle" },
    { name: "פעמון", icon: FiBell, value: "FiBell" },
  ],
  טכנולוגיה: [
    { name: "סמארטפון", icon: FiSmartphone, value: "FiSmartphone" },
    { name: "מחשב", icon: FiMonitor, value: "FiMonitor" },
    { name: "ברק", icon: FiZap, value: "FiZap" },
    { name: "רקטה", icon: FiZap, value: "FiZap" },
    { name: "אפל", icon: FaApple, value: "FaApple" },
    { name: "גוגל", icon: FaGoogle, value: "FaGoogle" },
    { name: "מיקרוסופט", icon: FaMicrosoft, value: "FaMicrosoft" },
  ],
  תשלומים: [
    { name: "פייפאל", icon: FaPaypal, value: "FaPaypal" },
    { name: "סטרייף", icon: FaStripe, value: "FaStripe" },
    { name: "אמזון", icon: FaAmazon, value: "FaAmazon" },
    { name: "שופיפיי", icon: SiShopify, value: "SiShopify" },
    { name: "ווקומרס", icon: SiWoo, value: "SiWoo" },
    { name: "אטסי", icon: SiEtsy, value: "SiEtsy" },
  ],
  אחר: [
    { name: "כוכב", icon: FiStar, value: "FiStar" },
    { name: "לב", icon: FiHeart, value: "FiHeart" },
    { name: "חגיגה", icon: FiGift, value: "FiGift" },
    { name: "מגפון", icon: FiVolume2, value: "FiVolume2" },
    { name: "ספר", icon: FiBook, value: "FiBook" },
    { name: "לוח שנה", icon: FiCalendar, value: "FiCalendar" },
    { name: "שעון", icon: FiClock, value: "FiClock" },
    { name: "חיפוש", icon: FiSearch, value: "FiSearch" },
  ],
};

interface IconPickerProps {
  value: string | null;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("כללי");
  const [searchTerm, setSearchTerm] = useState("");

  // Get icon component from string value
  const getIconComponent = (iconValue: string) => {
    const allIcons = Object.values(ICON_CATEGORIES).flat();
    const iconData = allIcons.find((icon) => icon.value === iconValue);
    return iconData?.icon || FiLink;
  };

  // Filter icons by search
  const filteredIcons = ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES].filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4" dir="rtl">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="חפש אייקון..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(ICON_CATEGORIES).map((category) => (
          <button
            key={category}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedCategory(category);
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
        {filteredIcons.map((iconData) => {
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
              className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? "bg-indigo-600 scale-110 shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-400"
                  : "bg-white/10 hover:bg-white/20 hover:scale-105"
              }`}
              title={iconData.name}
            >
              <IconComponent
                size={24}
                className={isSelected ? "text-white" : "text-white/70"}
              />
            </button>
          );
        })}
      </div>

      {/* Selected Icon Preview */}
      {value && (
        <div className="flex items-center gap-3 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            {(() => {
              const IconComponent = getIconComponent(value);
              return <IconComponent size={24} className="text-white" />;
            })()}
          </div>
          <div className="flex-1 text-right">
            <p className="text-white font-medium">אייקון נבחר</p>
            <p className="text-white/60 text-sm">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export icon mapping for use in other components
export const ICON_MAP: Record<string, any> = {};
Object.values(ICON_CATEGORIES).flat().forEach((icon) => {
  ICON_MAP[icon.value] = icon.icon;
});


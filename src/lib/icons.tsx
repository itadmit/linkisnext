import React from "react";
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

// Icon mapping - maps string values to icon components
export const ICON_MAP: Record<string, React.ComponentType<any>> = {
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
  SiShopify,
  SiWoo,
  SiEtsy,
};

// Default icon if icon string is not found
const DefaultIcon = FiLink;

/**
 * Renders an icon component based on a string value
 * @param iconValue - The icon string value (e.g., "FiLink", "FaGithub")
 * @param props - Props to pass to the icon component (size, className, etc.)
 */
export function IconRenderer({
  iconValue,
  ...props
}: {
  iconValue: string | null | undefined;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!iconValue) {
    return <DefaultIcon {...props} />;
  }

  // Check if it's an emoji (legacy support)
  if (iconValue.length <= 2 && /[\u{1F300}-\u{1F9FF}]/u.test(iconValue)) {
    return <span className="text-2xl" {...props}>{iconValue}</span>;
  }

  const IconComponent = ICON_MAP[iconValue] || DefaultIcon;
  return <IconComponent {...props} />;
}


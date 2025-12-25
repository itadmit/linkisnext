"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiLinkedin,
  FiGithub,
  FiMail,
  FiPhone,
  FiGlobe,
  FiPlus,
  FiTrash2,
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
} from "react-icons/fa";

const SOCIAL_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: FiInstagram, color: "#E4405F", placeholder: "instagram.com/username" },
  { id: "twitter", name: "Twitter / X", icon: FiTwitter, color: "#1DA1F2", placeholder: "x.com/username" },
  { id: "facebook", name: "Facebook", icon: FiFacebook, color: "#1877F2", placeholder: "facebook.com/username" },
  { id: "youtube", name: "YouTube", icon: FiYoutube, color: "#FF0000", placeholder: "youtube.com/@channel" },
  { id: "tiktok", name: "TikTok", icon: FaTiktok, color: "#000000", placeholder: "tiktok.com/@username" },
  { id: "linkedin", name: "LinkedIn", icon: FiLinkedin, color: "#0A66C2", placeholder: "linkedin.com/in/username" },
  { id: "github", name: "GitHub", icon: FiGithub, color: "#333333", placeholder: "github.com/username" },
  { id: "whatsapp", name: "WhatsApp", icon: FaWhatsapp, color: "#25D366", placeholder: "wa.me/972501234567" },
  { id: "telegram", name: "Telegram", icon: FaTelegram, color: "#0088CC", placeholder: "t.me/username" },
  { id: "discord", name: "Discord", icon: FaDiscord, color: "#5865F2", placeholder: "discord.gg/invite" },
  { id: "spotify", name: "Spotify", icon: FaSpotify, color: "#1DB954", placeholder: "open.spotify.com/artist/..." },
  { id: "pinterest", name: "Pinterest", icon: FaPinterest, color: "#E60023", placeholder: "pinterest.com/username" },
  { id: "snapchat", name: "Snapchat", icon: FaSnapchat, color: "#FFFC00", placeholder: "snapchat.com/add/username" },
  { id: "twitch", name: "Twitch", icon: FaTwitch, color: "#9146FF", placeholder: "twitch.tv/username" },
  { id: "email", name: "Email", icon: FiMail, color: "#EA4335", placeholder: "mailto:email@example.com" },
  { id: "phone", name: "Phone", icon: FiPhone, color: "#34A853", placeholder: "tel:+972501234567" },
  { id: "website", name: "Website", icon: FiGlobe, color: "#6366F1", placeholder: "https://yourwebsite.com" },
];

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinks({ links, onChange }: SocialLinksProps) {
  const [showPlatforms, setShowPlatforms] = useState(false);

  const addLink = (platformId: string) => {
    if (!links.find((l) => l.platform === platformId)) {
      onChange([...links, { platform: platformId, url: "" }]);
    }
    setShowPlatforms(false);
  };

  const removeLink = (platformId: string) => {
    onChange(links.filter((l) => l.platform !== platformId));
  };

  const updateUrl = (platformId: string, url: string) => {
    onChange(
      links.map((l) => (l.platform === platformId ? { ...l, url } : l))
    );
  };

  const getPlatform = (id: string) => SOCIAL_PLATFORMS.find((p) => p.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowPlatforms(!showPlatforms)}
        >
          <FiPlus className="ml-2" />
          הוסף רשת חברתית
        </Button>
      </div>

      {/* Platform Picker */}
      {showPlatforms && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
          {SOCIAL_PLATFORMS.filter(
            (p) => !links.find((l) => l.platform === p.id)
          ).map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => addLink(platform.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white transition-colors"
            >
              <platform.icon
                size={24}
                style={{ color: platform.color }}
              />
              <span className="text-xs text-zinc-600">{platform.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Added Links */}
      <div className="space-y-3">
        {links.map((link) => {
          const platform = getPlatform(link.platform);
          if (!platform) return null;

          return (
            <div
              key={link.platform}
              className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: platform.color + "20" }}
              >
                <platform.icon size={20} style={{ color: platform.color }} />
              </div>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateUrl(link.platform, e.target.value)}
                placeholder={platform.placeholder}
                className="flex-1 bg-transparent border-none text-zinc-900 placeholder-zinc-400 focus:outline-none text-sm focus:ring-0"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => removeLink(link.platform)}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {links.length === 0 && !showPlatforms && (
        <p className="text-zinc-500 text-sm text-center py-4">
          לחץ על &quot;הוסף רשת חברתית&quot; כדי להוסיף לינקים לרשתות שלך
        </p>
      )}
    </div>
  );
}

export { SOCIAL_PLATFORMS };


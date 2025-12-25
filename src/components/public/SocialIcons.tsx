"use client";

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

const ICONS: Record<string, any> = {
  instagram: FiInstagram,
  twitter: FiTwitter,
  facebook: FiFacebook,
  youtube: FiYoutube,
  tiktok: FaTiktok,
  linkedin: FiLinkedin,
  github: FiGithub,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  discord: FaDiscord,
  spotify: FaSpotify,
  pinterest: FaPinterest,
  snapchat: FaSnapchat,
  twitch: FaTwitch,
  email: FiMail,
  phone: FiPhone,
  website: FiGlobe,
};

const COLORS: Record<string, string> = {
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
  linkedin: "#0A66C2",
  github: "#333333",
  whatsapp: "#25D366",
  telegram: "#0088CC",
  discord: "#5865F2",
  spotify: "#1DB954",
  pinterest: "#E60023",
  snapchat: "#FFFC00",
  twitch: "#9146FF",
  email: "#EA4335",
  phone: "#34A853",
  website: "#6366F1",
};

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialIconsProps {
  links: SocialLink[];
  textColor: string;
}

export function SocialIcons({ links, textColor }: SocialIconsProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        const color = COLORS[link.platform];
        
        if (!Icon || !link.url) return null;

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              backgroundColor: color + "20",
              color: color,
            }}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}


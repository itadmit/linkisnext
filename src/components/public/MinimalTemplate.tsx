"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiGift, FiArrowRight } from "react-icons/fi";
import { SocialIcons } from "@/components/public/SocialIcons";
import { SocialShare } from "@/components/public/SocialShare";
import { IconRenderer } from "@/lib/icons";
import toast from "react-hot-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  couponCode: string | null;
  discountDescription: string | null;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface User {
  id: string;
  name: string | null;
  slug: string;
  bio: string | null;
  avatar: string | null;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  socialLinks?: string | null;
  links: Link[];
}

interface MinimalTemplateProps {
  user: User;
}

export function MinimalTemplate({ user }: MinimalTemplateProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const socialLinks: SocialLink[] = user.socialLinks
    ? JSON.parse(user.socialLinks)
    : [];

  const handleLinkClick = async (link: Link) => {
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: link.id, userId: user.id }),
      });
    } catch (error) {
      console.error("Failed to track click:", error);
    }
  };

  const handleCouponClick = async (link: Link) => {
    if (!link.couponCode) return;

    await navigator.clipboard.writeText(link.couponCode);
    setCopiedId(link.id);
    toast.success("קוד קופון הועתק!");

    handleLinkClick(link);

    setTimeout(() => {
      window.open(link.url, "_blank");
      setCopiedId(null);
    }, 1500);
  };

  const handleRegularClick = (link: Link) => {
    handleLinkClick(link);
    window.open(link.url, "_blank");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: user.backgroundColor }}
    >
      <div className="max-w-md w-full">
        {/* Profile */}
        <div
          className={`text-center mb-12 ${
            mounted ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || user.slug}
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-light"
              style={{
                backgroundColor: user.buttonColor,
                color: user.buttonTextColor,
              }}
            >
              {(user.name || user.slug).charAt(0).toUpperCase()}
            </div>
          )}

          <h1
            className="text-3xl font-light mb-3"
            style={{ color: user.textColor }}
          >
            {user.name || user.slug}
          </h1>

          {user.bio && (
            <p
              className="text-sm opacity-70 mb-6 max-w-xs mx-auto"
              style={{ color: user.textColor }}
            >
              {user.bio}
            </p>
          )}

          <SocialIcons links={socialLinks} textColor={user.textColor} />

          <div className="mt-6 flex justify-center">
            <SocialShare
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={user.name || user.slug}
              description={user.bio || undefined}
            />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {user.links.map((link, index) => (
            <div
              key={link.id}
              className={`${
                mounted ? "animate-slide-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {link.couponCode ? (
                <button
                  onClick={() => handleCouponClick(link)}
                  className="w-full text-right py-4 px-6 border-b transition-colors hover:bg-white/5"
                  style={{
                    color: user.textColor,
                    borderColor: `${user.textColor}20`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {link.icon && (
                        <span className="text-xl">
                          <IconRenderer iconValue={link.icon} />
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{link.title}</div>
                        {link.discountDescription && (
                          <div className="text-xs opacity-60 mt-1">
                            {link.discountDescription}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {copiedId === link.id ? (
                        <span className="text-xs text-emerald-500">הועתק</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-600">
                          {link.couponCode}
                        </span>
                      )}
                      <FiArrowRight className="opacity-40" />
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleRegularClick(link)}
                  className="w-full text-right py-4 px-6 border-b transition-colors hover:bg-white/5 flex items-center justify-between"
                  style={{
                    color: user.textColor,
                    borderColor: `${user.textColor}20`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {link.icon && (
                      <span className="text-xl">
                        <IconRenderer iconValue={link.icon} />
                      </span>
                    )}
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <FiArrowRight className="opacity-40" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


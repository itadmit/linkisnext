"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiGift } from "react-icons/fi";
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

interface CardTemplateProps {
  user: User;
}

export function CardTemplate({ user }: CardTemplateProps) {
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
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: user.backgroundColor }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl p-8 mb-8 ${
            mounted ? "animate-fade-in" : "opacity-0"
          }`}
          style={{ color: user.textColor }}
        >
          <div className="text-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.slug}
                className="w-28 h-28 rounded-full mx-auto mb-6 object-cover ring-4 ring-offset-4"
                style={{
                  "--tw-ring-color": user.buttonColor,
                  "--tw-ring-offset-color": user.backgroundColor,
                } as React.CSSProperties}
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold"
                style={{
                  backgroundColor: user.buttonColor,
                  color: user.buttonTextColor,
                }}
              >
                {(user.name || user.slug).charAt(0).toUpperCase()}
              </div>
            )}

            <h1 className="text-3xl font-bold mb-3" style={{ color: user.textColor }}>
              {user.name || user.slug}
            </h1>

            {user.bio && (
              <p className="text-zinc-600 mb-6 max-w-md mx-auto">{user.bio}</p>
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
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.links.map((link, index) => (
            <div
              key={link.id}
              className={`${
                mounted ? "animate-slide-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.couponCode ? (
                <button
                  onClick={() => handleCouponClick(link)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-right"
                >
                  <div className="flex items-start justify-between mb-3">
                    {link.icon && (
                      <div className="text-3xl">
                        <IconRenderer iconValue={link.icon} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{link.title}</div>
                      {link.discountDescription && (
                        <div className="text-sm text-zinc-600">
                          {link.discountDescription}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    {copiedId === link.id ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-2">
                        <FiCheck />
                        הועתק!
                      </span>
                    ) : (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: user.buttonColor,
                          color: user.buttonTextColor,
                        }}
                      >
                        <FiGift className="inline ml-1" />
                        {link.couponCode}
                      </span>
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleRegularClick(link)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-right"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {link.icon && (
                        <div className="text-3xl">
                          <IconRenderer iconValue={link.icon} />
                        </div>
                      )}
                      <div className="font-bold text-lg">{link.title}</div>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: user.buttonColor }}
                    >
                      →
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


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

interface ModernTemplateProps {
  user: User;
}

export function ModernTemplate({ user }: ModernTemplateProps) {
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
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: user.backgroundColor }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-lg mx-auto">
          {/* Profile */}
          <div
            className={`text-center mb-12 ${
              mounted ? "animate-fade-in" : "opacity-0"
            }`}
          >
            {user.avatar ? (
              <div className="relative inline-block mb-6">
                <img
                  src={user.avatar}
                  alt={user.name || user.slug}
                  className="w-32 h-32 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center text-6xl font-bold shadow-2xl ring-4 ring-white/20"
                style={{
                  backgroundColor: user.buttonColor,
                  color: user.buttonTextColor,
                }}
              >
                {(user.name || user.slug).charAt(0).toUpperCase()}
              </div>
            )}

            <h1
              className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              {user.name || user.slug}
            </h1>

            {user.bio && (
              <p
                className="text-lg opacity-90 max-w-md mx-auto mb-6"
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
          <div className="space-y-4">
            {user.links.map((link, index) => (
              <div
                key={link.id}
                className={`${
                  mounted ? "animate-slide-up" : "opacity-0"
                } group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.couponCode ? (
                  <button
                    onClick={() => handleCouponClick(link)}
                    className="w-full relative overflow-hidden rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    style={{ color: user.textColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {link.icon && (
                          <div className="text-3xl">
                            <IconRenderer iconValue={link.icon} />
                          </div>
                        )}
                        <div className="text-right">
                          <div className="font-bold text-lg">{link.title}</div>
                          {link.discountDescription && (
                            <div className="text-sm opacity-80">
                              {link.discountDescription}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold">
                        {copiedId === link.id ? (
                          <>
                            <FiCheck />
                            <span>הועתק!</span>
                          </>
                        ) : (
                          <>
                            <FiGift />
                            <span>{link.couponCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegularClick(link)}
                    className="w-full relative overflow-hidden rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    style={{ color: user.textColor }}
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
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: user.buttonColor }}
                      >
                        <span style={{ color: user.buttonTextColor }}>→</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


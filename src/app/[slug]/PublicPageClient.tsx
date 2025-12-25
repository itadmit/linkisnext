"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";
import { SocialIcons } from "@/components/public/SocialIcons";
import { IconRenderer } from "@/lib/icons";
import toast from "react-hot-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  couponCode: string | null;
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
  buttonStyle?: string;
  backgroundStyle?: string;
  socialLinks?: string | null;
  links: Link[];
}

interface PublicPageClientProps {
  user: User;
}

export function PublicPageClient({ user }: PublicPageClientProps) {
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

  const getButtonClass = () => {
    const baseClass = "w-full group relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]";
    switch (user.buttonStyle) {
      case "pill":
        return `${baseClass} rounded-full`;
      case "square":
        return `${baseClass} rounded-none`;
      case "outline":
        return `${baseClass} rounded-xl border-2 bg-transparent`;
      default:
        return `${baseClass} rounded-xl`;
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: user.backgroundColor }}
    >
      {/* Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Profile */}
          <div
            className={`text-center mb-8 ${
              mounted ? "animate-bounce-in" : "opacity-0"
            }`}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.slug}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{
                  // @ts-ignore
                  "--tw-ring-color": user.buttonColor + "40",
                  boxShadow: `0 20px 40px ${user.buttonColor}30`,
                } as React.CSSProperties}
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl ring-4 shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundColor: user.buttonColor,
                  color: user.buttonTextColor,
                  // @ts-ignore
                  "--tw-ring-color": user.buttonColor + "40",
                  boxShadow: `0 20px 40px ${user.buttonColor}30`,
                } as React.CSSProperties}
              >
                {(user.name || user.slug).charAt(0).toUpperCase()}
              </div>
            )}
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: user.textColor }}
            >
              {user.name || user.slug}
            </h1>
            {user.bio && (
              <p
                className="opacity-80 max-w-xs mx-auto leading-relaxed"
                style={{ color: user.textColor }}
              >
                {user.bio}
              </p>
            )}

            {/* Social Icons */}
            <SocialIcons links={socialLinks} textColor={user.textColor} />
          </div>

          {/* Links */}
          <div className="space-y-4">
            {user.links.map((link, index) => (
              <div
                key={link.id}
                className={`${mounted ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {link.couponCode ? (
                  // Coupon Link
                  <button
                    onClick={() => handleCouponClick(link)}
                    className={`w-full group relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] ${getButtonClass()}`}
                    style={{
                      backgroundColor:
                        user.buttonStyle === "outline"
                          ? "transparent"
                          : user.buttonColor,
                      color: user.buttonTextColor,
                      borderColor:
                        user.buttonStyle === "outline"
                          ? user.buttonColor
                          : undefined,
                      boxShadow: `0 10px 30px ${user.buttonColor}30`,
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {link.icon && (
                        <span className="text-2xl animate-bounce">
                          <IconRenderer iconValue={link.icon} />
                        </span>
                      )}
                      <span className="font-semibold text-lg">{link.title}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm opacity-80">
                      {copiedId === link.id ? (
                        <>
                          <FiCheck className="animate-bounce" />
                          <span>הקופון הועתק! עובר לאתר...</span>
                        </>
                      ) : (
                        <>
                          <FiCopy />
                          <span>🎁 קופון: {link.couponCode}</span>
                        </>
                      )}
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>
                ) : (
                  // Regular Link
                  <button
                    onClick={() => handleRegularClick(link)}
                    className={`w-full group relative overflow-hidden p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] ${getButtonClass()}`}
                    style={{
                      backgroundColor:
                        user.buttonStyle === "outline"
                          ? "transparent"
                          : user.buttonColor,
                      color: user.buttonTextColor,
                      borderColor:
                        user.buttonStyle === "outline"
                          ? user.buttonColor
                          : undefined,
                      boxShadow: `0 10px 30px ${user.buttonColor}30`,
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {link.icon && (
                        <span className="text-2xl">
                          <IconRenderer iconValue={link.icon} />
                        </span>
                      )}
                      <span className="font-semibold text-lg">{link.title}</span>
                      <FiExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {user.links.length === 0 && (
            <div
              className={`mt-12 text-center py-12 opacity-60 ${
                mounted ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ color: user.textColor }}
            >
              <p className="text-xl">
                <IconRenderer iconValue="FiLink" />
              </p>
              <p className="mt-2">אין לינקים להצגה</p>
            </div>
          )}

          {/* Footer */}
          <div
            className={`mt-12 text-center ${
              mounted ? "animate-fade-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.8s" }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm opacity-40 hover:opacity-70 transition-opacity group"
              style={{ color: user.textColor }}
            >
              <span className="group-hover:animate-bounce">
                <IconRenderer iconValue="FiLink" />
              </span>
              <span>נבנה עם LinkHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

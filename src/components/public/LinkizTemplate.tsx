"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import { SocialIcons } from "@/components/public/SocialIcons";
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

interface LinkizTemplateProps {
  user: User;
}

export function LinkizTemplate({ user }: LinkizTemplateProps) {
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

  const handleCouponAndPurchase = async (link: Link) => {
    if (!link.couponCode) return;
    
    // Copy coupon code
    await navigator.clipboard.writeText(link.couponCode);
    setCopiedId(link.id);
    toast.success("קוד קופון הועתק! עובר לאתר...");
    
    // Track click
    handleLinkClick(link);
    
    // Open purchase link after short delay
    setTimeout(() => {
      window.open(link.url, "_blank");
      setCopiedId(null);
    }, 1000);
  };

  const handleRegularClick = (link: Link) => {
    handleLinkClick(link);
    window.open(link.url, "_blank");
  };

  // Separate links into regular links and coupon links
  const regularLinks = user.links.filter((link) => !link.couponCode);
  const couponLinks = user.links.filter((link) => link.couponCode);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      style={{ backgroundColor: user.backgroundColor || "#f9fafb" }}
    >
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Profile Section */}
        <div
          className={`text-center mb-8 ${
            mounted ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || user.slug}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white"
              style={{
                backgroundColor: user.buttonColor || "#6366f1",
                color: user.buttonTextColor || "#ffffff",
              }}
            >
              {(user.name || user.slug).charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name with verification badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1
              className="text-2xl font-bold"
              style={{ 
                color: user.textColor && user.textColor !== "#ffffff" && user.textColor !== "#fff" 
                  ? user.textColor 
                  : "#9333ea" 
              }}
            >
              {user.name || user.slug}
            </h1>
            <FiCheckCircle className="text-blue-500" size={20} />
          </div>

          {/* Bio */}
          {user.bio && (
            <p
              className="text-sm mb-4 leading-relaxed whitespace-pre-line"
              style={{ 
                color: user.textColor && user.textColor !== "#ffffff" && user.textColor !== "#fff" 
                  ? user.textColor 
                  : "#6b7280" 
              }}
            >
              {user.bio}
            </p>
          )}

          {/* Social Icons */}
          <div className="flex justify-center gap-3 mb-6">
            <SocialIcons 
              links={socialLinks} 
              textColor={user.textColor && user.textColor !== "#ffffff" && user.textColor !== "#fff" 
                ? user.textColor 
                : "#9333ea"} 
            />
          </div>
        </div>

        {/* Regular Links */}
        {regularLinks.length > 0 && (
          <div className="space-y-3 mb-8">
            {regularLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleRegularClick(link)}
                className={`w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group ${
                  mounted ? "animate-slide-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${0.1 + index * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-3 flex-1 text-right">
                  {link.icon && (
                    <div className="text-2xl">
                      <IconRenderer iconValue={link.icon} />
                    </div>
                  )}
                  <span className="font-semibold text-gray-800 flex-1">
                    {link.title}
                  </span>
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-gray-600 transition-colors" size={18} />
              </button>
            ))}
          </div>
        )}

        {/* Coupons Section */}
        {couponLinks.length > 0 && (
          <div className="mb-8 space-y-4">
            {couponLinks.map((link, index) => (
              <div
                key={link.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                  mounted ? "animate-slide-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 text-right flex items-center gap-3">
                    {link.icon && (
                      <div className="text-gray-600 shrink-0">
                        <IconRenderer iconValue={link.icon} size={20} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {link.title}
                      </h3>
                      {link.discountDescription && (
                        <div className="inline-block bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1 rounded-full">
                          {link.discountDescription}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button - Combined */}
                  <div className="shrink-0">
                    <button
                      onClick={() => handleCouponAndPurchase(link)}
                      className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      style={{
                        backgroundColor: copiedId === link.id 
                          ? "#22c55e" 
                          : (user.buttonColor || "#b45309"),
                      }}
                    >
                      {copiedId === link.id ? (
                        <>
                          <FiCheck className="text-white" size={16} />
                          <span>הועתק! עובר...</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={16} />
                          <span>העתק קופון ורכישה</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {user.links.length === 0 && (
          <div
            className={`text-center py-16 ${
              mounted ? "animate-fade-in" : "opacity-0"
            }`}
          >
            <IconRenderer iconValue="FiLink" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">אין לינקים להצגה</p>
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
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconRenderer iconValue="FiLink" size={14} />
            <span>נבנה עם LinkHub</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}


"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FiLink, FiBarChart2, FiClock, FiSmartphone, FiZap, FiShield, FiArrowDown, FiCheck, FiStar, FiSend, FiCamera, FiTwitter, FiYoutube, FiGlobe, FiGift, FiUser, FiX } from "react-icons/fi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CountryModal } from "@/components/home/CountryModal";


export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    setMounted(true);
    // Update HTML dir attribute based on language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const features = [
    {
      icon: FiLink,
      title: t("features.unlimitedLinks"),
      description: t("features.unlimitedLinksDesc"),
    },
    {
      icon: FiBarChart2,
      title: t("features.analytics"),
      description: t("features.analyticsDesc"),
    },
    {
      icon: FiClock,
      title: t("features.scheduling"),
      description: t("features.schedulingDesc"),
    },
    {
      icon: FiSmartphone,
      title: t("features.qrCode"),
      description: t("features.qrCodeDesc"),
    },
    {
      icon: FiZap,
      title: t("features.coupons"),
      description: t("features.couponsDesc"),
    },
    {
      icon: FiShield,
      title: t("features.customDesign"),
      description: t("features.customDesignDesc"),
    },
  ];

  return (
    <div className={`min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100`} dir={isRTL ? "rtl" : "ltr"}>
      <CountryModal />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-zinc-900">
              LinkHub
          </h1>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button>לוח בקרה</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-zinc-700 hover:text-zinc-900">התחברות</Button>
                  </Link>
                  <Link href="/register">
                    <Button>התחל בחינם</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center relative">
          <div
            className={`inline-block mb-6 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200 ${
              mounted ? "animate-bounce-in" : "opacity-0"
            }`}
          >
            <span className="text-indigo-600 text-sm font-medium flex items-center gap-2">
              <FiStar size={16} />
              {t("hero.badge")}
            </span>
          </div>
          <h2
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 mb-6 leading-tight ${
              mounted ? "animate-slide-up" : "opacity-0"
            }`}
          >
            {t("hero.title")}
            <br />
            <span className="text-indigo-600">
              {t("hero.titleHighlight")}
            </span>
          </h2>
          <p
            className={`text-xl text-zinc-600 mb-8 max-w-2xl mx-auto ${
              mounted ? "animate-slide-up stagger-2" : "opacity-0"
            }`}
          >
            {t("hero.description")}
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              mounted ? "animate-slide-up stagger-3" : "opacity-0"
            }`}
          >
            <Link href="/register">
              <Button size="lg">
                {t("hero.cta")}
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="bg-white text-zinc-900 border-zinc-300">
                <FiArrowDown className={`${isRTL ? "mr-2" : "ml-2"} animate-bounce`} />
                {t("hero.learnMore")}
              </Button>
            </a>
          </div>
        </div>

        {/* Preview */}
        <div
          className={`max-w-sm mx-auto mt-16 ${
            mounted ? "animate-float" : ""
          }`}
        >
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FiSend className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">השם שלך</h3>
              <p className="text-zinc-600 text-sm">מפתח | יוצר תוכן</p>
              <div className="flex justify-center gap-2 mt-3">
                {[FiCamera, FiTwitter, FiYoutube].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
                  >
                    <Icon className="text-zinc-600" size={16} />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { text: "האתר שלי", icon: FiGlobe },
                { text: "יוטיוב", icon: FiYoutube },
                { text: "טוויטר", icon: FiTwitter },
              ].map((item, i) => (
                <div
                  key={item.text}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <item.icon size={18} />
                  {item.text}
                </div>
              ))}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-center py-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm">
                <FiGift size={18} />
                קופון: SAVE20
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              {t("features.title")}
            </h3>
            <p className="text-zinc-600 text-lg">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                  <feature.icon className="text-indigo-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-zinc-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              {t("testimonials.title")}
            </h3>
            <p className="text-zinc-600 text-lg">
              {t("testimonials.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "יוסי כהן",
                role: "יוצר תוכן",
                text: "מאז שעברתי ל-LinkHub, ראיתי עלייה של 40% בקליקים! הממשק פשוט מדהים.",
                avatar: FiUser,
              },
              {
                name: "מיכל לוי",
                role: "בלוגרית",
                text: "הקופונים החכמים עוזרים לי לשתף הנחות עם העוקבים שלי בקלות רבה.",
                avatar: FiUser,
              },
              {
                name: "דני אברהם",
                role: "בעל עסק",
                text: "האנליטיקס המתקדם נותן לי תובנות חשובות על הקהל שלי. ממליץ בחום!",
                avatar: FiUser,
              },
            ].map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`flex items-center gap-3 mb-4 ${isRTL ? "" : "flex-row-reverse"}`}>
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    {(() => {
                      const AvatarIcon = testimonial.avatar;
                      return <AvatarIcon className="text-white" size={24} />;
                    })()}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-zinc-900 font-medium">{testimonial.name}</p>
                    <p className="text-zinc-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className={`text-zinc-700 ${isRTL ? "text-right" : "text-left"}`}>&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              {t("pricing.title")}
            </h3>
            <p className="text-zinc-600 text-lg">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white border-2 border-zinc-200 rounded-2xl p-8 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-zinc-900 mb-2">{t("pricing.basic")}</h4>
                <p className="text-zinc-600 text-sm mb-6">{t("pricing.basicDesc")}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-zinc-900">$10</span>
                  <span className={`text-zinc-600 ${isRTL ? "mr-2" : "ml-2"}`}>{t("pricing.perMonth")}</span>
                </div>
              </div>
              <ul className={`text-zinc-700 space-y-4 mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                {[
                  t("pricing.features.unlimitedLinks"),
                  t("pricing.features.basicAnalytics"),
                  t("pricing.features.customDesign"),
                  t("pricing.features.smartCoupons"),
                  t("pricing.features.qrCode"),
                  t("pricing.features.linkScheduling"),
                  t("pricing.features.socialLinks"),
                ].map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                    <span className="text-sm">{feature}</span>
                    <FiCheck className="text-green-500 shrink-0" size={18} />
                  </li>
                ))}
                <li className={`flex items-center gap-2 text-zinc-400 ${isRTL ? "justify-end" : "justify-start"}`}>
                  <span className="text-sm">{t("pricing.features.landingPages")}</span>
                  <FiX className="text-red-400 shrink-0" size={18} />
                </li>
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full" variant="secondary">
                  {t("pricing.startFree")}
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 relative">
              <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {t("pricing.recommended")}
              </div>
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-zinc-900 mb-2">{t("pricing.premium")}</h4>
                <p className="text-zinc-700 text-sm mb-6">{t("pricing.premiumDesc")}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-zinc-900">$20</span>
                  <span className={`text-zinc-600 ${isRTL ? "mr-2" : "ml-2"}`}>{t("pricing.perMonth")}</span>
                </div>
              </div>
              <ul className={`text-zinc-800 space-y-4 mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                {[
                  t("pricing.features.allBasicFeatures"),
                  t("pricing.features.unlimitedLandingPages"),
                  t("pricing.features.landingPageBuilder"),
                  t("pricing.features.leadManagement"),
                  t("pricing.features.advancedAnalytics"),
                  t("pricing.features.prioritySupport"),
                ].map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                    <span className="text-sm font-medium">{feature}</span>
                    <FiCheck className="text-green-600 shrink-0" size={18} />
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full">
                  {t("pricing.startFree")}
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-zinc-500 text-sm text-center mt-8">
            {t("pricing.trial")}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
              <p className="text-zinc-600">{t("stats.activeUsers")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <p className="text-zinc-600">{t("stats.linksCreated")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
              <p className="text-zinc-600">{t("stats.uptime")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              {t("howItWorks.title")}
            </h3>
            <p className="text-zinc-600 text-lg">
              {t("howItWorks.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-zinc-900 mb-2">{t("howItWorks.step1")}</h4>
              <p className="text-zinc-600">{t("howItWorks.step1Desc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-zinc-900 mb-2">{t("howItWorks.step2")}</h4>
              <p className="text-zinc-600">{t("howItWorks.step2Desc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-zinc-900 mb-2">{t("howItWorks.step3")}</h4>
              <p className="text-zinc-600">{t("howItWorks.step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            {t("cta.title")}
          </h3>
          <p className="text-zinc-600 text-lg mb-8">
            {t("cta.subtitle")}
          </p>
          <Link href="/register">
            <Button size="lg">
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600">
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                {t("footer.login")}
              </Link>
              <Link href="/register" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                {t("footer.register")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

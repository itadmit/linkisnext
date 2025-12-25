"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FiLink, FiBarChart2, FiClock, FiSmartphone, FiZap, FiShield, FiArrowDown, FiCheck, FiStar, FiSend, FiCamera, FiTwitter, FiYoutube, FiGlobe, FiGift, FiUser, FiX } from "react-icons/fi";

const features = [
  {
    icon: FiLink,
    title: "לינקים ללא הגבלה",
    description: "הוסף כמה לינקים שתרצה לדף שלך",
  },
  {
    icon: FiBarChart2,
    title: "אנליטיקס מתקדם",
    description: "עקוב אחר קליקים וביצועים בזמן אמת",
  },
  {
    icon: FiClock,
    title: "תזמון לינקים",
    description: "קבע מתי הלינקים שלך יופיעו",
  },
  {
    icon: FiSmartphone,
    title: "QR Code",
    description: "שתף את הדף שלך בקלות עם קוד QR",
  },
  {
    icon: FiZap,
    title: "קופונים חכמים",
    description: "הוסף קופונים עם העתקה אוטומטית",
  },
  {
    icon: FiShield,
    title: "עיצוב מותאם",
    description: "התאם את העיצוב למותג שלך",
  },
];

const testimonials = [
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
];

export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
              7 ימי ניסיון בחינם
            </span>
          </div>
          <h2
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 mb-6 leading-tight ${
              mounted ? "animate-slide-up" : "opacity-0"
            }`}
          >
            כל הלינקים שלך
            <br />
            <span className="text-indigo-600">
              במקום אחד
            </span>
          </h2>
          <p
            className={`text-xl text-zinc-600 mb-8 max-w-2xl mx-auto ${
              mounted ? "animate-slide-up stagger-2" : "opacity-0"
            }`}
          >
            צור דף לינקים מקצועי תוך דקות. שתף את כל הלינקים שלך, עקוב אחר הביצועים, והתאם את העיצוב למותג שלך.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              mounted ? "animate-slide-up stagger-3" : "opacity-0"
            }`}
          >
            <Link href="/register">
              <Button size="lg">
                התחל בחינם →
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="bg-white text-zinc-900 border-zinc-300">
                <FiArrowDown className="ml-2 animate-bounce" />
                גלה עוד
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
              כל מה שאתה צריך
            </h3>
            <p className="text-zinc-600 text-lg">
              תכונות מתקדמות שיעזרו לך להצליח
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
              מה אומרים עלינו
            </h3>
            <p className="text-zinc-600 text-lg">
              אלפי משתמשים כבר משתמשים ב-LinkHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    {(() => {
                      const AvatarIcon = testimonial.avatar;
                      return <AvatarIcon className="text-white" size={24} />;
                    })()}
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-900 font-medium">{testimonial.name}</p>
                    <p className="text-zinc-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-zinc-700">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              בחר את החבילה המתאימה לך
            </h3>
            <p className="text-white/70 text-lg">
              שתי אפשרויות פשוטות - בחר מה שמתאים לך
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">חבילה בסיסית</h4>
                <p className="text-white/60 text-sm mb-6">לינקים בלבד</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$10</span>
                  <span className="text-white/60 mr-2">/ חודש</span>
                </div>
              </div>
              <ul className="text-white/80 space-y-4 mb-8 text-right">
                {[
                  "לינקים ללא הגבלה",
                  "אנליטיקס בסיסי",
                  "עיצוב מותאם אישית",
                  "קופונים חכמים",
                  "QR Code",
                  "תזמון לינקים",
                  "רשתות חברתיות",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 justify-end">
                    <span className="text-sm">{feature}</span>
                    <FiCheck className="text-green-400 shrink-0" size={18} />
                  </li>
                ))}
                <li className="flex items-center gap-2 justify-end text-white/40">
                  <span className="text-sm">דפי נחיתה</span>
                  <FiX className="text-red-400 shrink-0" size={18} />
                </li>
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full" variant="secondary">
                  התחל בחינם
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm border-2 border-indigo-500/50 rounded-2xl p-8 hover:from-indigo-600/40 hover:to-purple-600/40 transition-all duration-300 relative">
              <div className="absolute top-4 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                מומלץ
              </div>
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">חבילה פרימיום</h4>
                <p className="text-white/80 text-sm mb-6">כולל דפי נחיתה</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">$20</span>
                  <span className="text-white/70 mr-2">/ חודש</span>
                </div>
              </div>
              <ul className="text-white/90 space-y-4 mb-8 text-right">
                {[
                  "כל התכונות של החבילה הבסיסית",
                  "דפי נחיתה ללא הגבלה",
                  "בילדר דפי נחיתה",
                  "ניהול לידים",
                  "אנליטיקס מתקדם",
                  "תמיכה עדיפות",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium">{feature}</span>
                    <FiCheck className="text-green-300 shrink-0" size={18} />
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full">
                  התחל בחינם
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-white/50 text-sm text-center mt-8">
            7 ימי ניסיון בחינם • ללא כרטיס אשראי לניסיון
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
            מוכן להתחיל?
          </h3>
          <p className="text-zinc-600 text-lg mb-8">
            הצטרף לאלפי משתמשים שכבר משתמשים ב-LinkHub
          </p>
          <Link href="/register">
            <Button size="lg">
              צור את הדף שלך עכשיו →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600">
              © 2024 LinkHub. כל הזכויות שמורות.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                התחברות
              </Link>
              <Link href="/register" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                הרשמה
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

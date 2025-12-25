"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FiLink, FiBarChart2, FiClock, FiSmartphone, FiZap, FiShield, FiArrowDown, FiCheck, FiStar, FiSend, FiCamera, FiTwitter, FiYoutube, FiGlobe, FiGift, FiUser } from "react-icons/fi";

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
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
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
                    <Button variant="ghost">התחברות</Button>
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
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div
            className={`inline-block mb-4 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 ${
              mounted ? "animate-bounce-in" : "opacity-0"
            }`}
          >
            <span className="text-indigo-400 text-sm font-medium flex items-center gap-2">
              <FiStar size={16} />
              7 ימי ניסיון בחינם
            </span>
          </div>
          <h2
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight ${
              mounted ? "animate-slide-up" : "opacity-0"
            }`}
          >
            כל הלינקים שלך
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              במקום אחד
            </span>
          </h2>
          <p
            className={`text-xl text-white/70 mb-8 max-w-2xl mx-auto ${
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
              <Button size="lg" className="animate-pulse-glow">
                התחל בחינם →
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FiSend className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">השם שלך</h3>
              <p className="text-white/60 text-sm">מפתח | יוצר תוכן</p>
              <div className="flex justify-center gap-2 mt-3">
                {[FiCamera, FiTwitter, FiYoutube].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
                  >
                    <Icon className="text-white" size={16} />
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <item.icon size={18} />
                  {item.text}
                </div>
              ))}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-center py-3 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2">
                <FiGift size={18} />
                קופון: SAVE20
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              כל מה שאתה צריך
            </h3>
            <p className="text-white/70 text-lg">
              תכונות מתקדמות שיעזרו לך להצליח
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              מה אומרים עלינו
            </h3>
            <p className="text-white/70 text-lg">
              אלפי משתמשים כבר משתמשים ב-LinkHub
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    {(() => {
                      const AvatarIcon = testimonial.avatar;
                      return <AvatarIcon className="text-white" size={24} />;
                    })()}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/80">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              תמחור פשוט
            </h3>
            <p className="text-white/70">
              תכנית אחת עם כל התכונות
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="inline-block px-4 py-1 bg-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-4">
                הכי פופולרי
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$10</span>
                <span className="text-white/60 mr-2">/ חודש</span>
              </div>
              <ul className="text-white/80 space-y-3 mb-8 text-right">
                {[
                  "לינקים ללא הגבלה",
                  "אנליטיקס מתקדם",
                  "עיצוב מותאם אישית",
                  "קופונים חכמים",
                  "QR Code",
                  "תזמון לינקים",
                  "רשתות חברתיות",
                  "תמיכה בעברית",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 justify-end">
                    <span>{feature}</span>
                    <FiCheck className="text-green-400" />
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="w-full">
                  התחל 7 ימים בחינם
                </Button>
              </Link>
              <p className="text-white/50 text-sm mt-4">
                ללא כרטיס אשראי לניסיון
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            מוכן להתחיל?
          </h3>
          <p className="text-white/70 text-lg mb-8">
            הצטרף לאלפי משתמשים שכבר משתמשים ב-LinkHub
          </p>
          <Link href="/register">
            <Button size="lg" className="animate-pulse-glow">
              צור את הדף שלך עכשיו →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50">
              © 2024 LinkHub. כל הזכויות שמורות.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-white/50 hover:text-white transition-colors">
                התחברות
              </Link>
              <Link href="/register" className="text-white/50 hover:text-white transition-colors">
                הרשמה
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

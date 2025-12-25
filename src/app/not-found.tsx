"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FiLink, FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating Links */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <FiLink
              size={40}
              className="text-indigo-400"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Broken Link Icon */}
        <div className="mb-8 flex justify-center relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-2">
                <FiLink size={64} className="text-white" />
                <div className="w-1 h-16 bg-red-500 rotate-45 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          אופס! הלינק נשבר
        </h2>
        <p className="text-xl text-white/70 mb-2">
          הדף שחיפשת לא נמצא או הועבר
        </p>
        <p className="text-lg text-white/50 mb-12">
          אבל אל דאגה, יש לנו הרבה לינקים אחרים שתוכל לבדוק!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="group">
              <FiHome className="ml-2 group-hover:scale-110 transition-transform" />
              חזרה לדף הבית
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.history.back()}
            className="group"
          >
            <FiArrowLeft className="ml-2 group-hover:-translate-x-1 transition-transform" />
            חזור אחורה
          </Button>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <p className="text-white/60 text-sm">
            💡 טיפ: בדוק את האיות או נסה לחפש בדף הבית
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

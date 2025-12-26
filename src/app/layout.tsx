import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { TranslationProvider } from "@/lib/i18n/useTranslation";
import { Toaster } from "react-hot-toast";
import { ThemeScript } from "@/components/providers/ThemeScript";

const rubik = Rubik({ 
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Linkis - כל הלינקים שלך במקום אחד",
  description: "צור דף לינקים מקצועי ושתף אותו עם העולם. סטטיסטיקות, עיצוב מותאם אישית, קופונים ועוד.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${rubik.variable} font-sans antialiased bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors`}>
        <TranslationProvider>
          <SessionProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#1e293b",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                },
              }}
            />
          </SessionProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

const rubik = Rubik({ 
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "LinkHub - כל הלינקים שלך במקום אחד",
  description: "צור דף לינקים מקצועי ושתף אותו עם העולם. סטטיסטיקות, עיצוב מותאם אישית, קופונים ועוד.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.variable} font-sans antialiased`}>
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
      </body>
    </html>
  );
}

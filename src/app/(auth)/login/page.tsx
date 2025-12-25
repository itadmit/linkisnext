"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("התחברת בהצלחה!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("שגיאה בהתחברות");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              LinkHub
            </h1>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-6 tracking-tight">
            התחברות
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="אימייל"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              icon={<FiMail />}
              required
              dir="ltr"
              className="text-left"
            />

            <Input
              label="סיסמה"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              icon={<FiLock />}
              required
              dir="ltr"
              className="text-left"
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              התחבר
            </Button>
          </form>

          <p className="text-center text-zinc-600 mt-6">
            אין לך חשבון?{" "}
            <Link
              href="/register"
              className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors"
            >
              הירשם עכשיו
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


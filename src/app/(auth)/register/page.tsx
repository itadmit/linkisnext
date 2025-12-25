"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FiMail, FiLock, FiUser, FiAtSign, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    slug: "",
  });

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug.length < 3) {
        setSlugStatus("idle");
        return;
      }

      setSlugStatus("checking");
      try {
        const res = await fetch(`/api/check-slug?slug=${formData.slug}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    };

    const debounce = setTimeout(checkSlug, 500);
    return () => clearTimeout(debounce);
  }, [formData.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (slugStatus !== "available") {
      toast.error("יש לבחור סלאג תקין ופנוי");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "שגיאה בהרשמה");
      }

      toast.success("נרשמת בהצלחה! מתחבר...");

      // Auto login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "שגיאה בהרשמה");
    } finally {
      setIsLoading(false);
    }
  };

  const getSlugStatusIcon = () => {
    switch (slugStatus) {
      case "checking":
        return <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />;
      case "available":
        return <FiCheck className="text-green-400" />;
      case "taken":
        return <FiX className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            הרשמה
          </h2>
          <p className="text-white/60 text-center mb-6">
            7 ימי ניסיון בחינם!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="שם"
              placeholder="השם שלך"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              icon={<FiUser />}
            />

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
              placeholder="לפחות 6 תווים"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              icon={<FiLock />}
              required
              dir="ltr"
              className="text-left"
            />

            <div>
              <Input
                label="סלאג (כתובת הדף שלך)"
                placeholder="your-name"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  })
                }
                icon={<FiAtSign />}
                required
                dir="ltr"
                className="text-left"
              />
              <div className="flex items-center gap-2 mt-2 justify-end">
                {getSlugStatusIcon()}
                <span className="text-sm text-white/60">
                  {formData.slug && `linkhub.com/${formData.slug}`}
                </span>
              </div>
              {slugStatus === "taken" && (
                <p className="text-sm text-red-400 mt-1 text-right">
                  הסלאג הזה כבר תפוס
                </p>
              )}
              {slugStatus === "available" && (
                <p className="text-sm text-green-400 mt-1 text-right">
                  הסלאג פנוי!
                </p>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={slugStatus !== "available"}
              className="w-full"
            >
              הירשם
            </Button>
          </form>

          <p className="text-center text-white/60 mt-6">
            כבר יש לך חשבון?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              התחבר
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


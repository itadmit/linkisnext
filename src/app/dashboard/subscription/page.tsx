"use client";

import { useState, useEffect, useCallback } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalProvider } from "@/components/providers/PayPalProvider";
import { Button } from "@/components/ui/Button";
import { FiCheck, FiClock, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

interface Subscription {
  subscriptionStatus: string;
  trialEndsAt: string | null;
  subscriptionId: string | null;
  subscriptionEndsAt: string | null;
}

function SubscriptionContent() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      setSubscription(data);
    } catch (error) {
      toast.error("שגיאה בטעינת המנוי");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscriptionSuccess = async (subscriptionId: string) => {
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!res.ok) throw new Error("שגיאה בהפעלת המנוי");

      toast.success("המנוי הופעל בהצלחה!");
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCancel = async () => {
    if (!confirm("האם אתה בטוח שברצונך לבטל את המנוי?")) return;

    try {
      const res = await fetch("/api/subscription", { method: "DELETE" });
      if (!res.ok) throw new Error("שגיאה בביטול המנוי");

      toast.success("המנוי בוטל");
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (subscription?.subscriptionStatus) {
      case "trial":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 font-medium">
            <FiClock size={16} />
            תקופת ניסיון
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium">
            <FiCheck size={16} />
            מנוי פעיל
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 font-medium">
            <FiAlertTriangle size={16} />
            מנוי בוטל
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 font-medium">
            <FiAlertTriangle size={16} />
            פג תוקף
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysLeft = () => {
    if (subscription?.subscriptionStatus === "trial" && subscription.trialEndsAt) {
      const diff = new Date(subscription.trialEndsAt).getTime() - Date.now();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8">המנוי שלי</h1>

      {/* Current Status */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">
              סטטוס המנוי
            </h2>
            {subscription?.subscriptionStatus === "trial" && (
              <p className="text-zinc-500 text-sm">
                נותרו {daysLeft()} ימים לתקופת הניסיון
              </p>
            )}
            {subscription?.subscriptionStatus === "active" && (
              <p className="text-zinc-500 text-sm">
                בתוקף עד {formatDate(subscription.subscriptionEndsAt)}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Trial/Expired - Show PayPal */}
        {(subscription?.subscriptionStatus === "trial" ||
          subscription?.subscriptionStatus === "expired") && (
          <div className="border-t border-zinc-100 pt-6">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">
              שדרג למנוי פרימיום
            </h3>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-zinc-900">
                  $10<span className="text-lg text-zinc-500">/חודש</span>
                </div>
                <div className="text-right">
                  <p className="text-zinc-900 font-semibold">מנוי חודשי</p>
                  <p className="text-zinc-500 text-sm">כל התכונות כלולות</p>
                </div>
              </div>
              <ul className="text-zinc-700 space-y-2 text-right mb-6">
                <li className="flex items-center gap-2 justify-end">
                  <span className="text-sm">לינקים ללא הגבלה</span>
                  <FiCheck className="text-emerald-600 shrink-0" size={16} />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span className="text-sm">אנליטיקס מתקדם</span>
                  <FiCheck className="text-emerald-600 shrink-0" size={16} />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span className="text-sm">עיצוב מותאם אישית</span>
                  <FiCheck className="text-emerald-600 shrink-0" size={16} />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span className="text-sm">קופונים חכמים</span>
                  <FiCheck className="text-emerald-600 shrink-0" size={16} />
                </li>
              </ul>
            </div>

            {/* PayPal Button */}
            <div className="paypal-buttons-container">
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "pill",
                  label: "subscribe",
                }}
                createSubscription={(data, actions) => {
                  return actions.subscription.create({
                    plan_id: "P-XXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your PayPal plan ID
                  });
                }}
                onApprove={async (data) => {
                  if (data.subscriptionID) {
                    await handleSubscriptionSuccess(data.subscriptionID);
                  }
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  toast.error("שגיאה בתהליך התשלום");
                }}
              />
            </div>
            <p className="text-zinc-400 text-xs text-center mt-4">
              התשלום מאובטח דרך PayPal
            </p>
          </div>
        )}

        {/* Active subscription - Show cancel button */}
        {subscription?.subscriptionStatus === "active" && (
          <div className="border-t border-zinc-100 pt-6">
            <Button variant="danger" onClick={handleCancel}>
              בטל מנוי
            </Button>
            <p className="text-zinc-500 text-sm mt-2">
              המנוי ימשיך לפעול עד {formatDate(subscription.subscriptionEndsAt)}
            </p>
          </div>
        )}
      </div>

      {/* Features included */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-900 mb-4">
          מה כלול במנוי
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "לינקים ללא הגבלה",
            "אנליטיקס מתקדם",
            "עיצוב מותאם אישית",
            "קופונים חכמים",
            "QR Code",
            "תזמון לינקים",
            "תמיכה בעברית",
            "ללא פרסומות",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-zinc-700 justify-end text-sm"
            >
              <span>{feature}</span>
              <FiCheck className="text-emerald-600 shrink-0" size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <PayPalProvider>
      <SubscriptionContent />
    </PayPalProvider>
  );
}


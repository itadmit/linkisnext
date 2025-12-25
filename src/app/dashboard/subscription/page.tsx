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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (subscription?.subscriptionStatus) {
      case "trial":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full">
            <FiClock />
            תקופת ניסיון
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
            <FiCheck />
            מנוי פעיל
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full">
            <FiAlertTriangle />
            מנוי בוטל
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full">
            <FiAlertTriangle />
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">המנוי שלי</h1>

      {/* Current Status */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h2 className="text-xl font-semibold text-white mb-2">
              סטטוס המנוי
            </h2>
            {subscription?.subscriptionStatus === "trial" && (
              <p className="text-white/60">
                נותרו {daysLeft()} ימים לתקופת הניסיון
              </p>
            )}
            {subscription?.subscriptionStatus === "active" && (
              <p className="text-white/60">
                בתוקף עד {formatDate(subscription.subscriptionEndsAt)}
              </p>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Trial/Expired - Show PayPal */}
        {(subscription?.subscriptionStatus === "trial" ||
          subscription?.subscriptionStatus === "expired") && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              שדרג למנוי פרימיום
            </h3>
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-white">
                  $10<span className="text-lg text-white/60">/חודש</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">מנוי חודשי</p>
                  <p className="text-white/60 text-sm">כל התכונות כלולות</p>
                </div>
              </div>
              <ul className="text-white/80 space-y-2 text-right mb-6">
                <li className="flex items-center gap-2 justify-end">
                  <span>לינקים ללא הגבלה</span>
                  <FiCheck className="text-green-400" />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>אנליטיקס מתקדם</span>
                  <FiCheck className="text-green-400" />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>עיצוב מותאם אישית</span>
                  <FiCheck className="text-green-400" />
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>קופונים חכמים</span>
                  <FiCheck className="text-green-400" />
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
            <p className="text-white/40 text-sm text-center mt-4">
              התשלום מאובטח דרך PayPal
            </p>
          </div>
        )}

        {/* Active subscription - Show cancel button */}
        {subscription?.subscriptionStatus === "active" && (
          <div className="border-t border-white/10 pt-6">
            <Button variant="danger" onClick={handleCancel}>
              בטל מנוי
            </Button>
            <p className="text-white/40 text-sm mt-2">
              המנוי ימשיך לפעול עד {formatDate(subscription.subscriptionEndsAt)}
            </p>
          </div>
        )}
      </div>

      {/* Features included */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">
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
              className="flex items-center gap-2 text-white/80 justify-end"
            >
              <span>{feature}</span>
              <FiCheck className="text-green-400 shrink-0" />
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


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiClock, FiX } from "react-icons/fi";

interface Subscription {
  subscriptionStatus: string;
  trialEndsAt: string | null;
}

export function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();
        setSubscription(data);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };
    fetchSubscription();
  }, []);

  if (!subscription || dismissed) return null;

  const daysLeft = () => {
    if (subscription.subscriptionStatus === "trial" && subscription.trialEndsAt) {
      const diff = new Date(subscription.trialEndsAt).getTime() - Date.now();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  if (subscription.subscriptionStatus === "active") return null;

  const days = daysLeft();
  const isUrgent = days <= 2;
  const isExpired = subscription.subscriptionStatus === "expired";

  return (
    <div
      className={`mb-6 rounded-lg p-4 flex items-center justify-between border backdrop-blur-sm ${
        isExpired
          ? "bg-red-50 border-red-200"
          : isUrgent
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-zinc-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {isExpired ? (
          <>
            <FiAlertTriangle className="text-red-600 shrink-0" size={18} />
            <div className="text-right">
              <p className="text-zinc-900 font-medium text-sm">תקופת הניסיון הסתיימה</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                שדרג עכשיו כדי להמשיך להשתמש בשירות
              </p>
            </div>
          </>
        ) : (
          <>
            <FiClock
              className={isUrgent ? "text-amber-600 shrink-0" : "text-zinc-400 shrink-0"}
              size={18}
            />
            <div className="text-right">
              <p className="text-zinc-900 font-medium text-sm">
                נותרו {days} ימים לתקופת הניסיון
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                שדרג עכשיו כדי להנות מכל התכונות
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/subscription"
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isExpired
              ? "bg-red-600 hover:bg-red-700 text-white"
              : isUrgent
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          שדרג עכשיו
        </Link>
        {!isExpired && (
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100"
          >
            <FiX size={14} />
          </button>
        )}
      </div>
    </div>
  );
}


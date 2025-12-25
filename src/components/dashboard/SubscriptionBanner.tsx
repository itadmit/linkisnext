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
      className={`mb-6 rounded-lg p-4 flex items-center justify-between border shadow-sm w-full ${
        isExpired
          ? "bg-red-50/50 border-red-100"
          : isUrgent
          ? "bg-amber-50/50 border-amber-100"
          : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex items-center gap-3">
        {isExpired ? (
          <>
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <FiAlertTriangle size={16} />
            </div>
            <div className="text-right">
              <p className="text-zinc-900 font-medium text-sm">תקופת הניסיון הסתיימה</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                שדרג עכשיו כדי להמשיך להשתמש בשירות
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={`p-2 rounded-full ${isUrgent ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-600"}`}>
              <FiClock size={16} />
            </div>
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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
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
            className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
}


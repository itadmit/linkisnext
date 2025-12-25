"use client";

import { useState, useEffect, useCallback } from "react";
import { FiTrendingUp, FiUsers, FiMonitor, FiGlobe, FiSmartphone, FiTablet } from "react-icons/fi";
import toast from "react-hot-toast";

interface Analytics {
  totalClicks: number;
  topLinks: Array<{ id: string; title: string; clicks: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
}

const deviceLabels: Record<string, { label: string; icon: any }> = {
  mobile: { label: "מובייל", icon: FiSmartphone },
  desktop: { label: "מחשב", icon: FiMonitor },
  tablet: { label: "טאבלט", icon: FiTablet },
};

const browserLabels: Record<string, string> = {
  chrome: "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  edge: "Edge",
  other: "אחר",
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      toast.error("שגיאה בטעינת האנליטיקס");
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalDevices = analytics?.devices.reduce((sum, d) => sum + d.count, 0) || 0;
  const totalBrowsers = analytics?.browsers.reduce((sum, b) => sum + b.count, 0) || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">אנליטיקס</h1>
          <p className="text-zinc-500 text-sm mt-1">
            עקוב אחר הביצועים של הלינקים שלך
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="bg-white border border-zinc-200 rounded-lg px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent shadow-sm"
        >
          <option value={7}>7 ימים אחרונים</option>
          <option value={30}>30 ימים אחרונים</option>
          <option value={90}>90 ימים אחרונים</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-white" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">סה״כ קליקים</p>
              <p className="text-2xl font-bold text-zinc-900">
                {analytics?.totalClicks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
              <FiUsers className="text-emerald-600" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">לינקים פעילים</p>
              <p className="text-2xl font-bold text-zinc-900">
                {analytics?.topLinks.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center border border-zinc-200">
              <FiMonitor className="text-zinc-600" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">מכשיר מוביל</p>
              {analytics?.devices[0] && deviceLabels[analytics.devices[0].device] ? (
                <div className="flex items-center gap-2 justify-end">
                  {(() => {
                    const DeviceIcon = deviceLabels[analytics.devices[0].device].icon;
                    return (
                      <>
                        <DeviceIcon className="text-zinc-600" size={18} />
                        <span className="text-lg font-bold text-zinc-900">
                          {deviceLabels[analytics.devices[0].device].label}
                        </span>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <span className="text-lg font-bold text-zinc-400">אין נתונים</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center border border-zinc-200">
              <FiGlobe className="text-zinc-600" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">דפדפן מוביל</p>
              <p className="text-lg font-bold text-zinc-900">
                {analytics?.browsers[0]
                  ? browserLabels[analytics.browsers[0].browser] || analytics.browsers[0].browser
                  : "אין נתונים"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">
            הלינקים הפופולריים
          </h3>
          {analytics?.topLinks && analytics.topLinks.length > 0 ? (
            <div className="space-y-2">
              {analytics.topLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center gap-4 bg-zinc-50 rounded-lg p-3 border border-zinc-100"
                >
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-zinc-900 font-medium truncate text-sm">
                      {link.title}
                    </p>
                  </div>
                  <div className="text-zinc-500 text-sm font-medium">
                    {link.clicks} קליקים
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8 text-sm">אין נתונים עדיין</p>
          )}
        </div>

        {/* Devices & Browsers */}
        <div className="space-y-6">
          {/* Devices */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">מכשירים</h3>
            {analytics?.devices && analytics.devices.length > 0 ? (
              <div className="space-y-3">
                {analytics.devices.map((item) => {
                  const deviceInfo = deviceLabels[item.device];
                  const DeviceIcon = deviceInfo?.icon || FiMonitor;
                  return (
                    <div key={item.device}>
                      <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="text-zinc-500 font-medium">
                          {Math.round((item.count / totalDevices) * 100)}%
                        </span>
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="text-zinc-600" size={16} />
                          <span className="text-zinc-900 font-medium">
                            {deviceInfo?.label || item.device}
                          </span>
                        </div>
                      </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full"
                        style={{
                          width: `${(item.count / totalDevices) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-4 text-sm">אין נתונים עדיין</p>
            )}
          </div>

          {/* Browsers */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-zinc-900 mb-4">דפדפנים</h3>
            {analytics?.browsers && analytics.browsers.length > 0 ? (
              <div className="space-y-3">
                {analytics.browsers.map((item) => (
                  <div key={item.browser}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-500 font-medium">
                        {Math.round((item.count / totalBrowsers) * 100)}%
                      </span>
                      <span className="text-zinc-900 font-medium">
                        {browserLabels[item.browser] || item.browser}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full"
                        style={{
                          width: `${(item.count / totalBrowsers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-4 text-sm">אין נתונים עדיין</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


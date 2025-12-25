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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalDevices = analytics?.devices.reduce((sum, d) => sum + d.count, 0) || 0;
  const totalBrowsers = analytics?.browsers.reduce((sum, b) => sum + b.count, 0) || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">אנליטיקס</h1>
          <p className="text-white/60 mt-1">
            עקוב אחר הביצועים של הלינקים שלך
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={7}>7 ימים אחרונים</option>
          <option value={30}>30 ימים אחרונים</option>
          <option value={90}>90 ימים אחרונים</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">סה״כ קליקים</p>
              <p className="text-3xl font-bold text-white">
                {analytics?.totalClicks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FiUsers className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">לינקים פעילים</p>
              <p className="text-3xl font-bold text-white">
                {analytics?.topLinks.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
              <FiMonitor className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">מכשיר מוביל</p>
              {analytics?.devices[0] && deviceLabels[analytics.devices[0].device] ? (
                <div className="flex items-center gap-2 justify-end">
                  {(() => {
                    const DeviceIcon = deviceLabels[analytics.devices[0].device].icon;
                    return (
                      <>
                        <DeviceIcon className="text-white" size={20} />
                        <span className="text-xl font-bold text-white">
                          {deviceLabels[analytics.devices[0].device].label}
                        </span>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <span className="text-xl font-bold text-white">אין נתונים</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">דפדפן מוביל</p>
              <p className="text-xl font-bold text-white">
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
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            הלינקים הפופולריים
          </h3>
          {analytics?.topLinks && analytics.topLinks.length > 0 ? (
            <div className="space-y-3">
              {analytics.topLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center gap-4 bg-white/5 rounded-xl p-3"
                >
                  <div className="w-8 h-8 bg-indigo-600/30 rounded-lg flex items-center justify-center text-indigo-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-white font-medium truncate">
                      {link.title}
                    </p>
                  </div>
                  <div className="text-white/60">
                    {link.clicks} קליקים
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-center py-8">אין נתונים עדיין</p>
          )}
        </div>

        {/* Devices & Browsers */}
        <div className="space-y-6">
          {/* Devices */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">מכשירים</h3>
            {analytics?.devices && analytics.devices.length > 0 ? (
              <div className="space-y-3">
                {analytics.devices.map((item) => {
                  const deviceInfo = deviceLabels[item.device];
                  const DeviceIcon = deviceInfo?.icon || FiMonitor;
                  return (
                    <div key={item.device}>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-white/60">
                          {Math.round((item.count / totalDevices) * 100)}%
                        </span>
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="text-white/80" size={16} />
                          <span className="text-white">
                            {deviceInfo?.label || item.device}
                          </span>
                        </div>
                      </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
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
              <p className="text-white/60 text-center py-4">אין נתונים עדיין</p>
            )}
          </div>

          {/* Browsers */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">דפדפנים</h3>
            {analytics?.browsers && analytics.browsers.length > 0 ? (
              <div className="space-y-3">
                {analytics.browsers.map((item) => (
                  <div key={item.browser}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">
                        {Math.round((item.count / totalBrowsers) * 100)}%
                      </span>
                      <span className="text-white">
                        {browserLabels[item.browser] || item.browser}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                        style={{
                          width: `${(item.count / totalBrowsers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-4">אין נתונים עדיין</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


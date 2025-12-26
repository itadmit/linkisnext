"use client";

import { useState, useEffect, useCallback } from "react";
import { FiTrendingUp, FiTrendingDown, FiUsers, FiMonitor, FiGlobe, FiSmartphone, FiTablet, FiClock, FiMapPin } from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

interface Analytics {
  totalClicks: number;
  previousTotalClicks: number;
  growthPercentage: number;
  avgClicksPerDay: number;
  clicksByDay: Array<{ date: string; day: string; clicks: number }>;
  clicksByHour: Array<{ hour: number; clicks: number }>;
  topLinks: Array<{ id: string; title: string; clicks: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
}

const deviceLabels: Record<string, { label: string; icon: any; color: string }> = {
  mobile: { label: "מובייל", icon: FiSmartphone, color: "#6366f1" },
  desktop: { label: "מחשב", icon: FiMonitor, color: "#8b5cf6" },
  tablet: { label: "טאבלט", icon: FiTablet, color: "#ec4899" },
};

const browserLabels: Record<string, string> = {
  chrome: "Chrome",
  firefox: "Firefox",
  safari: "Safari",
  edge: "Edge",
  other: "אחר",
};

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">אין נתונים להצגה</p>
      </div>
    );
  }

  const totalDevices = analytics.devices.reduce((sum, d) => sum + d.count, 0) || 0;
  const totalBrowsers = analytics.browsers.reduce((sum, b) => sum + b.count, 0) || 0;

  // Prepare hourly data (fill missing hours with 0)
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourData = analytics.clicksByHour.find((h) => h.hour === i);
    return {
      hour: `${i}:00`,
      clicks: hourData ? hourData.clicks : 0,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">אנליטיקס מתקדם</h1>
          <p className="text-zinc-500 text-sm mt-1">
            עקוב אחר הביצועים של הלינקים שלך בפירוט
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
            <div className="text-right flex-1">
              <p className="text-zinc-500 text-xs mb-1">סה״כ קליקים</p>
              <p className="text-2xl font-bold text-zinc-900">
                {analytics.totalClicks.toLocaleString()}
              </p>
              {analytics.growthPercentage !== 0 && (
                <div className={`flex items-center gap-1 mt-1 ${analytics.growthPercentage > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {analytics.growthPercentage > 0 ? (
                    <FiTrendingUp size={14} />
                  ) : (
                    <FiTrendingDown size={14} />
                  )}
                  <span className="text-xs font-medium">
                    {analytics.growthPercentage > 0 ? "+" : ""}
                    {analytics.growthPercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
              <FiClock className="text-emerald-600" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">ממוצע יומי</p>
              <p className="text-2xl font-bold text-zinc-900">
                {analytics.avgClicksPerDay.toFixed(1)}
              </p>
              <p className="text-zinc-400 text-xs mt-1">קליקים ליום</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center border border-zinc-200">
              <FiUsers className="text-zinc-600" size={22} />
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">לינקים פעילים</p>
              <p className="text-2xl font-bold text-zinc-900">
                {analytics.topLinks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center border border-zinc-200">
              {analytics.devices[0] && deviceLabels[analytics.devices[0].device] ? (
                (() => {
                  const DeviceIcon = deviceLabels[analytics.devices[0].device].icon;
                  return <DeviceIcon className="text-zinc-600" size={22} />;
                })()
              ) : (
                <FiMonitor className="text-zinc-600" size={22} />
              )}
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs mb-1">מכשיר מוביל</p>
              {analytics.devices[0] && deviceLabels[analytics.devices[0].device] ? (
                <p className="text-lg font-bold text-zinc-900">
                  {deviceLabels[analytics.devices[0].device].label}
                </p>
              ) : (
                <p className="text-lg font-bold text-zinc-400">אין נתונים</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Clicks Over Time */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">
            קליקים לאורך זמן
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.clicksByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis 
                dataKey="day" 
                stroke="#71717a"
                fontSize={12}
              />
              <YAxis 
                stroke="#71717a"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks by Hour */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">
            קליקים לפי שעה
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis 
                dataKey="hour" 
                stroke="#71717a"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#71717a"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Links */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">
            הלינקים הפופולריים
          </h3>
          {analytics.topLinks && analytics.topLinks.length > 0 ? (
            <div className="space-y-2">
              {analytics.topLinks.slice(0, 5).map((link, index) => (
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
                    {link.clicks}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8 text-sm">אין נתונים עדיין</p>
          )}
        </div>

        {/* Devices Pie Chart */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">מכשירים</h3>
          {analytics.devices && analytics.devices.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.devices.map((d) => ({
                      name: deviceLabels[d.device]?.label || d.device,
                      value: d.count,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceLabels[entry.device]?.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {analytics.devices.map((item) => {
                  const deviceInfo = deviceLabels[item.device];
                  const DeviceIcon = deviceInfo?.icon || FiMonitor;
                  return (
                    <div key={item.device} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="text-zinc-600" size={16} />
                        <span className="text-zinc-900 font-medium">
                          {deviceInfo?.label || item.device}
                        </span>
                      </div>
                      <span className="text-zinc-500 font-medium">
                        {Math.round((item.count / totalDevices) * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-zinc-500 text-center py-8 text-sm">אין נתונים עדיין</p>
          )}
        </div>

        {/* Browsers */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-900 mb-4">דפדפנים</h3>
          {analytics.browsers && analytics.browsers.length > 0 ? (
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

      {/* Countries (if available) */}
      {analytics.countries && analytics.countries.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiMapPin className="text-zinc-600" size={18} />
            <h3 className="text-base font-semibold text-zinc-900">מדינות</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.countries.map((item) => (
              <div key={item.country} className="text-center p-3 bg-zinc-50 rounded-lg">
                <p className="text-lg font-bold text-zinc-900">{item.count}</p>
                <p className="text-sm text-zinc-600">{item.country}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

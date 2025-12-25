"use client";

import { useState, useEffect, useCallback } from "react";
import { FiEye, FiTrash2, FiFileText, FiFilter } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  landingPageId: string;
  landingPage: {
    name: string;
    slug: string;
  };
  formData: string; // JSON string
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLandingPage, setFilterLandingPage] = useState<string>("all");

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      toast.error("שגיאה בטעינת הלידים");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("שגיאה בעדכון הסטטוס");

      toast.success("הסטטוס עודכן");
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("האם למחוק את הליד?")) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("שגיאה במחיקת הליד");

      toast.success("הליד נמחק");
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExport = () => {
    const csv = [
      ["תאריך", "דף נחיתה", "שם", "אימייל", "טלפון", "הודעה", "סטטוס"].join(","),
      ...leads.map((lead) => {
        const data = JSON.parse(lead.formData);
        return [
          new Date(lead.createdAt).toLocaleString("he-IL"),
          lead.landingPage.name,
          data.name || "",
          data.email || "",
          data.phone || "",
          (data.message || "").replace(/"/g, '""'),
          lead.status,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("הקובץ הורד");
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterStatus !== "all" && lead.status !== filterStatus) return false;
    if (filterLandingPage !== "all" && lead.landingPageId !== filterLandingPage) return false;
    return true;
  });

  const uniqueLandingPages = Array.from(
    new Set(leads.map((lead) => lead.landingPageId))
  ).map((id) => {
    const lead = leads.find((l) => l.landingPageId === id);
    return { id, name: lead?.landingPage.name || "" };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedLeadData = selectedLead ? JSON.parse(selectedLead.formData) : null;

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">מאגר לידים</h1>
            <p className="text-zinc-500 text-sm mt-1">
              כל הלידים שהתקבלו מדפי הנחיתה שלך
            </p>
          </div>
          <Button onClick={handleExport} variant="secondary">
            <FiFileText className="ml-2" />
            ייצא ל-CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6 flex items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FiFilter className="text-zinc-500" />
            <span className="text-zinc-700 font-medium">סינון:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="new">חדש</option>
            <option value="contacted">טופל</option>
            <option value="archived">ארכיון</option>
          </select>
          <select
            value={filterLandingPage}
            onChange={(e) => setFilterLandingPage(e.target.value)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          >
            <option value="all">כל דפי הנחיתה</option>
            {uniqueLandingPages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          <div className="mr-auto text-zinc-600 font-medium">
            {filteredLeads.length} לידים
          </div>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-xl shadow-sm">
            <p className="text-zinc-500">אין לידים להצגה</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const data = JSON.parse(lead.formData);
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`bg-white border border-zinc-200 rounded-xl p-4 cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all shadow-sm ${
                    selectedLead?.id === lead.id ? "ring-2 ring-zinc-900 border-zinc-900" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-zinc-900 font-semibold">
                          {data.name || "ללא שם"}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            lead.status === "new"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : lead.status === "contacted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {lead.status === "new"
                            ? "חדש"
                            : lead.status === "contacted"
                            ? "טופל"
                            : "ארכיון"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span>{data.email || "ללא אימייל"}</span>
                        <span>•</span>
                        <span>{lead.landingPage.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(lead.createdAt).toLocaleString("he-IL")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                      <FiEye size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar - Lead Details */}
      {selectedLead && (
        <div className="w-96 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">פרטי ליד</h2>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-zinc-400 hover:text-zinc-900 p-1 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Form Data */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-3 text-sm">פרטי הטופס</h3>
              <div className="space-y-2">
                {Object.entries(selectedLeadData || {}).map(([key, value]) => (
                  <div key={key} className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <p className="text-zinc-500 text-xs mb-1 font-medium">{key}</p>
                    <p className="text-zinc-900 text-sm">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-3 text-sm">מידע נוסף</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">דף נחיתה:</span>
                  <span className="text-zinc-900 font-medium">{selectedLead.landingPage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">תאריך:</span>
                  <span className="text-zinc-900 font-medium">
                    {new Date(selectedLead.createdAt).toLocaleString("he-IL")}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-3 text-sm">סטטוס</h3>
              <select
                value={selectedLead.status}
                onChange={(e) =>
                  handleStatusChange(selectedLead.id, e.target.value)
                }
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="new">חדש</option>
                <option value="contacted">טופל</option>
                <option value="archived">ארכיון</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-zinc-900 font-semibold mb-3 text-sm">הערות</h3>
              <textarea
                value={selectedLead.notes || ""}
                onChange={async (e) => {
                  const res = await fetch(`/api/leads/${selectedLead.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: e.target.value }),
                  });
                  if (res.ok) {
                    setSelectedLead({ ...selectedLead, notes: e.target.value });
                  }
                }}
                className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                rows={4}
                placeholder="הוסף הערות על הליד..."
                dir="rtl"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-zinc-100">
              <Button
                variant="secondary"
                onClick={() => handleDelete(selectedLead.id)}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FiTrash2 className="ml-2" />
                מחק
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


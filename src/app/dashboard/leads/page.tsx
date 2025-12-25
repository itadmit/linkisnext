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
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
            <h1 className="text-3xl font-bold text-white">מאגר לידים</h1>
            <p className="text-white/60 mt-1">
              כל הלידים שהתקבלו מדפי הנחיתה שלך
            </p>
          </div>
          <Button onClick={handleExport} variant="secondary">
            <FiFileText className="ml-2" />
            ייצא ל-CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-white/60" />
            <span className="text-white/80">סינון:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="new">חדש</option>
            <option value="contacted">טופל</option>
            <option value="archived">ארכיון</option>
          </select>
          <select
            value={filterLandingPage}
            onChange={(e) => setFilterLandingPage(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">כל דפי הנחיתה</option>
            {uniqueLandingPages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          <div className="mr-auto text-white/60">
            {filteredLeads.length} לידים
          </div>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-white/60">אין לידים להצגה</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const data = JSON.parse(lead.formData);
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all ${
                    selectedLead?.id === lead.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">
                          {data.name || "ללא שם"}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === "new"
                              ? "bg-blue-500/20 text-blue-400"
                              : lead.status === "contacted"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {lead.status === "new"
                            ? "חדש"
                            : lead.status === "contacted"
                            ? "טופל"
                            : "ארכיון"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
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
                      className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
        <div className="w-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">פרטי ליד</h2>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Form Data */}
            <div>
              <h3 className="text-white font-semibold mb-3">פרטי הטופס</h3>
              <div className="space-y-2">
                {Object.entries(selectedLeadData || {}).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-sm mb-1">{key}</p>
                    <p className="text-white">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-white font-semibold mb-3">מידע נוסף</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">דף נחיתה:</span>
                  <span className="text-white">{selectedLead.landingPage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">תאריך:</span>
                  <span className="text-white">
                    {new Date(selectedLead.createdAt).toLocaleString("he-IL")}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-white font-semibold mb-3">סטטוס</h3>
              <select
                value={selectedLead.status}
                onChange={(e) =>
                  handleStatusChange(selectedLead.id, e.target.value)
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="new">חדש</option>
                <option value="contacted">טופל</option>
                <option value="archived">ארכיון</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-white font-semibold mb-3">הערות</h3>
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
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                rows={4}
                placeholder="הוסף הערות על הליד..."
                dir="rtl"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                onClick={() => handleDelete(selectedLead.id)}
                className="flex-1 text-red-400 hover:text-red-300"
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


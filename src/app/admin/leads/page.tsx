"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Hotel, Trash2, Search, Filter } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  hotel: string | null;
  message: string | null;
  category: string | null;
  source: string;
  status: string;
  refNo: string | null;
  avgRoomRent: string | null;
  timeline: string | null;
  propertyType: string | null;
  projectStage: string | null;
  items: string | null;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  new: "bg-emerald/20 text-emerald-400 border-emerald/30",
  contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  quoted: "bg-brass/20 text-brass border-brass/30",
  closed: "bg-white/10 text-sand border-white/20",
};

const sourceLabels: Record<string, string> = {
  "contact-page": "Contact Page",
  quotation: "Quotation",
  "catalogue-page": "Catalogue",
  "dealer-application": "Dealer",
  "career-application": "Career",
  "enquiry-modal": "Enquiry",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    const res = await fetch(`/api/admin/leads?${params}`);
    const data = await res.json();
    if (data.ok) setLeads(data.leads);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
    setSelectedLead(null);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    fetchLeads();
    setSelectedLead(null);
  };

  const filtered = leads.filter((l) =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.hotel || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-2">Leads & Quotations</h1>
      <p className="font-body text-sm text-sand mb-6">{leads.length} total leads</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/50" />
          <input
            type="text"
            placeholder="Search by name, phone, hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Leads table */}
      <div className="glass-on-charcoal rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Name</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Phone</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Hotel</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">Source</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Status</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-ivory font-medium">{lead.name}</p>
                    {lead.refNo && <p className="font-mono text-[10px] text-brass">{lead.refNo}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-sand">{lead.phone}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-body text-sm text-sand">{lead.hotel || "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-mono text-[11px] text-sand">{sourceLabels[lead.source] || lead.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider ${statusColors[lead.status] || statusColors.closed}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono text-[11px] text-sand">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                      className="text-sand/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="font-body text-sm text-sand py-12 text-center">No leads found</p>
        )}
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="glass-on-charcoal rounded-24px p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-ivory">{selectedLead.name}</h2>
              <button onClick={() => setSelectedLead(null)} className="text-sand hover:text-ivory">
                ✕
              </button>
            </div>

            {selectedLead.refNo && (
              <div className="mb-4 rounded-xl bg-brass/10 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-brass">Reference</p>
                <p className="font-mono text-sm text-ivory">{selectedLead.refNo}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Phone</p>
                <p className="font-body text-sm text-ivory">{selectedLead.phone}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Email</p>
                <p className="font-body text-sm text-ivory">{selectedLead.email || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Hotel</p>
                <p className="font-body text-sm text-ivory">{selectedLead.hotel || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Source</p>
                <p className="font-body text-sm text-ivory">{sourceLabels[selectedLead.source] || selectedLead.source}</p>
              </div>
              {selectedLead.avgRoomRent && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Avg Room Rent</p>
                  <p className="font-body text-sm text-ivory">{selectedLead.avgRoomRent}</p>
                </div>
              )}
              {selectedLead.timeline && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Timeline</p>
                  <p className="font-body text-sm text-ivory">{selectedLead.timeline}</p>
                </div>
              )}
              {selectedLead.propertyType && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Property Type</p>
                  <p className="font-body text-sm text-ivory">{selectedLead.propertyType}</p>
                </div>
              )}
              {selectedLead.projectStage && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Project Stage</p>
                  <p className="font-body text-sm text-ivory">{selectedLead.projectStage}</p>
                </div>
              )}
            </div>

            {selectedLead.message && (
              <div className="mb-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Message</p>
                <p className="font-body text-sm text-ivory">{selectedLead.message}</p>
              </div>
            )}

            {selectedLead.items && (
              <div className="mb-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-2">Selected Products</p>
                <div className="rounded-xl bg-white/5 p-4">
                  {JSON.parse(selectedLead.items).map((item: { model: string; name: string; quantity: number }, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <span className="font-body text-sm text-ivory">{item.name} <span className="font-mono text-[10px] text-brass">({item.model})</span></span>
                      <span className="font-mono text-sm text-sand">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status update */}
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-2">Update Status</p>
              <div className="flex gap-2">
                {["new", "contacted", "quoted", "closed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedLead.id, s)}
                    className={`rounded-full px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                      selectedLead.status === s
                        ? "bg-brass text-charcoal"
                        : "bg-white/5 text-sand hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-[#25D366] py-3 text-center text-sm font-medium text-white"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 rounded-full bg-white/10 py-3 text-center text-sm font-medium text-ivory"
              >
                Call
              </a>
              <button
                onClick={() => deleteLead(selectedLead.id)}
                className="rounded-full bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

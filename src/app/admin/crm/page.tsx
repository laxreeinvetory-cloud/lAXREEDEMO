"use client";

/**
 * Central Leads CRM — unified lead management dashboard.
 *
 * Route: /admin/crm
 * Data:  GET /api/admin/leads (fetches all leads, high limit)
 *        PATCH /api/admin/leads { id, status }
 *        DELETE /api/admin/leads?id=...
 *
 * Features:
 *  - Tabs: All | Contact | Quotation | Dealer | Career | Enquiry | Catalogue
 *  - Search by name / phone / email
 *  - Export filtered leads to CSV
 *  - Click status badge to cycle new → contacted → quoted → closed
 *  - Row actions: view, WhatsApp, call, delete
 *  - Lead detail modal showing every persisted field
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Eye,
  MessageCircle,
  Phone,
  Trash2,
  X,
  RefreshCw,
  Mail,
  Hotel,
  ClipboardList,
} from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

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

const TABS = [
  { key: "all", label: "All" },
  { key: "contact", label: "Contact" },
  { key: "quotation", label: "Quotation" },
  { key: "dealer", label: "Dealer" },
  { key: "career", label: "Career" },
  { key: "enquiry", label: "Enquiry" },
  { key: "catalogue", label: "Catalogue" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Map a tab to the set of source values it represents (both short & long forms).
const TAB_SOURCES: Record<TabKey, string[]> = {
  all: [],
  contact: ["contact-page", "contact"],
  quotation: ["quotation"],
  dealer: ["dealer-application", "dealer"],
  career: ["career-application", "career"],
  enquiry: ["enquiry-modal", "enquiry"],
  catalogue: ["catalogue-page", "catalogue"],
};

const SOURCE_LABELS: Record<string, string> = {
  "contact-page": "Contact",
  contact: "Contact",
  quotation: "Quotation",
  "catalogue-page": "Catalogue",
  catalogue: "Catalogue",
  "dealer-application": "Dealer",
  dealer: "Dealer",
  "career-application": "Career",
  career: "Career",
  "enquiry-modal": "Enquiry",
  enquiry: "Enquiry",
};

const STATUS_CYCLE = ["new", "contacted", "quoted", "closed"] as const;

const STATUS_BADGE: Record<string, string> = {
  new: "bg-emerald/15 text-emerald-300 border-emerald/30",
  contacted: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  quoted: "bg-brass/15 text-brass border-brass/30",
  closed: "bg-white/10 text-sand border-white/20",
  approved: "bg-emerald/15 text-emerald-300 border-emerald/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

function nextStatus(current: string): string {
  const idx = STATUS_CYCLE.indexOf(current as (typeof STATUS_CYCLE)[number]);
  if (idx === -1) return "new";
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  } catch {
    return iso;
  }
}

function parseItems(
  items: string | null
): Array<{ model: string; name: string; quantity: number }> {
  if (!items) return [];
  try {
    const parsed = JSON.parse(items);
    if (Array.isArray(parsed))
      return parsed as Array<{ model: string; name: string; quantity: number }>;
    return [];
  } catch {
    return [];
  }
}

function exportCSV(leads: Lead[]) {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Source",
    "Status",
    "Hotel",
    "Category",
    "Ref No",
    "Avg Room Rent",
    "Timeline",
    "Property Type",
    "Project Stage",
    "Date",
    "Message",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.email || "",
    SOURCE_LABELS[l.source] || l.source,
    l.status,
    l.hotel || "",
    l.category || "",
    l.refNo || "",
    l.avgRoomRent || "",
    l.timeline || "",
    l.propertyType || "",
    l.projectStage || "",
    new Date(l.createdAt).toISOString(),
    (l.message || "").replace(/\s+/g, " "),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laxree-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminCrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [cycling, setCycling] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads?limit=10000", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setLeads((data.leads as Lead[]) || []);
    } catch {
      toast("error", "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    const sources = TAB_SOURCES[tab];
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (sources.length && !sources.includes(l.source)) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q)
      );
    });
  }, [leads, tab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const t of TABS) {
      if (t.key === "all") continue;
      const sources = TAB_SOURCES[t.key];
      counts[t.key] = leads.filter((l) => sources.includes(l.source)).length;
    }
    return counts;
  }, [leads]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setCycling(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
        toast("success", `Status updated to "${status}".`);
      } else {
        toast("error", "Failed to update status.");
      }
    } catch {
      toast("error", "Network error — could not update status.");
    } finally {
      setCycling(null);
    }
  }, []);

  const deleteLead = useCallback(async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setSelected((prev) => (prev && prev.id === id ? null : prev));
        toast("success", "Lead deleted.");
      } else {
        toast("error", "Failed to delete lead.");
      }
    } catch {
      toast("error", "Network error — could not delete lead.");
    }
  }, []);

  const cycleBadge = (lead: Lead) => {
    const ns = nextStatus(lead.status);
    updateStatus(lead.id, ns);
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-brass mb-1.5">UNIFIED LEADS</p>
          <h1 className="font-display text-3xl text-ivory">Central Leads CRM</h1>
          <p className="font-body text-sm text-sand mt-1.5">
            {filtered.length} shown · {leads.length} total leads
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => fetchLeads()}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              if (filtered.length === 0) {
                toast("info", "No leads to export for the current filter.");
                return;
              }
              exportCSV(filtered);
              toast("success", `Exported ${filtered.length} leads to CSV.`);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-500"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brass text-charcoal"
                  : "bg-white/5 text-sand hover:bg-white/10 hover:text-ivory"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                  isActive ? "bg-charcoal/20 text-charcoal" : "bg-white/10 text-sand"
                }`}
              >
                {tabCounts[t.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/60" />
          <input
            type="text"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-sand/50 focus:border-brass focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sand hover:text-ivory"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Name</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden sm:table-cell">Source</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Status</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-sand">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(lead)}
                      className="text-left"
                    >
                      <p className="font-body text-sm text-ivory font-medium hover:text-brass transition-colors">
                        {lead.name}
                      </p>
                      {lead.refNo && (
                        <p className="font-mono text-[10px] text-brass">{lead.refNo}</p>
                      )}
                      {lead.hotel && (
                        <p className="font-body text-[11px] text-sand md:hidden">{lead.hotel}</p>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono text-sm text-sand">{lead.phone}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-body text-[12px] text-sand truncate block max-w-[200px]">
                      {lead.email || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-[11px] text-sand uppercase tracking-wider">
                      {SOURCE_LABELS[lead.source] || lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => cycleBadge(lead)}
                      disabled={cycling === lead.id}
                      title="Click to cycle status"
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors hover:brightness-125 disabled:opacity-50 ${
                        STATUS_BADGE[lead.status] || STATUS_BADGE.closed
                      }`}
                    >
                      {cycling === lead.id ? "…" : lead.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-mono text-[11px] text-sand">{fmtDate(lead.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelected(lead)}
                        title="View details"
                        className="rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp"
                        className="rounded-md p-1.5 text-sand hover:bg-emerald/10 hover:text-emerald-300 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        title="Call"
                        className="rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        title="Delete"
                        className="rounded-md p-1.5 text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-10 w-10 text-sand/30 mb-3" />
            <p className="font-body text-sm text-sand">No leads found for this view.</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-mono uppercase tracking-wider text-brass hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <LeadDetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onStatus={(s) => updateStatus(selected.id, s)}
          onDelete={() => deleteLead(selected.id)}
        />
      )}

      <AdminToaster />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lead detail modal
   ───────────────────────────────────────────────────────────── */
function LeadDetailModal({
  lead,
  onClose,
  onStatus,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onStatus: (status: string) => void;
  onDelete: () => void;
}) {
  const items = parseItems(lead.items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/5 border border-white/10 rounded-xl w-full max-w-2xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-charcoal/95 px-6 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-ivory truncate">{lead.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brass">
                {SOURCE_LABELS[lead.source] || lead.source}
              </span>
              <span className="text-sand/40">·</span>
              <span className="font-mono text-[10px] text-sand">{fmtDate(lead.createdAt)}</span>
              {lead.refNo && (
                <>
                  <span className="text-sand/40">·</span>
                  <span className="font-mono text-[10px] text-brass">{lead.refNo}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald/20 px-3.5 py-2 text-sm font-medium text-emerald-300 border border-emerald/30 transition-colors hover:bg-emerald/30"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>

          {/* Contact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={lead.phone} />
            <DetailField icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={lead.email || "—"} />
            <DetailField icon={<Hotel className="h-3.5 w-3.5" />} label="Hotel / Property" value={lead.hotel || "—"} />
            <DetailField label="Category" value={lead.category || "—"} />
            {lead.avgRoomRent && (
              <DetailField label="Avg Room Rent" value={lead.avgRoomRent} />
            )}
            {lead.timeline && (
              <DetailField label="Timeline" value={lead.timeline} />
            )}
            {lead.propertyType && (
              <DetailField label="Property Type" value={lead.propertyType} />
            )}
            {lead.projectStage && (
              <DetailField label="Project Stage" value={lead.projectStage} />
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <p className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Message
              </p>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
                <p className="font-body text-sm text-ivory whitespace-pre-wrap leading-relaxed">
                  {lead.message}
                </p>
              </div>
            </div>
          )}

          {/* Selected products (quotations) */}
          {items.length > 0 && (
            <div>
              <p className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Selected Products ({items.length})
              </p>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] divide-y divide-white/5">
                {items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between px-3.5 py-2.5">
                    <div className="min-w-0">
                      <p className="font-body text-sm text-ivory truncate">{it.name}</p>
                      <p className="font-mono text-[10px] text-brass">{it.model}</p>
                    </div>
                    <span className="font-mono text-xs text-sand shrink-0 ml-3">Qty {it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status update */}
          <div>
            <p className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_CYCLE.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(s)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    lead.status === s
                      ? "bg-brass text-charcoal"
                      : "bg-white/5 text-sand border border-white/10 hover:bg-white/10 hover:text-ivory"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-charcoal/95 px-6 py-3.5 backdrop-blur-xl">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-300 border border-red-500/20 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="font-body text-sm text-ivory break-words">{value}</p>
    </div>
  );
}

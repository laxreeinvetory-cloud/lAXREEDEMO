"use client";

/**
 * Dealers CMS — dealer application management.
 *
 * Route: /admin/dealers
 * Data:  GET  /api/admin/leads?source=dealer-application
 *        PATCH /api/admin/leads { id, status }  — values: new | approved | rejected
 *        DELETE /api/admin/leads?id=...
 *        GET/PUT /api/admin/cms  — key "dealer-notes" stores { [leadId]: string }
 *
 * The dealer application form (src/app/dealers/page.tsx) persists structured
 * data as a multi-line envelope in Lead.message:
 *    Company: <name>
 *    City/Region: <city>
 *    Years in Hospitality Business: <n>
 *    Current Business: <text>
 * This page parses that envelope (plus GST/PAN if present) into discrete fields.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Mail,
  StickyNote,
  Save,
} from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
};

type ParsedDealer = {
  company: string;
  city: string;
  years: string;
  currentBusiness: string;
  gst: string;
  pan: string;
};

const STATUS_LABEL: Record<string, string> = {
  new: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-white/10 text-sand border-white/20",
  approved: "bg-emerald/15 text-emerald-300 border-emerald/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-sand/40 focus:border-brass focus:outline-none";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";

function parseDealer(message: string | null): ParsedDealer {
  const out: ParsedDealer = {
    company: "",
    city: "",
    years: "",
    currentBusiness: "",
    gst: "",
    pan: "",
  };
  if (!message) return out;
  const lines = message.split("\n");
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (key === "company") out.company = val;
    else if (key.includes("city") || key.includes("region")) out.city = val;
    else if (key.includes("year")) out.years = val;
    else if (key.includes("current business")) out.currentBusiness = val;
    else if (key.includes("gst")) out.gst = val;
    else if (key.includes("pan")) out.pan = val;
  }
  return out;
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

export default function AdminDealersPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "approved" | "rejected">("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads?source=dealer-application&limit=10000", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok) setLeads((data.leads as Lead[]) || []);
    } catch {
      toast("error", "Failed to load dealer applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/cms?key=dealer-notes", { cache: "no-store" });
      const data = await res.json();
      const value = data?.value;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        setNotes(value as Record<string, string>);
      }
    } catch {
      /* notes are optional — fail silently */
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchNotes();
  }, [fetchLeads, fetchNotes]);

  const counts = useMemo(() => {
    const c = { all: leads.length, new: 0, approved: 0, rejected: 0 };
    for (const l of leads) {
      if (l.status === "approved") c.approved++;
      else if (l.status === "rejected") c.rejected++;
      else c.new++;
    }
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all") {
        if (statusFilter === "new" && l.status !== "new" && l.status !== "pending") return false;
        if (statusFilter === "approved" && l.status !== "approved") return false;
        if (statusFilter === "rejected" && l.status !== "rejected") return false;
      }
      if (!q) return true;
      const p = parseDealer(l.message);
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter]);

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      setUpdating(id);
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
          toast("success", `Application ${STATUS_LABEL[status] || status}.`);
        } else {
          toast("error", "Failed to update status.");
        }
      } catch {
        toast("error", "Network error — could not update status.");
      } finally {
        setUpdating(null);
      }
    },
    []
  );

  const deleteLead = useCallback(
    async (id: string) => {
      if (!confirm("Delete this dealer application?")) return;
      try {
        const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.ok) {
          setLeads((prev) => prev.filter((l) => l.id !== id));
          setSelected((prev) => (prev && prev.id === id ? null : prev));
          toast("success", "Application deleted.");
        } else {
          toast("error", "Failed to delete application.");
        }
      } catch {
        toast("error", "Network error — could not delete.");
      }
    },
    []
  );

  const saveNote = async (leadId: string) => {
    setSavingNote(true);
    const next = { ...notes, [leadId]: noteDraft };
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "dealer-notes", value: next }),
      });
      const data = await res.json();
      if (data.ok) {
        setNotes(next);
        toast("success", "Internal note saved.");
      } else {
        toast("error", "Failed to save note.");
      }
    } catch {
      toast("error", "Network error — could not save note.");
    } finally {
      setSavingNote(false);
    }
  };

  const openDetail = (lead: Lead) => {
    setSelected(lead);
    setNoteDraft(notes[lead.id] || "");
  };

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-brass mb-1.5">CHANNEL PARTNERS</p>
          <h1 className="font-display text-3xl text-ivory">Dealers CMS</h1>
          <p className="font-body text-sm text-sand mt-1.5">
            {counts.all} applications · {counts.approved} approved · {counts.rejected} rejected ·{" "}
            {counts.new} pending
          </p>
        </div>
        <button
          onClick={() => fetchLeads()}
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {/* Status filter chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(
          [
            { key: "all", label: "All" },
            { key: "new", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ] as const
        ).map((chip) => (
          <button
            key={chip.key}
            onClick={() => setStatusFilter(chip.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              statusFilter === chip.key
                ? "bg-brass text-charcoal"
                : "bg-white/5 text-sand hover:bg-white/10 hover:text-ivory"
            }`}
          >
            {chip.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                statusFilter === chip.key
                  ? "bg-charcoal/20 text-charcoal"
                  : "bg-white/10 text-sand"
              }`}
            >
              {counts[chip.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/60" />
          <input
            type="text"
            placeholder="Search by company, contact, phone, city…"
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
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Company</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Contact</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">City</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">Years</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Status</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-sand">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const p = parseDealer(lead.message);
                return (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(lead)} className="text-left">
                        <p className="font-body text-sm text-ivory font-medium hover:text-brass transition-colors">
                          {p.company || lead.name}
                        </p>
                        <p className="font-body text-[11px] text-sand">{lead.name}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-body text-sm text-sand">{lead.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-mono text-[12px] text-sand">{lead.phone}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-body text-sm text-sand">{p.city || "—"}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-mono text-[12px] text-sand">{p.years || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${
                          STATUS_BADGE[lead.status] || STATUS_BADGE.new
                        }`}
                      >
                        {STATUS_LABEL[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-sand">{fmtDate(lead.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetail(lead)}
                          title="View details"
                          className="rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {lead.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(lead.id, "approved")}
                            disabled={updating === lead.id}
                            title="Approve"
                            className="rounded-md p-1.5 text-sand hover:bg-emerald/10 hover:text-emerald-300 transition-colors disabled:opacity-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {lead.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(lead.id, "rejected")}
                            disabled={updating === lead.id}
                            title="Reject"
                            className="rounded-md p-1.5 text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            <Building2 className="h-10 w-10 text-sand/30 mb-3" />
            <p className="font-body text-sm text-sand">
              {search || statusFilter !== "all"
                ? "No applications match the current filter."
                : "No dealer applications yet."}
            </p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <DealerDetailModal
          lead={selected}
          notes={notes}
          noteDraft={noteDraft}
          setNoteDraft={setNoteDraft}
          savingNote={savingNote}
          updating={updating}
          onSaveNote={() => saveNote(selected.id)}
          onStatus={(s) => updateStatus(selected.id, s)}
          onDelete={() => deleteLead(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}

      <AdminToaster />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dealer detail modal
   ───────────────────────────────────────────────────────────── */
function DealerDetailModal({
  lead,
  notes,
  noteDraft,
  setNoteDraft,
  savingNote,
  updating,
  onSaveNote,
  onStatus,
  onDelete,
  onClose,
}: {
  lead: Lead;
  notes: Record<string, string>;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  savingNote: boolean;
  updating: string | null;
  onSaveNote: () => void;
  onStatus: (status: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const p = parseDealer(lead.message);
  const existingNote = notes[lead.id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/5 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-charcoal/95 px-6 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-ivory truncate">
              {p.company || lead.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-sand">Contact: {lead.name}</span>
              <span className="text-sand/40">·</span>
              <span className="font-mono text-[10px] text-sand">{fmtDate(lead.createdAt)}</span>
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

        <div className="px-6 py-5 space-y-5">
          {/* Status actions */}
          <div>
            <p className={labelClass}>Application Status</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onStatus("new")}
                disabled={updating === lead.id}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 ${
                  lead.status === "new"
                    ? "bg-brass text-charcoal"
                    : "bg-white/5 text-sand border border-white/10 hover:bg-white/10"
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> Pending
              </button>
              <button
                onClick={() => onStatus("approved")}
                disabled={updating === lead.id}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 ${
                  lead.status === "approved"
                    ? "bg-emerald/20 text-emerald-300 border border-emerald/30"
                    : "bg-white/5 text-sand border border-white/10 hover:bg-emerald/10 hover:text-emerald-300"
                }`}
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                onClick={() => onStatus("rejected")}
                disabled={updating === lead.id}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 ${
                  lead.status === "rejected"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-white/5 text-sand border border-white/10 hover:bg-red-500/10 hover:text-red-400"
                }`}
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald/20 px-3.5 py-2 text-sm font-medium text-emerald-300 border border-emerald/30 hover:bg-emerald/30"
            >
              <Phone className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white border border-white/15 hover:bg-white/15"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white border border-white/15 hover:bg-white/15"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField icon={<Building2 className="h-3.5 w-3.5" />} label="Company" value={p.company || "—"} />
            <DetailField icon={<MapPin className="h-3.5 w-3.5" />} label="City / Region" value={p.city || "—"} />
            <DetailField label="Contact Person" value={lead.name} />
            <DetailField icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={lead.phone} />
            <DetailField icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={lead.email || "—"} />
            <DetailField label="Years in Business" value={p.years || "—"} />
            <DetailField label="GST Number" value={p.gst || "—"} />
            <DetailField label="PAN Number" value={p.pan || "—"} />
          </div>

          {/* Current business */}
          {p.currentBusiness && p.currentBusiness !== "—" && (
            <div>
              <p className={labelClass}>Current Business</p>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
                <p className="font-body text-sm text-ivory whitespace-pre-wrap leading-relaxed">
                  {p.currentBusiness}
                </p>
              </div>
            </div>
          )}

          {/* Internal notes */}
          <div>
            <p className={labelClass}>
              <StickyNote className="inline h-3 w-3 mr-1 -mt-0.5" />
              Internal Notes {existingNote && <span className="text-emerald-400 normal-case font-normal">(saved)</span>}
            </p>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Add internal notes about this dealer application…"
              rows={3}
              className={`${inputClass} resize-y`}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={onSaveNote}
                disabled={savingNote}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {savingNote ? "Saving…" : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-charcoal/95 px-6 py-3.5 backdrop-blur-xl">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3.5 py-2 text-sm font-medium text-red-300 border border-red-500/20 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 hover:bg-white/15"
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

"use client";

/**
 * Careers CMS — job listings + applications.
 *
 * Route: /admin/careers
 *
 * Two sections:
 *  1. Job Listings  — CRUD stored in SiteContent via PUT /api/admin/cms { key: "careers:jobs", value: [...] }
 *  2. Applications  — career-application leads (GET /api/admin/leads?source=career-application),
 *                     with a resume-viewer modal that parses the stored message envelope.
 *
 * The career application form (src/app/career/page.tsx) persists its structured
 * data as a multi-line envelope in Lead.message:
 *    Position of Interest: <role>
 *    Years of Experience: <n>
 *    Resume Link: <url>
 *    Cover Note: <text>
 * This page parses that envelope back into discrete fields.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  FileText,
  ExternalLink,
  X,
  Search,
  MapPin,
  Building2,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import { toast, AdminToaster } from "@/lib/admin/admin-toast";

type Job = {
  id: string;
  title: string;
  department: string;
  experience: string;
  salary: string;
  location: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};

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

type ParsedApplication = {
  position: string;
  experience: string;
  resumeLink: string;
  coverNote: string;
};

const EMPTY_JOB: Omit<Job, "id" | "createdAt"> = {
  title: "",
  department: "",
  experience: "",
  salary: "",
  location: "",
  description: "",
  status: "active",
};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-sand/40 focus:border-brass focus:outline-none";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";

function parseApplication(message: string | null): ParsedApplication {
  const out: ParsedApplication = {
    position: "",
    experience: "",
    resumeLink: "",
    coverNote: "",
  };
  if (!message) return out;
  const lines = message.split("\n");
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase();
    const val = m[2].trim();
    if (key.includes("position")) out.position = val;
    else if (key.includes("experience")) out.experience = val;
    else if (key.includes("resume")) out.resumeLink = val;
    else if (key.includes("cover")) out.coverNote = val;
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

export default function AdminCareersPage() {
  const [view, setView] = useState<"jobs" | "applications">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Job, "id" | "createdAt">>(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  const [applications, setApplications] = useState<Lead[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearch, setAppSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Lead | null>(null);

  /* ── Jobs ── */
  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/admin/cms?key=careers:jobs", { cache: "no-store" });
      const data = await res.json();
      const value = data?.value;
      if (Array.isArray(value)) {
        setJobs(value as Job[]);
      } else {
        setJobs([]);
      }
    } catch {
      toast("error", "Failed to load job listings.");
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const persistJobs = useCallback(async (next: Job[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "careers:jobs", value: next }),
      });
      const data = await res.json();
      if (data.ok) {
        setJobs(next);
        return true;
      }
      toast("error", "Failed to save job listings.");
      return false;
    } catch {
      toast("error", "Network error — could not save.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const openCreate = () => {
    setDraft(EMPTY_JOB);
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (job: Job) => {
    setDraft({
      title: job.title,
      department: job.department,
      experience: job.experience,
      salary: job.salary,
      location: job.location,
      description: job.description,
      status: job.status,
    });
    setEditing(job);
    setCreating(true);
  };

  const saveJob = async () => {
    if (!draft.title.trim() || !draft.department.trim()) {
      toast("error", "Title and Department are required.");
      return;
    }
    let next: Job[];
    if (editing) {
      next = jobs.map((j) =>
        j.id === editing.id ? { ...editing, ...draft } : j
      );
    } else {
      const newJob: Job = {
        ...draft,
        id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      next = [newJob, ...jobs];
    }
    const ok = await persistJobs(next);
    if (ok) {
      toast("success", editing ? "Job listing updated." : "Job listing added.");
      setCreating(false);
      setEditing(null);
      setDraft(EMPTY_JOB);
    }
  };

  const toggleStatus = async (job: Job) => {
    const next = jobs.map((j) =>
      j.id === job.id
        ? { ...j, status: j.status === "active" ? ("inactive" as const) : ("active" as const) }
        : j
    );
    const ok = await persistJobs(next);
    if (ok) toast("success", `Job marked as ${job.status === "active" ? "inactive" : "active"}.`);
  };

  const deleteJob = async (job: Job) => {
    if (!confirm(`Delete "${job.title}"?`)) return;
    const next = jobs.filter((j) => j.id !== job.id);
    const ok = await persistJobs(next);
    if (ok) toast("success", "Job listing deleted.");
  };

  /* ── Applications ── */
  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await fetch(
        "/api/admin/leads?source=career-application&limit=10000",
        { cache: "no-store" }
      );
      const data = await res.json();
      if (data.ok) setApplications((data.leads as Lead[]) || []);
    } catch {
      toast("error", "Failed to load applications.");
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    if (view === "applications" && applications.length === 0 && !loadingApps) {
      fetchApplications();
    }
  }, [view, applications.length, loadingApps, fetchApplications]);

  const filteredApps = useMemo(() => {
    const q = appSearch.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q)
    );
  }, [applications, appSearch]);

  const activeJobs = jobs.filter((j) => j.status === "active").length;

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-brass mb-1.5">RECRUITMENT</p>
          <h1 className="font-display text-3xl text-ivory">Careers CMS</h1>
          <p className="font-body text-sm text-sand mt-1.5">
            {jobs.length} listings · {activeJobs} active · {applications.length} applications
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => (view === "jobs" ? fetchJobs() : fetchApplications())}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 transition-colors hover:bg-white/15"
          >
            <RefreshCw
              className={`h-4 w-4 ${view === "jobs" ? loadingJobs : loadingApps ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          {view === "jobs" && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-500"
            >
              <Plus className="h-4 w-4" /> Add Job
            </button>
          )}
        </div>
      </header>

      {/* View toggle */}
      <div className="mb-5 inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setView("jobs")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === "jobs"
              ? "bg-brass text-charcoal"
              : "text-sand hover:text-ivory"
          }`}
        >
          <Briefcase className="h-4 w-4" /> Job Listings
        </button>
        <button
          onClick={() => setView("applications")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === "applications"
              ? "bg-brass text-charcoal"
              : "text-sand hover:text-ivory"
          }`}
        >
          <FileText className="h-4 w-4" /> Applications
          {applications.length > 0 && (
            <span className="rounded-full bg-charcoal/20 px-1.5 py-0.5 text-[10px] font-mono">
              {applications.length}
            </span>
          )}
        </button>
      </div>

      {/* Jobs view */}
      {view === "jobs" && (
        <>
          {loadingJobs ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl py-16 text-center">
              <Briefcase className="h-10 w-10 text-sand/30 mx-auto mb-3" />
              <p className="font-body text-sm text-sand mb-4">
                No job listings yet. Add your first position.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
              >
                <Plus className="h-4 w-4" /> Add Job
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display text-base text-ivory">{job.title}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                          job.status === "active"
                            ? "bg-emerald/15 text-emerald-300 border-emerald/30"
                            : "bg-white/10 text-sand border-white/20"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-sand font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-brass" /> {job.department}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-brass" /> {job.location}
                        </span>
                      )}
                      {job.experience && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brass" /> {job.experience}
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center gap-1">
                          <Wallet className="h-3 w-3 text-brass" /> {job.salary}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="font-body text-[12px] text-sand/80 mt-2 line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStatus(job)}
                      title={job.status === "active" ? "Deactivate" : "Activate"}
                      className={`rounded-lg p-2 transition-colors ${
                        job.status === "active"
                          ? "text-emerald-300 hover:bg-emerald/10"
                          : "text-sand hover:bg-white/10"
                      }`}
                    >
                      {job.status === "active" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(job)}
                      title="Edit"
                      className="rounded-lg p-2 text-sand hover:bg-white/10 hover:text-brass transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteJob(job)}
                      title="Delete"
                      className="rounded-lg p-2 text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Applications view */}
      {view === "applications" && (
        <>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/60" />
              <input
                type="text"
                placeholder="Search applicants by name, phone or email…"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-sand/50 focus:border-brass focus:outline-none"
              />
            </div>
          </div>

          {loadingApps ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl py-16 text-center">
              <FileText className="h-10 w-10 text-sand/30 mx-auto mb-3" />
              <p className="font-body text-sm text-sand">
                {appSearch ? "No applicants match your search." : "No career applications yet."}
              </p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">Applicant</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">Position</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden sm:table-cell">Experience</th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">Applied</th>
                      <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-sand">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => {
                      const parsed = parseApplication(app.message);
                      return (
                        <tr
                          key={app.id}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.04]"
                        >
                          <td className="px-4 py-3">
                            <p className="font-body text-sm text-ivory font-medium">{app.name}</p>
                            <p className="font-mono text-[11px] text-sand">{app.phone}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="font-body text-sm text-ivory">
                              {parsed.position || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="font-mono text-[12px] text-sand">
                              {parsed.experience || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="font-mono text-[11px] text-sand">
                              {fmtDate(app.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/15 hover:bg-white/15 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5" /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Job editor modal */}
      {creating && (
        <JobEditorModal
          draft={draft}
          setDraft={setDraft}
          isEdit={!!editing}
          saving={saving}
          onSave={saveJob}
          onClose={() => {
            setCreating(false);
            setEditing(null);
            setDraft(EMPTY_JOB);
          }}
        />
      )}

      {/* Application detail modal */}
      {selectedApp && (
        <ApplicationModal
          lead={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      <AdminToaster />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Job editor modal
   ───────────────────────────────────────────────────────────── */
function JobEditorModal({
  draft,
  setDraft,
  isEdit,
  saving,
  onSave,
  onClose,
}: {
  draft: Omit<Job, "id" | "createdAt">;
  setDraft: (d: Omit<Job, "id" | "createdAt">) => void;
  isEdit: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const update = (key: keyof Omit<Job, "id" | "createdAt">, value: string) =>
    setDraft({ ...draft, [key]: value });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/5 border border-white/10 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-charcoal/95 px-6 py-4 backdrop-blur-xl">
          <h2 className="font-display text-lg text-ivory">
            {isEdit ? "Edit Job Listing" : "Add Job Listing"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelClass}>Job Title *</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Senior Sales Executive"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department *</label>
              <input
                type="text"
                value={draft.department}
                onChange={(e) => update("department", e.target.value)}
                placeholder="e.g. Sales"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Experience</label>
              <input
                type="text"
                value={draft.experience}
                onChange={(e) => update("experience", e.target.value)}
                placeholder="e.g. 3-5 years"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Salary</label>
              <input
                type="text"
                value={draft.salary}
                onChange={(e) => update("salary", e.target.value)}
                placeholder="e.g. ₹4-6 LPA"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Mumbai, India"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Roles, responsibilities, requirements…"
              rows={5}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-2">
              {(["active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update("status", s)}
                  className={`rounded-lg px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                    draft.status === s
                      ? "bg-brass text-charcoal"
                      : "bg-white/5 text-sand border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-white/10 bg-charcoal/95 px-6 py-3.5 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white border border-white/15 hover:bg-white/15"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Application detail modal
   ───────────────────────────────────────────────────────────── */
function ApplicationModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const parsed = parseApplication(lead.message);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/5 border border-white/10 rounded-xl w-full max-w-lg max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-charcoal/95 px-6 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-ivory truncate">{lead.name}</h2>
            <p className="font-mono text-[10px] text-sand mt-0.5">
              Applied {fmtDate(lead.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-sand hover:bg-white/10 hover:text-ivory"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
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
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white border border-white/15 hover:bg-white/15"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
            {parsed.resumeLink && (
              <a
                href={parsed.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-brass px-3.5 py-2 text-sm font-semibold text-charcoal hover:brightness-110"
              >
                <ExternalLink className="h-4 w-4" /> Open Resume
              </a>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Phone</p>
              <p className="font-body text-sm text-ivory">{lead.phone}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Email</p>
              <p className="font-body text-sm text-ivory break-words">{lead.email || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Position</p>
              <p className="font-body text-sm text-ivory">{parsed.position || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Experience</p>
              <p className="font-body text-sm text-ivory">{parsed.experience || "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sand mb-1">Resume Link</p>
              {parsed.resumeLink && parsed.resumeLink !== "—" ? (
                <a
                  href={parsed.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-brass hover:underline break-all inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {parsed.resumeLink}
                </a>
              ) : (
                <p className="font-body text-sm text-sand">—</p>
              )}
            </div>
          </div>

          {/* Cover note */}
          {parsed.coverNote && parsed.coverNote !== "—" && (
            <div>
              <p className={labelClass}>Cover Note</p>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
                <p className="font-body text-sm text-ivory whitespace-pre-wrap leading-relaxed">
                  {parsed.coverNote}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end border-t border-white/10 bg-charcoal/95 px-6 py-3.5 backdrop-blur-xl">
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

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Settings,
  Mail,
  Phone,
  Search,
  BarChart3,
  CreditCard,
  Globe,
  Save,
  Check,
  X,
  Upload,
  Building2,
  MapPin,
  MessageCircle,
} from "lucide-react";

const inputClass = "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary = "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors";

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "contact", label: "Contact Information", icon: Phone },
  { id: "email", label: "Email Integration", icon: Mail },
  { id: "seo", label: "SEO & Metadata", icon: Search },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payment", label: "Payment", icon: CreditCard },
];

export default function SiteSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/cms?key=site:settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.value) setSettings(data.value);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site:settings", value: settings }),
      });
      const data = await res.json();
      if (data.ok) showToast("ok", "Settings saved — changes go live instantly!");
      else showToast("err", "Failed to save settings");
    } catch {
      showToast("err", "Network error");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "site-logo");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        setSettings({ ...settings, logo: data.imageUrl });
        showToast("ok", "Logo uploaded — appears in navbar + footer + admin within seconds.");
      }
    } catch {
      showToast("err", "Upload failed");
    }
    setUploading(false);
  };

  const update = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-600/30 border-t-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Site Settings</h1>
          <p className="text-sm text-gray-400">
            All changes go live instantly on the website — no rebuild needed. Logo uploads appear in navbar + footer + admin within seconds.
          </p>
        </div>
        <button onClick={handleSave} className={btnPrimary}>
          <Save className="inline h-4 w-4 mr-1" /> Save Changes
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-yellow-600 text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        {/* GENERAL */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
            
            {/* Logo upload */}
            <div>
              <label className={labelClass}>Site Logo</label>
              <div className="flex items-start gap-4">
                <div className="h-20 w-32 shrink-0 rounded-lg border border-white/15 bg-gray-800 overflow-hidden flex items-center justify-center">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" className="h-full w-full object-contain" />
                  ) : (
                    <Building2 className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 border border-white/15 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : <><Upload className="h-4 w-4" /> Upload Logo</>}
                  </button>
                  <p className="text-[10px] text-gray-500 mt-2">Logo appears in navbar, footer, and admin panel. Recommended size: 300×72px.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Site Name</label>
                <input type="text" value={settings.siteName || "LaxRee Amenities"} onChange={(e) => update("siteName", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input type="text" value={settings.tagline || "Hotel Supplies Redefined"} onChange={(e) => update("tagline", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>GST Number</label>
                <input type="text" value={settings.gst || ""} onChange={(e) => update("gst", e.target.value)} className={inputClass} placeholder="08AAAAA0000A1Z5" />
              </div>
              <div>
                <label className={labelClass}>PAN Number</label>
                <input type="text" value={settings.pan || ""} onChange={(e) => update("pan", e.target.value)} className={inputClass} placeholder="AAAAA0000A" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Company Description</label>
              <textarea value={settings.companyDescription || ""} onChange={(e) => update("companyDescription", e.target.value)} rows={3} className={inputClass + " resize-none"} placeholder="Brief company description for SEO and footer..." />
            </div>

            <div>
              <label className={labelClass}>Copyright Text</label>
              <input type="text" value={settings.copyright || "© 2026 LaxRee Amenities. All rights reserved."} onChange={(e) => update("copyright", e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Contact Information</h2>
            
            <div>
              <label className={labelClass}>Address</label>
              <textarea value={settings.address || "Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001"} onChange={(e) => update("address", e.target.value)} rows={2} className={inputClass + " resize-none"} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone (Display)</label>
                <input type="text" value={settings.phoneDisplay || "+91-92516 83662"} onChange={(e) => update("phoneDisplay", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone (Tel Link)</label>
                <input type="text" value={settings.phoneHref || "+919251683662"} onChange={(e) => update("phoneHref", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Toll Free (Display)</label>
                <input type="text" value={settings.tollFreeDisplay || "1800 120 7001"} onChange={(e) => update("tollFreeDisplay", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input type="text" value={settings.whatsapp || "919251683662"} onChange={(e) => update("whatsapp", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>General Email</label>
                <input type="email" value={settings.email || "contactus@laxree.com"} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Careers Email</label>
                <input type="email" value={settings.careersEmail || "hr@laxree.com"} onChange={(e) => update("careersEmail", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Working Hours</label>
              <input type="text" value={settings.workingHours || "Mon-Sat: 9:30 AM - 6:30 PM"} onChange={(e) => update("workingHours", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Google Map Embed URL</label>
              <input type="text" value={settings.mapEmbed || ""} onChange={(e) => update("mapEmbed", e.target.value)} className={inputClass} placeholder="https://www.google.com/maps/embed?..." />
              <p className="text-[10px] text-gray-500 mt-1">Go to Google Maps → Share → Embed a map → Copy the src URL</p>
            </div>

            <div>
              <label className={labelClass}>Social Media Links</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input type="text" value={settings.facebook || ""} onChange={(e) => update("facebook", e.target.value)} className={inputClass} placeholder="Facebook URL" />
                <input type="text" value={settings.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} className={inputClass} placeholder="LinkedIn URL" />
                <input type="text" value={settings.youtube || ""} onChange={(e) => update("youtube", e.target.value)} className={inputClass} placeholder="YouTube URL" />
                <input type="text" value={settings.x || ""} onChange={(e) => update("x", e.target.value)} className={inputClass} placeholder="X (Twitter) URL" />
              </div>
            </div>
          </div>
        )}

        {/* EMAIL */}
        {activeTab === "email" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Email Integration (SMTP)</h2>
            <p className="text-sm text-gray-400">Configure SMTP to send automated emails (lead notifications, quotations, etc.)</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>SMTP Host</label>
                <input type="text" value={settings.smtpHost || ""} onChange={(e) => update("smtpHost", e.target.value)} className={inputClass} placeholder="smtp.gmail.com" />
              </div>
              <div>
                <label className={labelClass}>SMTP Port</label>
                <input type="text" value={settings.smtpPort || "587"} onChange={(e) => update("smtpPort", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>SMTP Username</label>
                <input type="text" value={settings.smtpUser || ""} onChange={(e) => update("smtpUser", e.target.value)} className={inputClass} placeholder="contactus@laxree.com" />
              </div>
              <div>
                <label className={labelClass}>SMTP Password</label>
                <input type="password" value={settings.smtpPass || ""} onChange={(e) => update("smtpPass", e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className={labelClass}>From Email</label>
              <input type="email" value={settings.fromEmail || ""} onChange={(e) => update("fromEmail", e.target.value)} className={inputClass} placeholder="noreply@laxree.com" />
            </div>

            <div>
              <label className={labelClass}>Lead Notification Email</label>
              <input type="email" value={settings.leadNotificationEmail || "contactus@laxree.com"} onChange={(e) => update("leadNotificationEmail", e.target.value)} className={inputClass} />
              <p className="text-[10px] text-gray-500 mt-1">New leads will be sent to this email automatically.</p>
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">SEO & Metadata</h2>
            
            <div>
              <label className={labelClass}>Default Meta Title</label>
              <input type="text" value={settings.metaTitle || "LaxRee Amenities — Hotel Supplies Redefined"} onChange={(e) => update("metaTitle", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Default Meta Description</label>
              <textarea value={settings.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} rows={2} className={inputClass + " resize-none"} />
            </div>

            <div>
              <label className={labelClass}>Default Keywords (comma separated)</label>
              <input type="text" value={settings.metaKeywords || ""} onChange={(e) => update("metaKeywords", e.target.value)} className={inputClass} placeholder="hotel supplies, hospitality procurement, ..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Google Search Console Verification</label>
                <input type="text" value={settings.googleVerification || ""} onChange={(e) => update("googleVerification", e.target.value)} className={inputClass} placeholder="google-site-verification=..." />
              </div>
              <div>
                <label className={labelClass}>Bing Webmaster Verification</label>
                <input type="text" value={settings.bingVerification || ""} onChange={(e) => update("bingVerification", e.target.value)} className={inputClass} placeholder="msvalidate.01=..." />
              </div>
            </div>

            <div>
              <label className={labelClass}>robots.txt Content</label>
              <textarea value={settings.robotsTxt || "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/"} onChange={(e) => update("robotsTxt", e.target.value)} rows={4} className={inputClass + " resize-none font-mono text-xs"} />
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Analytics & Tracking</h2>
            
            <div>
              <label className={labelClass}>Google Analytics 4 Measurement ID</label>
              <input type="text" value={settings.ga4Id || ""} onChange={(e) => update("ga4Id", e.target.value)} className={inputClass} placeholder="G-XXXXXXXXXX" />
            </div>

            <div>
              <label className={labelClass}>Google Tag Manager ID</label>
              <input type="text" value={settings.gtmId || ""} onChange={(e) => update("gtmId", e.target.value)} className={inputClass} placeholder="GTM-XXXXXXX" />
            </div>

            <div>
              <label className={labelClass}>Meta (Facebook) Pixel ID</label>
              <input type="text" value={settings.metaPixelId || ""} onChange={(e) => update("metaPixelId", e.target.value)} className={inputClass} placeholder="123456789012345" />
            </div>

            <div>
              <label className={labelClass}>Microsoft Clarity ID</label>
              <input type="text" value={settings.clarityId || ""} onChange={(e) => update("clarityId", e.target.value)} className={inputClass} placeholder="abc1234def" />
            </div>

            <div>
              <label className={labelClass}>Hotjar Site ID</label>
              <input type="text" value={settings.hotjarId || ""} onChange={(e) => update("hotjarId", e.target.value)} className={inputClass} placeholder="1234567" />
            </div>
          </div>
        )}

        {/* PAYMENT */}
        {activeTab === "payment" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Payment Settings</h2>
            <p className="text-sm text-gray-400">Configure payment gateways for online catalogue purchases (if enabled).</p>
            
            <div>
              <label className={labelClass}>Razorpay Key ID</label>
              <input type="text" value={settings.razorpayKey || ""} onChange={(e) => update("razorpayKey", e.target.value)} className={inputClass} placeholder="rzp_live_XXXXXXXXXX" />
            </div>

            <div>
              <label className={labelClass}>Razorpay Key Secret</label>
              <input type="password" value={settings.razorpaySecret || ""} onChange={(e) => update("razorpaySecret", e.target.value)} className={inputClass} placeholder="••••••••••••••••" />
            </div>

            <div>
              <label className={labelClass}>Stripe Publishable Key</label>
              <input type="text" value={settings.stripeKey || ""} onChange={(e) => update("stripeKey", e.target.value)} className={inputClass} placeholder="pk_live_XXXXXXXXXX" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={settings.enablePayments || false} onChange={(e) => update("enablePayments", e.target.checked)} className="h-4 w-4 accent-yellow-500" />
                <span className="text-sm text-white">Enable online payments</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg px-5 py-3 shadow-2xl border"
          style={{
            backgroundColor: toast.kind === "ok" ? "#1a4d3a" : "#5c1d1d",
            borderColor: toast.kind === "ok" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.kind === "ok" ? <Check className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-red-400" />}
          <span className="text-sm text-white font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

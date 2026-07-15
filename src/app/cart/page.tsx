"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  FileText,
  Download,
  Send,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useEnquiry } from "@/components/providers/enquiry-provider";
import { PageHero, FadeIn } from "@/components/site/page-primitives";
import { SITE } from "@/lib/laxree/site-data";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();
  const { notify } = useEnquiry();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quotationResult, setQuotationResult] = useState<{
    refNo: string;
    whatsappUrl: string;
    csv: string;
    date?: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    message: "",
    avgRoomRent: "",
    timeline: "",
    propertyType: "renovation",
    projectStage: "",
  });

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 text-ink placeholder:text-ink-muted/60 transition-colors duration-200 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass";
  const labelClass = "data-label mb-1.5 block text-[11px] text-ink-muted";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    try {
      // Step 1: Generate quotation via API
      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            model: i.model,
            name: i.name,
            category: i.category,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `Server error (${res.status})` }));
        throw new Error(errorData.message || `Request failed (${res.status})`);
      }
      const data = await res.json();

      // Store quotation result
      const result = {
        date: data.date,
        refNo: data.refNo,
        whatsappUrl: data.whatsappUrl,
        csv: data.csv,
      };
      setQuotationResult(result);
      setSubmitted(true);
      notify("success", `Quotation ${data.refNo} generated! Downloading files & opening WhatsApp...`);

      // Step 2: Auto-download Excel file
      try {
        const excelRes = await fetch("/api/generate-excel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            refNo: data.refNo,
            date: data.date || "",
            items: items.map((i) => ({
              model: i.model,
              name: i.name,
              category: i.category,
              quantity: i.quantity,
            })),
          }),
        });
        if (excelRes.ok) {
          const blob = await excelRes.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `LaxRee_Quotation_${data.refNo}.xlsx`;
          link.click();
          URL.revokeObjectURL(url);
        }
      } catch {
        // Excel download failed — not critical, continue
      }

      // Step 3: Auto-download PDF (via print)
      setTimeout(() => {
        const printWin = window.open("", "_blank");
        if (printWin) {
          const html = generateProfessionalQuotationHTML(form, items, data.refNo, data.date || "");
          printWin.document.write(html);
          printWin.document.close();
          setTimeout(() => printWin.print(), 800);
        }
      }, 500);

      // Step 4: Open WhatsApp to sales executive with pre-filled message
      // WhatsApp doesn't support file attachments via URL, so we:
      // - Open WhatsApp with the quotation details pre-filled
      // - The user manually attaches the downloaded Excel file
      setTimeout(() => {
        // Simple WhatsApp message with instruction to attach file
        const waMsg = `*New Quotation Request — LaxRee Amenities*
━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Ref:* ${data.refNo}
📅 *Date:* ${data.date}
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${form.name}
📞 Phone: ${form.phone}
📧 Email: ${form.email || "—"}
🏨 Hotel: ${form.hotel || "—"}
💰 Avg Room Rent: ${form.avgRoomRent || "—"}
⏱ Timeline: ${form.timeline || "—"}
🏗 Property: ${form.propertyType === "new" ? "New Property" : "Renovation"}
${form.propertyType === "new" && form.projectStage ? `📊 Stage: ${form.projectStage}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━
*Selected Products (${items.length} items):*
${items.map((item, i) => `${i + 1}. ${item.name} (${item.model}) — Qty: ${item.quantity}`).join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━
Here is my requirement, please share price of above items.

📎 *Note:* Excel & PDF quotation files have been downloaded. Please attach them in this chat.`;
        const waUrl = `https://wa.me/919251683660?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");
      }, 1500);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate quotation. Please try again.";
      notify("error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCSV = async () => {
    if (!quotationResult) return;
    try {
      const res = await fetch("/api/generate-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          refNo: quotationResult.refNo,
          date: quotationResult.date || "",
          items: items.map((i) => ({
            model: i.model,
            name: i.name,
            category: i.category,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LaxRee_Quotation_${quotationResult.refNo}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      notify("error", "Failed to generate Excel. Please try again.");
    }
  };

  const downloadPDF = () => {
    if (!quotationResult) return;
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    const html = generateProfessionalQuotationHTML(form, items, quotationResult.refNo, quotationResult.date || "");
    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => printWin.print(), 800);
  };

  // ─── Empty cart state ───
  if (items.length === 0 && !submitted) {
    return (
      <>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
          eyebrow="SHOPPING CART"
          title="Your Cart is Empty"
          subtitle="Browse our product catalogue and add items to your cart to request a quotation."
        />
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree text-center max-w-md mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brass/10">
              <ShoppingBag className="h-10 w-10 text-brass" strokeWidth={1.5} />
            </div>
            <p className="font-body text-ink-muted mb-8">
              You haven&apos;t added any products yet. Explore our catalogue to find
              the items you need.
            </p>
            <Link
              href="/products/amenities"
              className="pill pill-brass px-8 py-3.5 text-[13px] inline-flex items-center gap-2"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </>
    );
  }

  // ─── Quotation submitted state ───
  if (submitted && quotationResult) {
    return (
      <>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
          eyebrow="QUOTATION SUBMITTED"
          title={`Quotation ${quotationResult.refNo}`}
          subtitle="Your quotation request has been generated. Download the PDF/Excel or send directly to our sales team via WhatsApp."
        />
        <section className="section section-ivory py-20 md:py-28">
          <div className="container-laxree max-w-2xl mx-auto">
            <FadeIn>
              <div className="glass-on-ivory rounded-24px p-8 md:p-10">
                {/* Success icon */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="font-display text-[24px] font-medium text-ink">
                      Quotation Generated!
                    </h3>
                    <p className="font-mono text-[12px] text-ink-muted">
                      Ref: {quotationResult.refNo} • {totalItems} items
                    </p>
                  </div>
                </div>

                <p className="font-body text-[14px] leading-relaxed text-ink-muted mb-4">
                  Your quotation request has been generated with reference{" "}
                  <strong className="text-ink">{quotationResult.refNo}</strong>.
                  Excel & PDF files have been auto-downloaded, and WhatsApp has been opened
                  to our sales executive.
                </p>

                {/* Instruction box */}
                <div className="mb-8 rounded-2xl border border-brass/30 bg-brass/5 p-5">
                  <p className="font-body text-[13px] leading-relaxed text-ink">
                    <strong className="text-brass">📎 Next Step:</strong> In the WhatsApp chat that just opened,
                    attach the downloaded <strong>Excel file</strong> ({quotationResult.refNo}.xlsx)
                    and send the message. Our sales team will reply with pricing within 24 hours.
                  </p>
                </div>

                {/* Download buttons */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
                  <button
                    type="button"
                    onClick={downloadPDF}
                    className="flex items-center justify-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-5 py-3 text-[13px] font-medium text-brass transition-colors hover:bg-brass hover:text-charcoal"
                  >
                    <FileText className="h-4 w-4" />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={downloadCSV}
                    className="flex items-center justify-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-5 py-3 text-[13px] font-medium text-brass transition-colors hover:bg-brass hover:text-charcoal"
                  >
                    <Download className="h-4 w-4" />
                    Download Excel
                  </button>
                </div>

                {/* WhatsApp button — re-open if user closed it */}
                <button
                  type="button"
                  onClick={() => {
                    // Re-download Excel
                    downloadCSV();
                    // Re-open WhatsApp
                    setTimeout(() => {
                      window.open(quotationResult.whatsappUrl, "_blank");
                    }, 800);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Re-open WhatsApp & Download Excel
                </button>
                <p className="mt-3 text-center text-[11px] text-ink-muted">
                  Click to re-download Excel file and open WhatsApp → +91 92516 83660
                </p>

                {/* Clear and start over */}
                <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
                  <Link
                    href="/products/amenities"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-brass hover:gap-2.5 transition-all"
                  >
                    <ArrowLeft size={12} strokeWidth={1.5} />
                    Continue Shopping
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setSubmitted(false);
                      setQuotationResult(null);
                      setForm({ name: "", email: "", phone: "", hotel: "", message: "", avgRoomRent: "", timeline: "", propertyType: "renovation", projectStage: "" });
                    }}
                    className="font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-destructive transition-colors"
                  >
                    Clear & Start Over
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </>
    );
  }

  // ─── Cart with items + quotation form ───
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        eyebrow="SHOPPING CART"
        title="Submit for Quotation"
        subtitle={`${totalItems} item${totalItems > 1 ? "s" : ""} selected. Fill in your details and submit to get a custom quotation from our sales team.`}
      />

      <section className="section section-ivory py-20 md:py-28">
        <div className="container-laxree">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:items-start">
            {/* ─── Cart items ─── */}
            <div>
              <h3 className="font-display text-[20px] font-medium text-ink mb-5">
                Selected Items ({items.length})
              </h3>
              <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                  <FadeIn key={item.model} delay={i * 0.03}>
                    <div className="glass-on-ivory rounded-20px p-4 flex items-center gap-4">
                      {/* Product image */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-charcoal">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-brass">
                            {item.model}
                          </span>
                        </div>
                        <h4 className="font-display text-[15px] font-medium text-ink leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="font-mono text-[10px] text-ink-muted/60 uppercase tracking-wider">
                          {item.category}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.model, item.quantity - 1)}
                          className="grid place-items-center h-7 w-7 rounded-full border border-ink/15 text-ink hover:border-brass hover:text-brass transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="font-mono text-[14px] font-medium text-ink min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.model, item.quantity + 1)}
                          className="grid place-items-center h-7 w-7 rounded-full border border-ink/15 text-ink hover:border-brass hover:text-brass transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.model)}
                        className="grid place-items-center h-8 w-8 rounded-full text-ink-muted/40 hover:text-destructive hover:bg-destructive/5 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </FadeIn>
                ))}
              </div>

              {/* Clear cart */}
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-destructive transition-colors"
              >
                <Trash2 size={12} strokeWidth={1.5} />
                Clear All Items
              </button>
            </div>

            {/* ─── Quotation form ─── */}
            <div className="lg:sticky lg:top-24">
              <div className="glass-on-ivory rounded-24px p-6 md:p-8">
                <h3 className="font-display text-[22px] font-medium text-ink mb-2">
                  Your Details
                </h3>
                <p className="font-body text-[13px] text-ink-muted mb-6">
                  Fill in your contact info to submit the quotation request. Our sales
                  team will respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 ..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@hotel.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Hotel / Company Name</label>
                    <input
                      type="text"
                      value={form.hotel}
                      onChange={(e) => setForm((p) => ({ ...p, hotel: e.target.value }))}
                      placeholder="Hotel or company name"
                      className={inputClass}
                    />
                  </div>

                  {/* ─── Project Details Section ─── */}
                  <div className="mt-2 pt-4 border-t border-ink/10">
                    <p className="font-display text-[15px] font-medium text-ink mb-3">
                      Project Details
                    </p>
                  </div>

                  {/* Average room rent */}
                  <div>
                    <label className={labelClass}>Average Room Rent (per night)</label>
                    <input
                      type="text"
                      value={form.avgRoomRent}
                      onChange={(e) => setForm((p) => ({ ...p, avgRoomRent: e.target.value }))}
                      placeholder="e.g. ₹4,000 - ₹6,000"
                      className={inputClass}
                    />
                  </div>

                  {/* Timeline / delivery required */}
                  <div>
                    <label className={labelClass}>Delivery Timeline Required</label>
                    <input
                      type="text"
                      value={form.timeline}
                      onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}
                      placeholder="e.g. 3 months / 45 days / ASAP"
                      className={inputClass}
                    />
                  </div>

                  {/* Property type: renovation or new */}
                  <div>
                    <label className={labelClass}>Property Type</label>
                    <div className="flex gap-3 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="propertyType"
                          value="renovation"
                          checked={form.propertyType === "renovation"}
                          onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                          className="accent-brass"
                        />
                        <span className="text-[13px] text-ink">Renovation</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="propertyType"
                          value="new"
                          checked={form.propertyType === "new"}
                          onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                          className="accent-brass"
                        />
                        <span className="text-[13px] text-ink">New Property</span>
                      </label>
                    </div>
                  </div>

                  {/* If new property: current stage */}
                  {form.propertyType === "new" && (
                    <div>
                      <label className={labelClass}>Current Project Stage</label>
                      <select
                        value={form.projectStage}
                        onChange={(e) => setForm((p) => ({ ...p, projectStage: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select current stage</option>
                        <option value="Under Foundation">Under Foundation</option>
                        <option value="Structure / Civil Work">Structure / Civil Work</option>
                        <option value="Furniture Stage">Furniture Stage</option>
                        <option value="Interior Finishing">Interior Finishing</option>
                        <option value="Final Stage (Handover)">Final Stage (Handover)</option>
                      </select>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Message (optional)</label>
                    <textarea
                      rows={2}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Any specific requirements or timeline..."
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="pill pill-brass mt-2 flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      "Generating Quotation…"
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit for Quotation
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-ink-muted">
                    A professional PDF & Excel quotation will be generated and sent to
                    our sales executive.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Helper: Generate PROFESSIONAL printable HTML quotation (PDF)
   ───────────────────────────────────────────────────────────── */
function generateProfessionalQuotationHTML(
  form: { name: string; email: string; phone: string; hotel: string; message: string; avgRoomRent: string; timeline: string; propertyType: string; projectStage: string },
  items: { model: string; name: string; category: string; quantity: number; image: string }[],
  refNo: string,
  date: string
): string {
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);
  const itemsHTML = items
    .map(
      (item, i) => `
      <tr>
        <td style="text-align:center;padding:14px 10px;border-bottom:1px solid #ede7d8;font-size:12px;color:#6b6455;">${i + 1}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #ede7d8;font-family:'Courier New',monospace;font-size:11px;color:#C6A15B;font-weight:600;letter-spacing:0.5px;">${item.model}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #ede7d8;font-size:13px;color:#1a1712;font-weight:500;">${item.name}</td>
        <td style="padding:14px 10px;border-bottom:1px solid #ede7d8;font-size:12px;color:#6b6455;">${item.category}</td>
        <td style="text-align:center;padding:14px 10px;border-bottom:1px solid #ede7d8;font-size:14px;color:#1a1712;font-weight:700;">${item.quantity}</td>
        <td style="text-align:center;padding:14px 10px;border-bottom:1px solid #ede7d8;color:#b7ac97;font-size:12px;">To be quoted</td>
        <td style="text-align:right;padding:14px 10px;border-bottom:1px solid #ede7d8;color:#b7ac97;font-size:12px;">To be quoted</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LaxRee Amenities — Quotation ${refNo}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Work Sans', 'Helvetica Neue', Arial, sans-serif; color: #1a1712; background: #f7f3ea; padding: 0; }
  .page { max-width: 800px; margin: 0 auto; background: #fff; box-shadow: 0 0 40px rgba(18,16,13,0.08); }

  /* ── Header ── */
  .header { background: #12100d; padding: 36px 48px; display: flex; justify-content: space-between; align-items: center; }
  .header-logo { display: flex; align-items: center; gap: 12px; }
  .header-logo .diamond { width: 10px; height: 10px; background: #C6A15B; transform: rotate(45deg); }
  .header-logo .brand { font-family: 'Fraunces', Georgia, serif; font-size: 30px; font-weight: 700; color: #C6A15B; letter-spacing: -0.5px; }
  .header-logo .tagline { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: #b7ac97; text-transform: uppercase; letter-spacing: 3px; margin-top: 2px; }
  .header-ref { text-align: right; }
  .header-ref .label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #b7ac97; text-transform: uppercase; letter-spacing: 2px; }
  .header-ref .ref-no { font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: #C6A15B; font-weight: 600; margin-top: 4px; }
  .header-ref .date { font-size: 11px; color: #b7ac97; margin-top: 2px; }

  /* ── Title bar ── */
  .title-bar { background: linear-gradient(90deg, #C6A15B, #E4C989); padding: 16px 48px; }
  .title-bar h1 { font-family: 'Fraunces', Georgia, serif; font-size: 20px; font-weight: 600; color: #12100d; }

  /* ── Body ── */
  .body { padding: 36px 48px; }

  /* ── Customer section ── */
  .section-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; color: #C6A15B; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #ede7d8; }
  .customer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
  .customer-field { display: flex; flex-direction: column; gap: 4px; }
  .customer-field .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #b7ac97; }
  .customer-field .field-value { font-size: 14px; color: #1a1712; font-weight: 500; }

  /* ── Products table ── */
  .table-wrap { margin-bottom: 24px; border-radius: 10px; overflow: hidden; border: 1px solid #ede7d8; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #12100d; }
  th { padding: 14px 10px; font-family: 'IBM Plex Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #C6A15B; text-align: left; }
  th.center { text-align: center; }
  th.right { text-align: right; }
  tbody tr:nth-child(even) { background: #faf8f2; }
  tbody tr:hover { background: #f5f0e4; }

  /* ── Summary ── */
  .summary { display: flex; justify-content: flex-end; margin-bottom: 32px; }
  .summary-box { min-width: 260px; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
  .summary-row.total { border-top: 2px solid #C6A15B; margin-top: 8px; padding-top: 12px; font-weight: 700; font-size: 15px; color: #12100d; }
  .summary-row .label { color: #6b6455; }
  .summary-row .value { color: #1a1712; font-weight: 600; }

  /* ── Note ── */
  .note { background: #fffaf0; border-left: 4px solid #C6A15B; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px; }
  .note p { font-size: 12px; color: #6b6455; line-height: 1.6; }
  .note strong { color: #1a1712; }

  /* ── Footer ── */
  .footer { background: #12100d; padding: 28px 48px; text-align: center; }
  .footer-brand { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 600; color: #C6A15B; margin-bottom: 6px; }
  .footer-addr { font-size: 11px; color: #b7ac97; line-height: 1.7; }
  .footer-certs { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #6b6455; margin-top: 10px; letter-spacing: 1px; text-transform: uppercase; }

  @media print {
    body { background: #fff; }
    .page { box-shadow: none; max-width: 100%; }
    @page { margin: 0; size: A4; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-logo">
      <img src="https://laxree.com/wp-content/uploads/2025/05/laxree-new-logo-file-1-scaled.png" alt="LaxRee Amenities" style="height: 44px; width: auto;" />
    </div>
    <div class="header-ref">
      <div class="label">Quotation Request</div>
      <div class="ref-no">${refNo}</div>
      <div class="date">${date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
    </div>
  </div>

  <!-- Title bar -->
  <div class="title-bar">
    <h1>Product Quotation Request</h1>
  </div>

  <!-- Body -->
  <div class="body">
    <!-- Customer details -->
    <div class="section-label">Customer Details</div>
    <div class="customer-grid">
      <div class="customer-field">
        <div class="field-label">Name</div>
        <div class="field-value">${form.name}</div>
      </div>
      <div class="customer-field">
        <div class="field-label">Phone</div>
        <div class="field-value">${form.phone}</div>
      </div>
      <div class="customer-field">
        <div class="field-label">Email</div>
        <div class="field-value">${form.email || "—"}</div>
      </div>
      <div class="customer-field">
        <div class="field-label">Hotel / Company</div>
        <div class="field-value">${form.hotel || "—"}</div>
      </div>
    </div>

    <!-- Project details -->
    <div class="section-label">Project Details</div>
    <div class="customer-grid">
      <div class="customer-field">
        <div class="field-label">Average Room Rent / Night</div>
        <div class="field-value">${form.avgRoomRent || "—"}</div>
      </div>
      <div class="customer-field">
        <div class="field-label">Delivery Timeline Required</div>
        <div class="field-value">${form.timeline || "—"}</div>
      </div>
      <div class="customer-field">
        <div class="field-label">Property Type</div>
        <div class="field-value">${form.propertyType === "new" ? "New Property" : "Renovation"}</div>
      </div>
      ${form.propertyType === "new" ? `<div class="customer-field"><div class="field-label">Current Project Stage</div><div class="field-value">${form.projectStage || "—"}</div></div>` : ""}
      ${form.message ? `<div class="customer-field" style="grid-column:1/3;"><div class="field-label">Message</div><div class="field-value">${form.message}</div></div>` : ""}
    </div>

    <!-- Products table -->
    <div class="section-label">Selected Products (${items.length} Items, ${totalUnits} Units)</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:40px;" class="center">#</th>
            <th style="width:100px;">Model</th>
            <th>Product Name</th>
            <th style="width:110px;">Category</th>
            <th style="width:60px;" class="center">Qty</th>
            <th style="width:100px;" class="center">Rate (INR)</th>
            <th style="width:110px;" class="right">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="summary-box">
        <div class="summary-row"><span class="label">Total Items</span><span class="value">${items.length}</span></div>
        <div class="summary-row"><span class="label">Total Units</span><span class="value">${totalUnits}</span></div>
        <div class="summary-row"><span class="label">Estimated Total</span><span class="value">To be quoted</span></div>
        <div class="summary-row total"><span>Grand Total</span><span>To be quoted</span></div>
      </div>
    </div>

    <!-- Note -->
    <div class="note">
      <p><strong>Note:</strong> This is a quotation request, not a confirmed order. Rates, taxes, and delivery charges will be provided by the LaxRee sales team upon confirmation. Prices may vary based on order quantity, customization, and delivery location.</p>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <img src="https://laxree.com/wp-content/uploads/2025/05/laxree-new-logo-file-1-scaled.png" alt="LaxRee Amenities" style="height: 32px; width: auto; margin: 0 auto 10px; display: block;" />
    <div class="footer-addr">
      Plot No. 1 &amp; 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001<br>
      Phone: +91-92516 83662 &nbsp;|&nbsp; Toll Free: 1800 120 7001 &nbsp;|&nbsp; Email: contactus@laxree.com
    </div>
    <div class="footer-certs">ISO 9001 • ISO 14001 • ISO 45001 • CE Certified • RoHS Compliant</div>
  </div>
</div>
</body>
</html>`;
}

/* Excel generation moved to server-side API: /api/generate-excel */


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
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    message: "",
  });

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 text-ink placeholder:text-ink-muted/60 transition-colors duration-200 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass";
  const labelClass = "data-label mb-1.5 block text-[11px] text-ink-muted";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    try {
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
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setQuotationResult({
        refNo: data.refNo,
        whatsappUrl: data.whatsappUrl,
        csv: data.csv,
      });
      setSubmitted(true);
      notify("success", `Quotation ${data.refNo} generated! Sending to sales team...`);
    } catch {
      notify("error", "Failed to generate quotation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCSV = () => {
    if (!quotationResult) return;
    const blob = new Blob([quotationResult.csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LaxRee_Quotation_${quotationResult.refNo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!quotationResult) return;
    // Generate a simple printable HTML and open in new window for PDF print
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    const html = generateQuotationHTML(form, items, quotationResult.refNo, quotationResult.date || "");
    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => printWin.print(), 500);
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

                <p className="font-body text-[14px] leading-relaxed text-ink-muted mb-8">
                  Your quotation request has been generated with reference{" "}
                  <strong className="text-ink">{quotationResult.refNo}</strong>. Download
                  the PDF or Excel file for your records, and click below to send it
                  directly to our sales executive.
                </p>

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

                {/* WhatsApp send button */}
                <a
                  href={quotationResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-[14px] font-medium text-white transition-transform hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" />
                  Send to Sales Executive via WhatsApp
                </a>
                <p className="mt-3 text-center text-[11px] text-ink-muted">
                  Opens WhatsApp with your quotation pre-filled → +91 92516 83660
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
                      setForm({ name: "", email: "", phone: "", hotel: "", message: "" });
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
   Helper: Generate printable HTML quotation (for PDF via print)
   ───────────────────────────────────────────────────────────── */
function generateQuotationHTML(
  form: { name: string; email: string; phone: string; hotel: string; message: string },
  items: { model: string; name: string; category: string; quantity: number; image: string }[],
  refNo: string,
  date: string
): string {
  const itemsHTML = items
    .map(
      (item, i) => `
      <tr>
        <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e0d4;">${i + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e0d4;font-family:monospace;font-size:11px;color:#C6A15B;">${item.model}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e0d4;font-size:13px;">${item.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e0d4;font-size:12px;color:#6b6455;">${item.category}</td>
        <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e0d4;font-size:14px;font-weight:600;">${item.quantity}</td>
        <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e0d4;color:#6b6455;">—</td>
        <td style="text-align:right;padding:10px 8px;border-bottom:1px solid #e5e0d4;color:#6b6455;">—</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>LaxRee Quotation ${refNo}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1712; padding: 40px; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #C6A15B; }
  .logo { font-size: 28px; font-weight: 700; color: #C6A15B; letter-spacing: -0.5px; }
  .logo span { font-size: 10px; color: #b7ac97; display: block; font-weight: 400; letter-spacing: 2px; margin-top: 2px; }
  .ref { text-align: right; font-size: 12px; color: #6b6455; }
  .ref strong { color: #1a1712; font-size: 14px; display: block; margin-bottom: 4px; }
  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C6A15B; margin: 24px 0 12px; }
  .customer { background: #f7f3ea; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
  .customer div { display: flex; margin-bottom: 6px; font-size: 13px; }
  .customer div:last-child { margin-bottom: 0; }
  .customer label { width: 100px; color: #6b6455; font-weight: 600; }
  .customer span { color: #1a1712; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #12100d; color: #f7f3ea; padding: 12px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  th:first-child { border-radius: 6px 0 0 0; }
  th:last-child { border-radius: 0 6px 0 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e0d4; font-size: 11px; color: #6b6455; text-align: center; }
  .footer strong { color: #C6A15B; }
  .note { background: #fff8e7; border: 1px solid #C6A15B; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #1a1712; margin-bottom: 16px; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">LaxRee<span>AMENITIES • HOTEL SUPPLIES REDEFINED</span></div>
    <div class="ref">
      <strong>Quotation Request</strong>
      Ref: ${refNo}<br>
      Date: ${date || new Date().toLocaleDateString("en-IN")}
    </div>
  </div>

  <div class="section-title">Customer Details</div>
  <div class="customer">
    <div><label>Name:</label><span>${form.name}</span></div>
    <div><label>Phone:</label><span>${form.phone}</span></div>
    <div><label>Email:</label><span>${form.email || "—"}</span></div>
    <div><label>Hotel:</label><span>${form.hotel || "—"}</span></div>
    ${form.message ? `<div><label>Message:</label><span>${form.message}</span></div>` : ""}
  </div>

  <div class="section-title">Selected Products (${items.length} items, ${items.reduce((s, i) => s + i.quantity, 0)} units)</div>
  <table>
    <thead>
      <tr>
        <th style="width:40px;">S.No</th>
        <th style="width:90px;">Model</th>
        <th>Product Name</th>
        <th style="width:100px;">Category</th>
        <th style="width:60px;">Qty</th>
        <th style="width:90px;">Rate (INR)</th>
        <th style="width:100px;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>${itemsHTML}</tbody>
  </table>

  <div class="note">
    <strong>Note:</strong> Rates will be provided by LaxRee sales team upon confirmation.
    This is a quotation request, not a confirmed order.
  </div>

  <div class="footer">
    <strong>LaxRee Amenities</strong> — Plot No. 1 & 2, Harbilas Sharda Marg, Civil Lines, Ajmer, Rajasthan 305001<br>
    Phone: +91-92516 83662 | Toll Free: 1800 120 7001 | Email: contactus@laxree.com<br>
    ISO 9001 • ISO 14001 • ISO 45001 • CE • RoHS Certified
  </div>
</body>
</html>`;
}

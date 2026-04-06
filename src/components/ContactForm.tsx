"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface PaintingOption {
  id: number;
  title: string;
}

export default function ContactForm({ paintings }: { paintings: PaintingOption[] }) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    paintingId: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const paintingParam = searchParams.get("painting");
    if (paintingParam) setForm((p) => ({ ...p, paintingId: paintingParam }));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", paintingId: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-t border-border pt-12 text-center">
        <svg className="w-8 h-8 text-accent mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="font-heading font-light text-2xl mb-3">Thank You</h2>
        <p className="font-body font-light text-[0.9rem] text-secondary leading-relaxed max-w-sm mx-auto">
          Your enquiry has been received. We will be in touch shortly.
        </p>
      </div>
    );
  }

  // Bottom-border-only field style
  const fieldClass =
    "w-full bg-transparent border-0 border-b border-border pb-2.5 pt-1 font-body font-light text-[0.9rem] text-ink placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-200";

  const labelClass =
    "block font-body text-[10px] tracking-widest2 uppercase text-secondary mb-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <label className={labelClass}>Phone <span className="text-secondary/40">(optional)</span></label>
          <input
            type="tel"
            placeholder="+1 000 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Painting of Interest</label>
          <select
            value={form.paintingId}
            onChange={(e) => setForm({ ...form, paintingId: e.target.value })}
            className={fieldClass + " cursor-pointer"}
          >
            <option value="">General enquiry</option>
            {paintings.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          required
          rows={5}
          placeholder="Please tell us about your interest in this work…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={fieldClass + " resize-none"}
        />
      </div>

      {status === "error" && (
        <p className="font-body text-[11px] text-red-500">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-4 bg-ink text-cream font-body text-[11px] tracking-widest2 uppercase hover:bg-ink/80 transition-colors duration-200 disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>
        <p className="text-center font-body text-[10px] text-secondary/50 mt-3">
          All enquiries handled with discretion
        </p>
      </div>
    </form>
  );
}

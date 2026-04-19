"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import GalleryImagesEditor from "./GalleryImagesEditor";

interface Painting {
  id: number;
  slug: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  category: string;
  price: string;
  sold: boolean;
  featured: boolean;
  imageUrl: string;
  sortOrder: number;
}

const emptyForm = {
  title: "",
  artist: "",
  year: "",
  medium: "",
  dimensions: "",
  description: "",
  category: "orientalist",
  price: "",
  sold: false,
  featured: false,
  sortOrder: 0,
};

const inputCls =
  "w-full px-3 py-2 border border-ink/20 bg-transparent focus:border-accent focus:outline-none text-sm";

export default function PaintingsManager() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [editing,   setEditing]   = useState<Painting | null>(null);
  const [form,      setForm]      = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/paintings");
    if (res.ok) setPaintings(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowForm(true);
  }

  function openEdit(p: Painting) {
    setEditing(p);
    setForm({
      title:       p.title,
      artist:      p.artist,
      year:        p.year,
      medium:      p.medium,
      dimensions:  p.dimensions,
      description: p.description,
      category:    p.category,
      price:       p.price,
      sold:        p.sold,
      featured:    p.featured,
      sortOrder:   p.sortOrder,
    });
    setImageFile(null);
    setShowForm(true);
    // Scroll form into view
    setTimeout(() => document.getElementById("painting-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function cancel() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append("image", imageFile);

    const url    = editing ? `/api/admin/paintings/${editing.id}` : "/api/admin/paintings";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, body: fd });

    setSaving(false);
    // Keep form open when editing so user can continue managing gallery images
    if (!editing) setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this painting permanently?")) return;
    await fetch(`/api/admin/paintings/${id}`, { method: "DELETE" });
    if (editing?.id === id) cancel();
    load();
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">Paintings</h2>
        <button
          onClick={openNew}
          className="px-5 py-2 bg-accent text-cream text-sm tracking-wide hover:bg-accent/80 transition-colors"
        >
          + Add Painting
        </button>
      </div>

      {/* ── Form panel ── */}
      {showForm && (
        <div id="painting-form" className="mb-10 border border-ink/10">

          {/* Form title bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10 bg-ink/[0.02]">
            <h3 className="font-heading text-lg">
              {editing ? `Editing: ${editing.title}` : "New Painting"}
            </h3>
            <button type="button" onClick={cancel} className="text-ink/30 hover:text-ink transition-colors text-xl leading-none">✕</button>
          </div>

          <div className="p-6">
            {/* ── Core details form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Title</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Artist</label>
                  <input required value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Year</label>
                  <input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Medium</label>
                  <input required value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Dimensions</label>
                  <input required value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    <option value="orientalist">Orientalist</option>
                    <option value="portrait">Portrait</option>
                    <option value="works-on-paper">Works on Paper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Price</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="e.g. £12,000" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-ink/40 mb-1">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-ink/40 mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " resize-none"} />
              </div>

              {/* Primary image */}
              <div>
                <label className="block text-xs uppercase text-ink/40 mb-1">
                  {editing ? "Primary Image — replace (optional)" : "Primary Image"}
                </label>
                {editing && (
                  <div className="relative w-16 aspect-[3/4] bg-ink/5 mb-2">
                    <Image src={editing.imageUrl} alt={editing.title} fill className="object-contain" sizes="64px" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!editing}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.sold} onChange={(e) => setForm({ ...form, sold: e.target.checked })} />
                  Sold
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-ink text-cream text-sm hover:bg-ink/80 transition-colors disabled:opacity-50">
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Painting"}
                </button>
                <button type="button" onClick={cancel} className="px-6 py-2 border border-ink/20 text-sm hover:border-ink/40 transition-colors">
                  Cancel
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editing.id)}
                    className="ml-auto px-6 py-2 text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Delete Painting
                  </button>
                )}
              </div>
            </form>

            {/* ── Gallery images — only for existing paintings ── */}
            {editing && <GalleryImagesEditor paintingId={editing.id} />}
          </div>
        </div>
      )}

      {/* ── Paintings list ── */}
      <div className="space-y-2">
        {paintings.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-4 p-4 border transition-colors ${
              editing?.id === p.id ? "border-accent/40 bg-accent/[0.03]" : "border-ink/10 hover:border-ink/20"
            }`}
          >
            {/* Thumbnail */}
            <div className="w-12 h-16 relative shrink-0 bg-ink/5">
              <Image src={p.imageUrl} alt={p.title} fill className="object-contain" sizes="48px" />
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-base truncate">{p.title}</h3>
              <p className="text-xs text-ink/50 mt-0.5">{p.artist} · {p.year}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {p.featured && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5">Featured</span>}
                {p.sold     && <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5">Sold</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => editing?.id === p.id ? cancel() : openEdit(p)}
                className={`text-sm transition-colors ${
                  editing?.id === p.id ? "text-ink/40 hover:text-ink" : "text-accent hover:text-accent/70"
                }`}
              >
                {editing?.id === p.id ? "Close" : "Edit"}
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-sm text-red-400 hover:text-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

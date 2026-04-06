"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

export default function PaintingsManager() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [editing, setEditing] = useState<Painting | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
      title: p.title,
      artist: p.artist,
      year: p.year,
      medium: p.medium,
      dimensions: p.dimensions,
      description: p.description,
      category: p.category,
      price: p.price,
      sold: p.sold,
      featured: p.featured,
      sortOrder: p.sortOrder,
    });
    setImageFile(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
    if (imageFile) formData.append("image", imageFile);

    const url = editing
      ? `/api/admin/paintings/${editing.id}`
      : "/api/admin/paintings";
    const method = editing ? "PUT" : "POST";

    await fetch(url, { method, body: formData });
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this painting?")) return;
    await fetch(`/api/admin/paintings/${id}`, { method: "DELETE" });
    load();
  }

  const inputClass =
    "w-full px-3 py-2 border border-ink/20 bg-transparent focus:border-accent focus:outline-none text-sm";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">Paintings</h2>
        <button
          onClick={openNew}
          className="px-5 py-2 bg-accent text-cream text-sm tracking-wide hover:bg-accent-light transition-colors"
        >
          + Add Painting
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 border border-ink/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Artist</label>
              <input required value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Year</label>
              <input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Medium</label>
              <input required value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Dimensions</label>
              <input required value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="orientalist">Orientalist</option>
                <option value="portrait">Portrait</option>
                <option value="works-on-paper">Works on Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Price</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs uppercase text-ink/40 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-ink/40 mb-1">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " resize-none"} />
          </div>

          <div>
            <label className="block text-xs uppercase text-ink/40 mb-1">
              {editing ? "Replace Image (optional)" : "Image"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editing}
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sold} onChange={(e) => setForm({ ...form, sold: e.target.checked })} />
              Sold
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-ink text-cream text-sm hover:bg-ink/80 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-ink/20 text-sm hover:border-ink/40 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {paintings.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 border border-ink/10">
            <div className="w-16 h-20 relative shrink-0 bg-ink/5">
              <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg truncate">{p.title}</h3>
              <p className="text-sm text-ink/50">{p.artist} &middot; {p.year}</p>
              <div className="flex gap-2 mt-1">
                {p.featured && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5">Featured</span>}
                {p.sold && <span className="text-xs bg-ink/10 text-ink/50 px-2 py-0.5">Sold</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="text-sm text-accent hover:text-accent-light">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

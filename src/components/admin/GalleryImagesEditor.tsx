"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface ExtraImage {
  id: number;
  url: string;
  caption: string | null;
  sortOrder: number;
}

const inputCls =
  "w-full px-2 py-1.5 border border-ink/20 bg-transparent focus:border-accent focus:outline-none text-xs";

export default function GalleryImagesEditor({ paintingId }: { paintingId: number }) {
  const [images,    setImages]    = useState<ExtraImage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [adding,    setAdding]    = useState(false);
  const [newFile,   setNewFile]   = useState<File | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/paintings/${paintingId}/images`);
    if (res.ok) setImages(await res.json());
    setLoading(false);
  }, [paintingId]);

  useEffect(() => { load(); }, [load]);

  // Generate a local preview URL when a file is picked
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setNewFile(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function cancelAdd() {
    setAdding(false);
    setNewFile(null);
    setNewCaption("");
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleAdd() {
    if (!newFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", newFile);
    if (newCaption) fd.append("caption", newCaption);
    fd.append("sortOrder", String(images.length));
    await fetch(`/api/admin/paintings/${paintingId}/images`, { method: "POST", body: fd });
    cancelAdd();
    setUploading(false);
    load();
  }

  async function handleDelete(imageId: number) {
    if (!confirm("Remove this image from the gallery?")) return;
    await fetch(`/api/admin/paintings/${paintingId}/images/${imageId}`, { method: "DELETE" });
    setImages(imgs => imgs.filter(img => img.id !== imageId));
  }

  async function handleCaptionBlur(imageId: number, caption: string) {
    await fetch(`/api/admin/paintings/${paintingId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    });
  }

  async function handleOrderBlur(imageId: number, sortOrder: number) {
    await fetch(`/api/admin/paintings/${paintingId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder }),
    });
    // Re-sort locally
    setImages(imgs =>
      [...imgs.map(img => img.id === imageId ? { ...img, sortOrder } : img)]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
  }

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mt-8 pt-7 border-t border-ink/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-heading text-xl">Gallery Images</h3>
          <p className="text-xs text-ink/40 mt-1 leading-relaxed">
            Extra images that appear in the detail-page carousel alongside the primary image.<br />
            Edits to caption / order save automatically on blur.
          </p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="shrink-0 ml-4 px-4 py-1.5 bg-accent text-cream text-xs tracking-wide hover:bg-accent/80 transition-colors"
          >
            + Add Image
          </button>
        )}
      </div>

      {/* Image grid */}
      {loading ? (
        <p className="text-xs text-ink/40 py-2">Loading…</p>
      ) : sorted.length === 0 && !adding ? (
        <div className="border border-dashed border-ink/20 py-8 text-center">
          <p className="text-xs text-ink/30">No extra images yet.</p>
          <p className="text-xs text-ink/25 mt-1">The primary image is always shown first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {sorted.map((img, idx) => (
            <div key={img.id} className="group border border-ink/10 bg-ink/[0.02] p-2 space-y-2">
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] bg-ink/5">
                <Image
                  src={img.url}
                  alt={img.caption ?? `Image ${idx + 1}`}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  title="Remove image"
                  className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-red-500 text-white text-[11px] leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-ink/30 mb-0.5">Caption</label>
                <input
                  type="text"
                  placeholder="Optional"
                  defaultValue={img.caption ?? ""}
                  onBlur={(e) => handleCaptionBlur(img.id, e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Sort order */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-ink/30 mb-0.5">Order</label>
                <input
                  type="number"
                  defaultValue={img.sortOrder}
                  onBlur={(e) => handleOrderBlur(img.id, parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add-image panel */}
      {adding && (
        <div className="border border-dashed border-accent/50 bg-accent/[0.03] p-5 space-y-4">
          <p className="text-[10px] uppercase tracking-widest text-ink/40">New extra image</p>

          <div className="flex gap-4 items-start">
            {/* Preview */}
            <div className="shrink-0 relative w-24 aspect-[3/4] bg-ink/5 border border-ink/10">
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-contain" sizes="96px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink/20 text-xs">
                  Preview
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-ink/40 mb-1">Image file</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-ink/40 mb-1">Caption (optional)</label>
                <input
                  type="text"
                  placeholder='e.g. "Verso" or "Detail"'
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newFile || uploading}
              className="px-6 py-2 bg-ink text-cream text-xs tracking-wide hover:bg-ink/80 transition-colors disabled:opacity-40"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={cancelAdd}
              className="px-6 py-2 border border-ink/20 text-xs hover:border-ink/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

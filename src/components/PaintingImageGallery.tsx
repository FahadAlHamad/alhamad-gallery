"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  caption?: string | null;
}

// ─── Single image fallback (no gallery needed) ────────────────────
function SingleImage({ image, title }: { image: GalleryImage; title: string }) {
  return (
    <div className="relative w-full bg-ink/5 anim-detail-reveal">
      <Image src={image.url} alt={title} width={1200} height={1600}
        priority sizes="(max-width:768px) 100vw, 50vw"
        className="block w-full h-auto md:aspect-[3/4] md:object-cover" />
    </div>
  );
}

// ─── Main gallery component ────────────────────────────────────────
export default function PaintingImageGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [current, setCurrent]   = useState(0);
  const [fading,  setFading]    = useState(false);

  // Mobile swipe state
  const touchStartX  = useRef(0);
  const touchStartY  = useRef(0);
  const touchDeltaX  = useRef(0);
  const swipeDir     = useRef<"h" | "v" | null>(null);
  const [liveOffset, setLiveOffset] = useState(0); // px offset while dragging
  const [snapping,  setSnapping]   = useState(false);

  const total = images.length;

  // Navigate with crossfade on desktop
  const goTo = useCallback((idx: number) => {
    if (idx === current || fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 220);
  }, [current, fading]);

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1)         % total);

  // ── Mobile touch handlers ──────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    swipeDir.current    = null;
    setSnapping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (!swipeDir.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      swipeDir.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (swipeDir.current === "h") {
      e.preventDefault();
      touchDeltaX.current = dx;
      // Rubber-band at edges
      const atEdge = (current === 0 && dx > 0) || (current === total - 1 && dx < 0);
      setLiveOffset(atEdge ? dx * 0.18 : dx);
    }
  };

  const onTouchEnd = () => {
    if (swipeDir.current !== "h") { setLiveOffset(0); return; }
    const threshold = 50;
    setSnapping(true);
    if (touchDeltaX.current < -threshold && current < total - 1) {
      setCurrent(c => c + 1);
    } else if (touchDeltaX.current > threshold && current > 0) {
      setCurrent(c => c - 1);
    }
    setLiveOffset(0);
    setTimeout(() => setSnapping(false), 400);
  };

  if (total === 0) return null;
  if (total === 1) return <SingleImage image={images[0]} title={title} />;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE — swipe carousel
          ══════════════════════════════════════════════════════ */}
      <div className="md:hidden relative w-full select-none">

        {/* Clipping window */}
        <div
          className="overflow-hidden w-full bg-ink/5"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Slide track */}
          <div
            className="flex"
            style={{
              transform: `translateX(calc(${-current * 100}% + ${liveOffset}px))`,
              transition: snapping
                ? "transform 400ms cubic-bezier(0.16,1,0.3,1)"
                : "none",
            }}
          >
            {images.map((img, i) => (
              <div key={i} className="shrink-0 w-full relative">
                <Image
                  src={img.url}
                  alt={img.caption ?? title}
                  width={1200}
                  height={1600}
                  priority={i === 0}
                  sizes="100vw"
                  className="block w-full h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Caption + indicators row */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          {/* Caption */}
          <span className="font-body text-[9px] tracking-widest2 uppercase text-secondary min-h-[14px]">
            {images[current].caption ?? ""}
          </span>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setLiveOffset(0); setSnapping(true); setCurrent(i); setTimeout(() => setSnapping(false), 400); }}
                aria-label={`Image ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width:  i === current ? 18 : 5,
                  height: 5,
                  background: i === current ? "var(--tw-color-accent, #9a7c5f)" : "rgba(201,196,188,0.7)",
                  transition: "width 350ms cubic-bezier(0.16,1,0.3,1), background 300ms",
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="font-body text-[9px] tracking-widest2 text-secondary/60">
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — main image + thumbnail strip
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col gap-4">

        {/* Main image with crossfade */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink/5 group">
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[350ms] ease-out"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            >
              <Image
                src={img.url}
                alt={img.caption ?? title}
                fill
                sizes="50vw"
                priority={i === 0}
                className="object-cover"
                style={{ animation: i === current ? "detailReveal 600ms cubic-bezier(0.16,1,0.3,1) both" : "none" }}
              />
            </div>
          ))}

          {/* Prev / Next arrow buttons */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream/80 backdrop-blur-sm border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-cream"
                aria-label="Previous image"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-ink">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-cream/80 backdrop-blur-sm border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-cream"
                aria-label="Next image"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-ink">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter badge */}
          <div className="absolute bottom-3 right-3 font-body text-[9px] tracking-widest2 uppercase bg-ink/60 text-cream/80 backdrop-blur-sm px-2.5 py-1">
            {current + 1} / {total}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width: 64,
                aspectRatio: "3/4",
                outline: i === current
                  ? "1.5px solid #9a7c5f"
                  : "1.5px solid transparent",
                opacity: i === current ? 1 : 0.5,
              }}
              aria-label={img.caption ?? `View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? title}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Caption overlay on thumbnail */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-ink/70 px-1 py-0.5">
                  <span className="font-body text-[7px] tracking-wider uppercase text-cream/80 block truncate">
                    {img.caption}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Caption below main image */}
        {images[current].caption && (
          <p className="font-body text-[10px] tracking-widest2 uppercase text-secondary -mt-1">
            {images[current].caption}
          </p>
        )}
      </div>
    </>
  );
}

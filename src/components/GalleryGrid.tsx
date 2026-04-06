"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeInSection from "./FadeInSection";

interface Painting {
  id: number;
  slug: string;
  title: string;
  artist: string;
  year: string;
  category: string;
  imageUrl: string;
  sold: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  orientalist:      "Orientalist",
  portrait:         "Portraits",
  "works-on-paper": "Works on Paper",
};

export default function GalleryGrid({
  paintings,
  categories,
}: {
  paintings: Painting[];
  categories: string[];
}) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? paintings : paintings.filter((p) => p.category === active);

  return (
    <>
      {/* ── Filter tabs ─────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-16">
        {["all", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`
              relative font-body text-[10px] tracking-widest2 uppercase pb-2 transition-colors duration-200
              ${active === cat
                ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-accent"
                : "text-secondary hover:text-ink"
              }
            `}
          >
            {cat === "all" ? "All Works" : (CATEGORY_LABELS[cat] ?? cat)}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
        {filtered.map((painting, i) => (
          <FadeInSection key={painting.id} delay={(i % 3) * 80}>
            <Link href={`/gallery/${painting.slug}`} className="group block">

              {/* Image container */}
              <div className="aspect-[3/4] relative overflow-hidden bg-ink/5">
                <Image
                  src={painting.imageUrl}
                  alt={painting.title}
                  fill
                  className="object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

                {/* Bottom overlay text */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <p className="font-heading text-lg font-light text-cream leading-snug">
                    {painting.title}
                  </p>
                  <span className="font-body text-[10px] tracking-widest2 uppercase text-cream/60 mt-1.5 inline-block">
                    Enquire →
                  </span>
                </div>

                {/* Sold badge */}
                {painting.sold && (
                  <div className="absolute top-4 left-4 font-body text-[9px] tracking-widest2 uppercase bg-ink/80 text-cream/70 px-3 py-1.5">
                    Sold
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="mt-4 px-0.5">
                <h3 className="font-heading text-[1.15rem] font-light leading-snug group-hover:text-accent transition-colors duration-200">
                  {painting.title}
                </h3>
                <p className="font-body text-[11px] tracking-wide text-secondary mt-1.5">
                  {painting.artist} &nbsp;·&nbsp; {painting.year}
                </p>
              </div>
            </Link>
          </FadeInSection>
        ))}
      </div>
    </>
  );
}

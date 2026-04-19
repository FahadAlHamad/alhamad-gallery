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

const MOBILE_CATEGORY_LABELS: Record<string, string> = {
  orientalist:      "Orientalist",
  portrait:         "Portraits",
  "works-on-paper": "On Paper",
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
      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE — horizontal filter tabs + single column cards    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="md:hidden -mx-6">
        <div className="flex overflow-x-auto no-scrollbar pl-6 border-b border-border mb-8">
          {["all", ...categories].map((cat) => {
            const selected = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="shrink-0 relative pb-3.5 px-3.5 first:pl-0"
              >
                <span
                  className={`
                    font-body text-[9px] tracking-widest2 uppercase transition-colors duration-200
                    ${selected ? "text-ink" : "text-secondary"}
                  `}
                >
                  {cat === "all" ? "All" : (MOBILE_CATEGORY_LABELS[cat] ?? cat)}
                </span>
                {selected && (
                  <span
                    className="absolute bottom-0 left-3.5 right-3.5 first:left-0 h-px bg-accent"
                    style={{ left: cat === "all" ? 0 : undefined }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-11 px-6">
          {filtered.map((painting, i) => (
            <FadeInSection key={`m-${painting.id}-${active}`} delay={Math.min(i, 3) * 70}>
              <Link href={`/gallery/${painting.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
                  <Image
                    src={painting.imageUrl}
                    alt={painting.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-on-image font-heading text-[20px] font-light leading-tight text-cream">
                      {painting.title}
                    </p>
                    <span className="text-on-image-sm inline-block mt-2 font-body text-[10px] tracking-widest2 uppercase text-cream/80">
                      {painting.artist} · {painting.year}
                    </span>
                  </div>
                  {painting.sold && (
                    <div className="absolute top-3 left-3 font-body text-[8px] tracking-widest2 uppercase bg-ink/80 text-cream/70 px-2 py-1">
                      Sold
                    </div>
                  )}
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DESKTOP — centered tabs + 3-column grid (unchanged)      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
          {filtered.map((painting, i) => (
            <FadeInSection key={painting.id} delay={(i % 3) * 80}>
              <Link href={`/gallery/${painting.slug}`} className="group block">

                <div className="aspect-[3/4] relative overflow-hidden bg-ink/5">
                  <Image
                    src={painting.imageUrl}
                    alt={painting.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <p className="text-on-image font-heading text-xl font-light text-cream leading-snug">
                      {painting.title}
                    </p>
                    <span className="text-on-image-sm font-body text-[10px] tracking-widest2 uppercase text-cream mt-2 inline-block">
                      Enquire →
                    </span>
                  </div>

                  {painting.sold && (
                    <div className="absolute top-4 left-4 font-body text-[9px] tracking-widest2 uppercase bg-ink/80 text-cream/70 px-3 py-1.5">
                      Sold
                    </div>
                  )}
                </div>

                <div className="mt-4 px-0.5">
                  <h3 className="font-heading text-[1.2rem] font-light leading-snug group-hover:text-accent transition-colors duration-200">
                    {painting.title}
                  </h3>
                  <p className="font-body text-[12px] tracking-wide text-ink/55 mt-1.5">
                    {painting.artist} &nbsp;·&nbsp; {painting.year}
                  </p>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </>
  );
}

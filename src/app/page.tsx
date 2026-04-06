import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FadeInSection from "@/components/FadeInSection";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "Original Works",
  "19th Century",
  "Orientalist",
  "Private Collection",
  "Enquire to Purchase",
  "Oil on Canvas",
  "Continental School",
  "Works on Paper",
];

export default async function HomePage() {
  const featured = await prisma.painting.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_#f0ebe3_0%,_#faf8f4_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="anim-hero-sub font-body text-[10px] tracking-widest3 uppercase text-secondary mb-8">
            Private Collection &nbsp;·&nbsp; Est. 19th Century
          </p>

          <h1 className="anim-hero-title font-heading font-light text-[3.6rem] sm:text-[5rem] md:text-[6.5rem] leading-[0.92] tracking-tight text-ink">
            Alhamad<br />
            <em className="italic font-light">Gallery</em>
          </h1>

          <p className="anim-hero-sub font-heading italic font-light text-xl md:text-2xl text-secondary mt-8 leading-relaxed max-w-lg mx-auto">
            A private collection of exceptional<br className="hidden sm:block" /> 19th-century Orientalist paintings
          </p>

          <div className="anim-hero-cta mt-12">
            <Link
              href="/gallery"
              className="link-arrow inline-block font-body text-[11px] tracking-widest2 uppercase text-ink border-b border-ink/40 pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200"
            >
              View the Collection
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="anim-hero-cta absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-body text-[9px] tracking-widest2 uppercase text-ink">Scroll</span>
          <svg className="w-px h-8 text-ink" viewBox="0 0 1 32" fill="none" stroke="currentColor" strokeWidth={1}>
            <line x1="0.5" y1="0" x2="0.5" y2="32" />
          </svg>
        </div>
      </section>

      {/* ── Marquee strip ────────────────────────────────────── */}
      <div className="border-y border-border overflow-hidden py-3 bg-cream">
        <div className="anim-marquee">
          {[1, 2].map((n) => (
            <span key={n} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="flex items-center gap-6 px-6">
                  <span className="font-body text-[10px] tracking-widest2 uppercase text-secondary whitespace-nowrap">
                    {item}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured paintings ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-32">
        <FadeInSection>
          <div className="flex items-end justify-between mb-16">
            <h2 className="font-heading font-light text-[2.4rem] md:text-5xl leading-tight">
              Selected<br /><em className="italic">Works</em>
            </h2>
            <Link
              href="/gallery"
              className="link-arrow hidden md:inline-block font-body text-[10px] tracking-widest2 uppercase text-secondary hover:text-accent transition-colors duration-200 pb-0.5 border-b border-border"
            >
              View All
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featured.map((painting, i) => (
            <FadeInSection key={painting.id} delay={i * 100}>
              <Link href={`/gallery/${painting.slug}`} className="group block">
                <div className="aspect-[3/4] relative overflow-hidden bg-ink/5">
                  <Image
                    src={painting.imageUrl}
                    alt={painting.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-350 ease-out">
                    <p className="font-heading text-xl font-light text-cream leading-snug">
                      {painting.title}
                    </p>
                    <span className="font-body text-[10px] tracking-widest2 uppercase text-cream/60 mt-2 inline-block">
                      Enquire →
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="font-heading text-[1.2rem] font-light group-hover:text-accent transition-colors duration-200">
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

        <FadeInSection className="text-center mt-16 md:hidden">
          <Link
            href="/gallery"
            className="link-arrow font-body text-[10px] tracking-widest2 uppercase text-secondary hover:text-accent transition-colors duration-200 border-b border-border pb-0.5"
          >
            View All Works
          </Link>
        </FadeInSection>
      </section>

      {/* ── About blurb ──────────────────────────────────────── */}
      <section className="bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-28 md:py-36">
          <FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div>
                <p className="font-body text-[10px] tracking-widest2 uppercase text-cream/30 mb-6">
                  The Collection
                </p>
                <h2 className="font-heading font-light text-4xl md:text-5xl leading-tight text-cream">
                  Works chosen for<br />
                  <em className="italic">rarity and merit</em>
                </h2>
              </div>
              <div>
                <p className="font-body font-light text-cream/60 leading-[1.9] text-[0.95rem]">
                  Alhamad Gallery houses a carefully curated selection of 19th-century Orientalist
                  paintings, each chosen for its artistic merit, historical significance, and condition.
                  From intimate interior scenes to commanding portraits, the collection represents the
                  finest achievements of European artists captivated by the cultures and landscapes of
                  the East.
                </p>
                <Link
                  href="/about"
                  className="link-arrow inline-block font-body text-[10px] tracking-widest2 uppercase text-cream/40 hover:text-cream border-b border-cream/20 hover:border-cream/60 pb-0.5 mt-8 transition-colors duration-200"
                >
                  About the Gallery
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PaintingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const painting = await prisma.painting.findUnique({ where: { slug } });
  if (!painting) notFound();

  // Mobile detail rows (no price — per design decision, users enquire for price)
  const mobileDetails = [
    { label: "Artist",     value: painting.artist },
    { label: "Date",       value: painting.year },
    { label: "Medium",     value: painting.medium },
    { label: "Dimensions", value: painting.dimensions },
  ];

  // Desktop keeps the existing behavior: price shown if set
  const desktopDetails = [
    { label: "Artist",     value: painting.artist },
    { label: "Date",       value: painting.year },
    { label: "Medium",     value: painting.medium },
    { label: "Dimensions", value: painting.dimensions },
    ...(painting.price
      ? [{ label: "Price", value: painting.sold ? "Sold" : painting.price }]
      : []),
  ];

  const categoryLabel =
    painting.category === "works-on-paper" ? "Works on Paper"
      : painting.category === "portrait"     ? "Portrait"
        : "Orientalist";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE LAYOUT                                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="md:hidden pt-14">
        {/* Painting image — natural aspect ratio, no cropping */}
        <div className="relative w-full bg-ink/5 anim-detail-reveal">
          <Image
            src={painting.imageUrl}
            alt={painting.title}
            width={1200}
            height={1600}
            priority
            sizes="100vw"
            className="block w-full h-auto"
          />
          {painting.sold && (
            <div className="absolute top-3.5 left-3.5 font-body text-[8px] tracking-widest2 uppercase bg-ink/80 text-cream/70 px-2 py-1">
              Sold
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="px-6 pt-7 pb-20">
          <p className="font-body text-[9px] tracking-widest3 uppercase text-secondary mb-2.5">
            {categoryLabel}
          </p>
          <h1 className="font-heading font-light text-[30px] leading-[1.15] text-ink mb-4">
            {painting.title}
          </h1>
          <div className="w-7 h-px bg-border mb-5" />

          <dl className="space-y-0">
            {mobileDetails.map(({ label, value }) => (
              <div
                key={label}
                className="flex border-b border-border/60 py-2.5"
              >
                <dt className="font-body text-[9px] tracking-widest2 uppercase text-secondary w-[86px] shrink-0 self-center">
                  {label}
                </dt>
                <dd className="font-body text-[13px] font-light text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="font-body font-light text-[14px] text-secondary leading-[1.9] mt-6 mb-7">
            {painting.description}
          </p>

          {!painting.sold ? (
            <Link
              href={`/contact?painting=${painting.id}`}
              className="block w-full py-4 bg-ink text-center font-body text-[10px] tracking-widest2 uppercase text-cream active:bg-ink/80 transition-colors"
            >
              Enquire About This Work
            </Link>
          ) : (
            <div className="block w-full py-4 border border-border text-center font-body text-[10px] tracking-widest2 uppercase text-secondary">
              This Work Has Been Sold
            </div>
          )}
          <p className="text-center font-body text-[9px] text-secondary/50 mt-2.5">
            We respond to all enquiries within 48 hours
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DESKTOP LAYOUT — unchanged                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="hidden md:block pt-28 pb-28">

        {/* Back link */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-widest2 uppercase text-secondary hover:text-accent transition-colors duration-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Gallery
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 xl:gap-28">

            <div className="aspect-[3/4] relative overflow-hidden bg-ink/5">
              <Image
                src={painting.imageUrl}
                alt={painting.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="flex flex-col justify-center lg:py-8">

              <p className="font-body text-[10px] tracking-widest3 uppercase text-secondary mb-5">
                {categoryLabel}
              </p>

              <h1 className="font-heading font-light text-[1.9rem] md:text-[2.4rem] leading-[1.15] text-ink">
                {painting.title}
              </h1>

              <div className="w-10 h-px bg-border mt-6 mb-6" />

              <dl className="space-y-0">
                {desktopDetails.map(({ label, value }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[110px_1fr] border-b border-border/60 py-3.5"
                  >
                    <dt className="font-body text-[10px] tracking-widest2 uppercase text-secondary self-center">
                      {label}
                    </dt>
                    <dd className="font-body text-[13px] text-ink font-light self-center">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="font-body font-light text-[0.9rem] text-secondary leading-[1.9] mt-8">
                {painting.description}
              </p>

              <div className="mt-10">
                {!painting.sold ? (
                  <Link
                    href={`/contact?painting=${painting.id}`}
                    className="block w-full py-4 bg-ink text-cream text-center font-body text-[11px] tracking-widest2 uppercase hover:bg-ink/80 transition-colors duration-200"
                  >
                    Enquire About This Work
                  </Link>
                ) : (
                  <div className="block w-full py-4 border border-border text-center font-body text-[11px] tracking-widest2 uppercase text-secondary">
                    This Work Has Been Sold
                  </div>
                )}
                <p className="text-center font-body text-[10px] text-secondary/60 mt-3">
                  We respond to all enquiries within 48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

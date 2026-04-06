import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PaintingDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const painting = await prisma.painting.findUnique({ where: { slug } });
  if (!painting) notFound();

  const details = [
    { label: "Artist",     value: painting.artist },
    { label: "Date",       value: painting.year },
    { label: "Medium",     value: painting.medium },
    { label: "Dimensions", value: painting.dimensions },
    ...(painting.price
      ? [{ label: "Price", value: painting.sold ? "Sold" : painting.price }]
      : []),
  ];

  return (
    <div className="pt-28 pb-28">

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

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 xl:gap-28">

          {/* ── Image ─────────────────────────────────────── */}
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

          {/* ── Details ───────────────────────────────────── */}
          <div className="flex flex-col justify-center lg:py-8">

            {/* Category tag */}
            <p className="font-body text-[10px] tracking-widest3 uppercase text-secondary mb-5">
              {painting.category === "works-on-paper" ? "Works on Paper"
               : painting.category === "portrait"     ? "Portrait"
               : "Orientalist"}
            </p>

            {/* Title */}
            <h1 className="font-heading font-light text-[1.9rem] md:text-[2.4rem] leading-[1.15] text-ink">
              {painting.title}
            </h1>

            {/* Divider */}
            <div className="w-10 h-px bg-border mt-6 mb-6" />

            {/* Metadata table */}
            <dl className="space-y-0">
              {details.map(({ label, value }) => (
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

            {/* Description */}
            <p className="font-body font-light text-[0.9rem] text-secondary leading-[1.9] mt-8">
              {painting.description}
            </p>

            {/* CTA */}
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
  );
}

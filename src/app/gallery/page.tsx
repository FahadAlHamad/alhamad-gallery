import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery — Alhamad Gallery",
  description: "Browse our collection of 19th-century Orientalist paintings.",
};

export default async function GalleryPage() {
  const paintings = await prisma.painting.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const categories = Array.from(new Set(paintings.map((p) => p.category)));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-[88px] md:pt-36 pb-16 md:pb-32">

      {/* Page header */}
      <div className="mb-8 md:mb-20">
        <p className="font-body text-[9px] md:text-[10px] tracking-widest3 uppercase text-secondary mb-2.5 md:mb-4">
          The Collection
        </p>
        <h1 className="font-heading font-light text-[52px] md:text-6xl leading-none">
          <span className="md:hidden">Gallery</span>
          <span className="hidden md:inline">The Collection</span>
        </h1>
      </div>

      <GalleryGrid paintings={paintings} categories={categories} />
    </section>
  );
}

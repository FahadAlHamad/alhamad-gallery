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
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-32">

      {/* Page header */}
      <div className="mb-16 md:mb-20">
        <p className="font-body text-[10px] tracking-widest3 uppercase text-secondary mb-4">
          Alhamad Gallery
        </p>
        <h1 className="font-heading font-light text-[2.8rem] md:text-6xl leading-none">
          The Collection
        </h1>
      </div>

      <GalleryGrid paintings={paintings} categories={categories} />
    </section>
  );
}

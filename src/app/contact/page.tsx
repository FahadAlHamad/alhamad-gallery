import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Alhamad Gallery",
  description: "Enquire about a painting or get in touch with Alhamad Gallery.",
};

export default async function ContactPage() {
  const paintings = await prisma.painting.findMany({
    where: { sold: false },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="pt-[88px] md:pt-32 pb-20 md:pb-32">
      <div className="max-w-2xl mx-auto px-6 md:px-10">

        <FadeInSection>
          <div className="mb-9 md:mb-14">
            <p className="font-body text-[9px] md:text-[10px] tracking-widest3 uppercase text-secondary mb-2.5 md:mb-4">
              Get in Touch
            </p>
            <h1 className="font-heading font-light text-[52px] md:text-5xl leading-none mb-5 md:mb-6">
              Enquire
            </h1>
            <p className="font-body font-light text-[14px] md:text-[0.93rem] text-secondary leading-[1.85]">
              Interested in a work from the collection? We respond to all
              enquiries within 48 hours and are happy to provide additional
              photography, condition reports, or provenance documentation.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <ContactForm paintings={paintings} />
        </FadeInSection>

      </div>
    </div>
  );
}

import { Metadata } from "next";
import FadeInSection from "@/components/FadeInSection";

export const metadata: Metadata = {
  title: "About — Alhamad Gallery",
  description: "Learn about the Alhamad Gallery and our collection of 19th-century Orientalist paintings.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-32">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-20">
        <FadeInSection>
          <p className="font-body text-[10px] tracking-widest3 uppercase text-secondary mb-4">
            The Gallery
          </p>
          <h1 className="font-heading font-light text-[2.8rem] md:text-6xl leading-none">
            About
          </h1>
        </FadeInSection>
      </div>

      {/* ── Pull quote ───────────────────────────────────────── */}
      <FadeInSection>
        <div className="border-y border-border py-16 md:py-20 mb-24">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <blockquote className="font-heading italic font-light text-[1.7rem] md:text-[2.4rem] leading-[1.35] text-ink/75 text-center">
              &ldquo;Each work in the collection has been selected for its artistic quality,
              historical significance, and the story it carries across centuries.&rdquo;
            </blockquote>
          </div>
        </div>
      </FadeInSection>

      {/* ── Body text ────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <FadeInSection>
          <div className="space-y-10">

            <div>
              <h2 className="font-heading font-light text-2xl md:text-3xl mb-4 text-ink">
                The Collection
              </h2>
              <p className="font-body font-light text-[0.93rem] text-secondary leading-[1.9]">
                Alhamad Gallery is a private collection dedicated to the preservation and appreciation
                of 19th-century Orientalist painting. The collection has been assembled over many years
                with a single guiding principle: each work must be exceptional on its own terms —
                remarkable in execution, condition, and resonance.
              </p>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h2 className="font-heading font-light text-2xl md:text-3xl mb-4 text-ink">
                The Orientalist Movement
              </h2>
              <p className="font-body font-light text-[0.93rem] text-secondary leading-[1.9]">
                The Orientalist movement emerged as European artists travelled to North Africa, the
                Levant, and the wider Islamic world, producing works that documented — and often
                romanticised — the people, architecture, and landscapes they encountered. These
                paintings remain important both as artistic achievements and as historical documents
                of a transformative era, capturing fleeting glimpses of lives and places that have
                since changed beyond recognition.
              </p>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h2 className="font-heading font-light text-2xl md:text-3xl mb-4 text-ink">
                The Works
              </h2>
              <p className="font-body font-light text-[0.93rem] text-secondary leading-[1.9]">
                The collection spans a range of subjects: intimate interior scenes suffused with light
                and shadow, commanding portraits of individuals, meticulously rendered architectural
                studies, and evocative genre scenes. Media include oil on canvas, oil on panel, and
                delicate works on paper. Each piece is accompanied by as complete a provenance record
                as can be established.
              </p>
            </div>

            <div className="w-full h-px bg-border" />

            <div>
              <h2 className="font-heading font-light text-2xl md:text-3xl mb-4 text-ink">
                Acquisitions
              </h2>
              <p className="font-body font-light text-[0.93rem] text-secondary leading-[1.9]">
                Works from the collection are available for acquisition by private collectors, museums,
                and institutions. We welcome enquiries about any piece and are happy to provide
                additional photography, condition reports, and provenance documentation upon request.
                All enquiries are handled with the utmost discretion.
              </p>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-block font-body text-[11px] tracking-widest2 uppercase text-ink border-b border-ink/30 pb-0.5 hover:text-accent hover:border-accent transition-colors duration-200 link-arrow"
                >
                  Make an Enquiry
                </a>
              </div>
            </div>

          </div>
        </FadeInSection>
      </div>
    </div>
  );
}

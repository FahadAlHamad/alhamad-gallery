"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  imageUrl: string;
  alt?: string;
}

/**
 * Mobile-only full-bleed hero with parallax scroll effect.
 * Renders edge-to-edge under the fixed header.
 */
export default function MobileHomeHero({ imageUrl, alt = "" }: Props) {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.38}px)`;
      }
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <section className="md:hidden relative overflow-hidden h-[calc(100dvh-56px)] min-h-[480px] -mt-[56px] pt-[56px]">
      {/* Parallax image layer */}
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform"
        style={{ height: "130%" }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      {/* Dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5 pointer-events-none" />

      {/* Hero text */}
      <div className="absolute bottom-11 left-7 right-7">
        <p
          className="font-body text-[9px] tracking-widest3 uppercase text-cream/40 mb-3.5"
          style={{ animation: "fadeInUp 900ms cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
        >
          Private Collection &nbsp;·&nbsp; Est. 19th Century
        </p>
        <h1
          className="font-heading font-light text-[72px] leading-[0.9] tracking-tight text-cream mb-7"
          style={{ animation: "fadeInUp 900ms cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          Alhamad
          <br />
          <em className="italic font-light">Gallery</em>
        </h1>
        <Link
          href="/gallery"
          className="inline-block font-body text-[10px] tracking-widest2 uppercase text-cream/80 border-b border-cream/25 pb-[3px]"
          style={{ animation: "fadeInUp 900ms cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          View the Collection →
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-6 bg-cream/25 anim-scroll-pulse" />
      </div>
    </section>
  );
}

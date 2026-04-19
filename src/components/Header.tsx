"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile overlay menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/gallery", label: "Gallery" },
    { href: "/about",   label: "About"   },
    { href: "/contact", label: "Contact" },
    { href: "/",        label: "Home"    },
  ];

  // Painting detail page pattern: /gallery/<slug>
  const isDetail = /^\/gallery\/[^/]+$/.test(pathname);

  return (
    <>
      <header
        className={`
          anim-nav fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          bg-cream/85 backdrop-blur-md border-b border-border/50
          ${scrolled
            ? "md:bg-cream/90 md:backdrop-blur-md md:border-border/70 md:shadow-[0_1px_0_0_rgba(201,196,188,0.5)]"
            : "md:bg-cream/70 md:backdrop-blur-sm md:border-border/40"
          }
        `}
      >
        {/* ── Desktop bar ─────────────────────────────────────── */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 md:px-10 h-[100px] items-center justify-between">
          <Link
            href="/"
            className="flex items-center hover:opacity-75 transition-opacity duration-300"
          >
            <Image
              src="/images/logo.png"
              alt="Alhamad Gallery"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-10">
            {navLinks
              .filter((l) => l.href !== "/")
              .map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    font-body text-[10px] tracking-widest3 uppercase transition-colors duration-200
                    ${pathname === href ? "text-accent" : "text-secondary hover:text-ink"}
                  `}
                >
                  {label}
                </Link>
              ))}
          </nav>
        </div>

        {/* ── Mobile bar ──────────────────────────────────────── */}
        <div className="md:hidden relative h-[56px] flex items-center px-5 justify-between">
          {/* Left: back link on detail pages, spacer otherwise */}
          {isDetail ? (
            <button
              onClick={() => router.push("/gallery")}
              className="flex items-center gap-1.5 text-secondary active:opacity-70 transition-opacity"
              aria-label="Back to gallery"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span className="font-body text-[9px] tracking-widest2 uppercase">Gallery</span>
            </button>
          ) : (
            <div className="w-[60px]" />
          )}

          {/* Center: logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center hover:opacity-75 transition-opacity duration-300"
            aria-label="Alhamad Gallery home"
          >
            <Image
              src="/images/logo.png"
              alt="Alhamad Gallery"
              width={52}
              height={52}
              className="object-contain opacity-95"
              priority
            />
          </Link>

          {/* Right: hamburger */}
          <button
            className="p-2 -mr-2 text-secondary active:text-ink transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <line x1="4" y1="7"  x2="20" y2="7"  strokeLinecap="round" />
              <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay menu (variant B) ───────── */}
      <div
        className={`
          md:hidden fixed inset-0 z-[100] bg-ink flex flex-col justify-center px-9
          transition-opacity duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden={!menuOpen}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-14 right-6 p-1"
          aria-label="Close menu"
        >
          <svg width="26" height="26" fill="none" stroke="rgba(250,248,244,0.55)" strokeWidth={1.5} viewBox="0 0 24 24">
            <line x1="18" y1="6"  x2="6"  y2="18" strokeLinecap="round" />
            <line x1="6"  y1="6"  x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="font-body text-[9px] tracking-widest3 uppercase text-cream/25 mb-9">
          Navigate
        </p>

        {navLinks.map((link, i) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`
                flex items-center justify-between py-5 border-b border-cream/10
                ${i === 0 ? "border-t border-cream/10" : ""}
              `}
            >
              <span
                className={`
                  font-heading font-light leading-none text-[40px] transition-colors duration-200
                  ${active ? "text-accent" : "text-cream"}
                `}
              >
                {link.label}
              </span>
              {active && (
                <span className="font-body text-[9px] tracking-widest2 text-accent">—</span>
              )}
            </Link>
          );
        })}

        <p className="absolute bottom-10 left-9 font-body text-[8px] tracking-widest2 uppercase text-cream/20">
          Alhamad Gallery · Private Collection
        </p>
      </div>
    </>
  );
}

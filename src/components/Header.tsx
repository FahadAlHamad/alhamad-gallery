"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/gallery", label: "Gallery" },
    { href: "/about",   label: "About"   },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`
        anim-nav fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-border/70 shadow-[0_1px_0_0_rgba(201,196,188,0.5)]"
          : "bg-cream/70 backdrop-blur-sm border-b border-border/40"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-[100px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-75 transition-opacity duration-300">
          <Image
            src="/images/logo.png"
            alt="Alhamad Gallery"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-ink/60 hover:text-ink transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-400 ease-in-out
          ${menuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
          bg-cream/95 backdrop-blur-md border-t border-border/40
        `}
      >
        <nav className="px-8 py-5 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
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
    </header>
  );
}

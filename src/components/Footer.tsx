import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream border-t border-cream/10 mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-14">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Left: brand */}
          <Link href="/" className="flex items-center hover:opacity-75 transition-opacity duration-300">
            <Image
              src="/images/logo.png"
              alt="Alhamad Gallery"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>

          {/* Centre: nav */}
          <nav className="flex items-center gap-8">
            {[
              { href: "/gallery", label: "Gallery" },
              { href: "/about",   label: "About"   },
              { href: "/contact", label: "Contact"  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-[10px] tracking-widest3 uppercase text-cream/40 hover:text-cream/80 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: email */}
          <a
            href="mailto:info@alhamadgallery.com"
            className="font-body text-[11px] tracking-wide text-cream/40 hover:text-cream/70 transition-colors duration-200"
          >
            info@alhamadgallery.com
          </a>
        </div>

        {/* Bottom: copyright */}
        <div className="mt-10 pt-6 border-t border-cream/10 flex items-center justify-between">
          <p className="text-[10px] tracking-wider uppercase text-cream/25 font-body">
            &copy; {new Date().getFullYear()} Alhamad Gallery
          </p>
          <p className="text-[10px] tracking-wider uppercase text-cream/25 font-body">
            Private Collection
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A horizontal-scroll container that correctly passes vertical swipes
 * through to the page. The browser's default touch-action handling
 * absorbs vertical gestures on scrollable elements — this component
 * manually detects gesture direction and delegates vertical movement
 * to window.scrollBy so the page scrolls normally.
 */
export default function HorizontalScrollStrip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let direction: "h" | "v" | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastY  = startY;
      direction = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      // Lock direction on first significant movement
      if (!direction && (dx > 4 || dy > 4)) {
        direction = dx > dy ? "h" : "v";
      }

      if (direction === "v") {
        // Stop the strip from reacting; scroll the page instead
        e.preventDefault();
        const delta = lastY - e.touches[0].clientY;
        window.scrollBy({ top: delta, behavior: "instant" as ScrollBehavior });
        lastY = e.touches[0].clientY;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`flex overflow-x-auto overflow-y-hidden no-scrollbar ${className}`}
    >
      {children}
    </div>
  );
}

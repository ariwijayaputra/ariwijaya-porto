"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect } from "react";

gsap.registerPlugin(ScrollToPlugin);

let busy = false;

export function scrollToY(y: number) {
  busy = true;
  // mobile's CSS snap would fight every frame of the tween
  const root = document.documentElement.style;
  root.scrollSnapType = "none";
  const done = () => {
    busy = false;
    root.scrollSnapType = "";
  };
  gsap.to(window, {
    scrollTo: y,
    duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.8,
    ease: "power2.inOut",
    overwrite: true,
    onComplete: done,
    onInterrupt: done,
  });
}

const KEYS: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };

// Desktop paging: one wheel gesture or key press moves exactly one [data-snap] point
// (each section, and each project inside the work slider). Below lg, native scroll.
export default function SnapScroll() {
  useEffect(() => {
    const desktop = matchMedia("(min-width: 64rem)");
    let lastWheel = 0;

    const step = (dir: number) => {
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const y = window.scrollY;
      const points = [...document.querySelectorAll("[data-snap]")].map((el) =>
        Math.round(el.getBoundingClientRect().top + y - pad),
      );
      // ponytail: nothing past the last point; content below it needs its own data-snap
      const next = dir > 0 ? points.find((p) => p > y + 1) : points.filter((p) => p < y - 1).pop();
      if (next !== undefined) scrollToY(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (!desktop.matches || e.ctrlKey || !e.deltaY) return; // ctrl+wheel is browser zoom
      e.preventDefault();
      const now = performance.now();
      // trackpad momentum arrives as one unbroken stream; only a pause starts a new gesture
      const fresh = now - lastWheel > 200;
      lastWheel = now;
      if (fresh && !busy) step(Math.sign(e.deltaY));
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        !desktop.matches ||
        !(e.key in KEYS) ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        t.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) ||
        (e.key === " " && /^(BUTTON|A)$/.test(t.tagName))
      )
        return;
      e.preventDefault();
      if (!busy) step(e.key === " " && e.shiftKey ? -1 : KEYS[e.key]);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}

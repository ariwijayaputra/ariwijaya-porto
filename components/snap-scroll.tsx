"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect } from "react";

gsap.registerPlugin(ScrollToPlugin);

// the running scrollToY: its token and where it lands
let tween: object | null = null;
let target: number | null = null;

const sections = () => [...document.querySelectorAll<HTMLElement>("main > section")];
const pad = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

// The section being looked at: where a running scrollToY lands (so a jump never
// "visits" what it passes), else the last one whose top has passed mid-screen.
export function activeSection() {
  const mid = (target ?? window.scrollY) + innerHeight / 2;
  const all = sections();
  return all.findLast((s) => s.getBoundingClientRect().top + window.scrollY <= mid) ?? all[0];
}

// every other section fades out, see main > section[data-away] in globals.css
function markAway() {
  const active = activeSection();
  for (const s of sections()) s.toggleAttribute("data-away", s !== active);
}

export function scrollToY(y: number) {
  // a token, not a flag: overwrite interrupts the previous tween inside gsap.to,
  // and its onInterrupt must not clear this one's state
  const me = {};
  tween = me;
  target = y;
  markAway();
  // mobile's CSS snap would fight every frame of the tween
  const root = document.documentElement.style;
  root.scrollSnapType = "none";
  const done = () => {
    if (tween !== me) return;
    tween = target = null;
    root.scrollSnapType = "";
    markAway();
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
// All widths: in-page #links scroll with the same tween, and off-screen sections fade out.
export default function SnapScroll() {
  useEffect(() => {
    const desktop = matchMedia("(min-width: 64rem)");
    let lastWheel = 0;

    const step = (dir: number) => {
      const y = window.scrollY;
      const p = pad();
      const points = [...document.querySelectorAll("[data-snap]")].map((el) =>
        Math.round(el.getBoundingClientRect().top + y - p),
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
      if (fresh && !tween) step(Math.sign(e.deltaY));
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
      if (!tween) step(e.key === " " && e.shiftKey ? -1 : KEYS[e.key]);
    };

    // ponytail: focus stays on the clicked link (native jumps move the tab start point); add if keyboard users miss it
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = document.getElementById(a.hash.slice(1));
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", a.hash);
      scrollToY(el.getBoundingClientRect().top + window.scrollY - pad());
    };

    markAway();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", markAway, { passive: true });
    window.addEventListener("resize", markAway);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", markAway);
      window.removeEventListener("resize", markAway);
    };
  }, []);

  return null;
}

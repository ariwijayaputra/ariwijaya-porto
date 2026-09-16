"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    // eased follow, normalised to 60fps so 120Hz screens feel the same; snaps for reduced motion
    const ease = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.15;
    let x = 0, y = 0, tx = 0, ty = 0, frame = 0, last = 0;

    const tick = (now: number) => {
      const k = 1 - Math.pow(1 - ease, (now - last) / 16.67);
      last = now;
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (el.style.opacity !== "1") {
        x = tx; // first move or re-entry: appear under the pointer, don't fly in from the old spot
        y = ty;
        el.style.opacity = "1";
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const leave = () => (el.style.opacity = "0");
    // grow into the arrow circle over anything clickable, unless it opts out with data-no-hover
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element).closest?.("a, button, label, select, summary, input, textarea, [role=button]");
      el.toggleAttribute("data-hover", !!hit && !hit.hasAttribute("data-no-hover"));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    root.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      root.removeEventListener("mouseleave", leave);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="group pointer-events-none fixed top-0 left-0 z-50 hidden opacity-0 transition-opacity duration-300 pointer-fine:block"
    >
      <div className="relative -translate-1/2">
        <div className="glow top-1/2 left-1/2 size-[calc(var(--cursor)*5)] -translate-1/2" />
        <div className="relative grid size-8 place-items-center rounded-full border-4 border-neutral-50 text-ink transition-[width,height,background-color] duration-300 ease-out group-data-hover:size-(--cursor) group-data-hover:bg-neutral-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.75}
            className="w-[36%] opacity-0 transition-opacity duration-300 group-data-hover:opacity-100"
          >
            <path d="M19 19 5 5M5 17V5h12" />
          </svg>
        </div>
      </div>
    </div>
  );
}

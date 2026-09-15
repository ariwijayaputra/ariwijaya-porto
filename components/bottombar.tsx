"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { activeSection } from "@/components/snap-scroll";
import { blurIn, useReveal } from "@/components/splash";

export const tabs = [
  { id: "home", label: "Home", icon: <path d="M3.5 10 12 3l8.5 7v11h-17zM9.5 21v-6h5v6" /> },
  {
    id: "work",
    label: "Work",
    icon: <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" />,
  },
  { id: "contact", label: "Contact", icon: <path d="M2.5 5h19v14h-19zm0 0 9.5 8 9.5-8" /> },
];
const justify = ["justify-self-start", "justify-self-center", "justify-self-end"];
const ease = "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// Tab index of activeSection(), so a jump highlights its destination, not what it passes.
export function useActiveSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => setActive(Math.max(0, tabs.findIndex((t) => t.id === activeSection()?.id)));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return active;
}

// Mobile navigation. The line and dot only mirror the section in view; they aren't a slider.
export default function Bottombar() {
  const active = useActiveSection();
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // once the splash is gone, the tabs float in left to right and the line and dot fade in.
  // Opacity only on those: place() owns their transforms
  useReveal(() => {
    const row = rowRef.current!;
    return gsap
      .timeline()
      .add(blurIn(row.children, { stagger: 0.1 }))
      .from(
        row.parentElement!.querySelectorAll(":scope > [aria-hidden]"),
        { autoAlpha: 0, duration: 1.6, clearProps: "opacity,visibility" },
        0,
      );
  });

  useEffect(() => {
    const place = () => {
      const row = rowRef.current!;
      const tab = row.children[active] as HTMLElement;
      const x = tab.offsetLeft + tab.offsetWidth / 2;
      fillRef.current!.style.transform = `scaleX(${x / row.offsetWidth})`;
      dotRef.current!.style.transform = `translateX(${x}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <nav aria-label="Navigasi" className="page-grid sticky bottom-0 z-10 h-(--bar-h) bg-ink text-small lg:hidden">
      <div className="relative col-span-full">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
        <div
          ref={fillRef}
          aria-hidden
          className={`absolute inset-x-0 top-0 h-px origin-left bg-white ${ease}`}
          style={{ transform: "scaleX(0)" }}
        />
        <div ref={dotRef} aria-hidden className={`absolute top-0 left-0 ${ease}`}>
          <div className="size-1 -translate-1/2 rounded-full bg-white" />
        </div>

        <div ref={rowRef} className="grid h-full grid-cols-3 items-center">
          {tabs.map((t, i) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              aria-current={i === active ? "location" : undefined}
              className={`flex flex-col items-center gap-1 px-2 transition-colors duration-300 ${justify[i]} ${i === active ? "text-white" : "text-mute"}`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinejoin="round"
                className="size-4.5"
              >
                {t.icon}
              </svg>
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

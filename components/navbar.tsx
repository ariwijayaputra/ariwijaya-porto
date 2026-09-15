"use client";

import gsap from "gsap";
import { useRef } from "react";
import { tabs, useActiveSection } from "@/components/bottombar";
import { toggleLang, useLang } from "@/components/lang";
import { blurIn, useReveal } from "@/components/splash";

export default function Navbar() {
  const active = useActiveSection();
  const lang = useLang();
  const bar = useRef<HTMLDivElement>(null);

  // once the splash is gone, the items float in left to right and the line fades in
  useReveal(() => {
    const el = bar.current!;
    // the line's own colour at alpha 0: plain "transparent" is black and fades in through a lighter grey
    const clear = getComputedStyle(el).borderBottomColor.replace("rgb(", "rgba(").replace(")", ", 0)");
    return gsap
      .timeline()
      .add(blurIn(el.querySelectorAll("li, p"), { stagger: 0.1 }))
      .from(el, { borderBottomColor: clear, duration: 1.6, clearProps: "borderBottomColor" }, 0);
  });

  return (
    <header className="sticky top-0 z-10 bg-ink">
      <nav className="page-grid h-(--nav-h) text-nav">
        <div ref={bar} className="col-span-full grid grid-cols-subgrid items-center border-b border-line">
          <ul className="hidden gap-10 font-light lg:col-span-4 lg:flex">
            {tabs.map((t, i) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={i === active ? "location" : undefined}
                  className={`flex items-center gap-2 transition-colors duration-300 hover:text-white ${i === active ? "text-white" : "text-mute"}`}
                >
                  {/* <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinejoin="round"
                    className="size-[1.333em]"
                  >
                    {t.icon}
                  </svg> */}
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="col-span-3 font-display text-white uppercase lg:col-span-4 lg:text-center">
            Ari Wijaya Putra
          </p>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={lang === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
            className="col-span-3 flex items-center leading-0 justify-self-end gap-2 text-mute lg:col-span-4">
            <span className="mt-[0.2rem] uppercase">{lang}</span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="size-[1.333em] text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

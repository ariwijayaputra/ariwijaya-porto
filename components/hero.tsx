"use client";

import gsap from "gsap";
import { useRef } from "react";
import { blurIn, useReveal } from "@/components/splash";

// Home section. Once the splash is gone the title floats in word by word
// (just after the navbar starts), then the intro and copyright line by line.
export default function Hero() {
  const title = useRef<HTMLHeadingElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const copyright = useRef<HTMLParagraphElement>(null);

  useReveal((split) => {
    const words = split(title.current!, { type: "words" });
    const lines = split([intro.current!, copyright.current!], { type: "lines" });
    return gsap
      .timeline()
      .add(blurIn(words.words, { duration: 1.8, stagger: 0.12 }), 0.25)
      .add(blurIn(lines.lines, { stagger: 0.12 }), "<0.7");
  });

  return (
    <section id="home" data-snap className="page-grid relative min-h-(--section-h) grid-rows-[auto_1fr] pt-9 pb-5 text-body lg:pt-14 lg:pb-6">
      {/* touch devices get a static glow; mouse users get it on the cursor */}
      <div
        aria-hidden
        className="glow top-1/2 right-0 size-[150vw] translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
      />

      {/* mobile lets the first two lines flow (UBAH IDE / RUMIT JADI / PENGALAMAN) */}
      <h1 ref={title} className="relative col-span-full font-display text-display uppercase">
        <span className="lg:block">Ubah ide rumit</span>{" "}
        <span className="lg:block">jadi pengalaman</span>
        <span className="block text-right">berkesan</span>
      </h1>

      <div className="relative col-span-full grid grid-cols-subgrid self-end">
        <p ref={intro} className="col-span-4 self-end lg:max-w-[32ch]">
          <span className="text-dim">
            Saya adalah software engineer yang senang mengubah ide kompleks
            menjadi pengalaman yang sederhana.
          </span>{" "}
          Saya mampu mengerjakan berbagai hal, mulai dari merancang
          antarmuka hingga membangun sistem di baliknya, dengan memadukan
          desain yang matang, teknologi yang tepat, dan kode yang bersih.
        </p>

        <p ref={copyright} className="hidden text-mute lg:col-span-4 lg:col-start-9 lg:block lg:self-end lg:text-right">
          Copyright 2026 By Ari Wijaya Putra
        </p>
      </div>
    </section>
  );
}

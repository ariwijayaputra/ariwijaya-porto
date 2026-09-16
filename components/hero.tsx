"use client";

import gsap from "gsap";
import { useRef } from "react";
import { useLang } from "@/components/lang";
import { blurIn, useReveal } from "@/components/splash";

// Home section. Once the splash is gone the title floats in word by word
// (just after the navbar starts), then the intro and copyright line by line.
export default function Hero() {
  const title = useRef<HTMLHeadingElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const copyright = useRef<HTMLParagraphElement>(null);
  const en = useLang() === "en";

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
      {/* keyed by language: a switch mid-reveal swaps in fresh nodes instead of fighting SplitText */}
      <h1 key={`h${en}`} ref={title} className="relative col-span-full font-display text-display uppercase">
        <span className="lg:block">{en ? "Turn complex" : "Ubah ide rumit"}</span>{" "}
        <span className="lg:block">{en ? "ideas to enjoyable" : "jadi pengalaman"}</span>
        <span className="block text-right">{en ? "experience" : "berkesan"}</span>
      </h1>

      <div className="relative col-span-full grid grid-cols-subgrid self-end">
        {en ? (
          <p key="en" ref={intro} className="col-span-4 self-end lg:max-w-[32ch]">
            <span className="text-dim">
              I design and build websites from start to finish, combining
              UI/UX design with coding so nothing gets lost between idea and
              final product.
            </span>{" "}
            Every layout is built around how users think, with clean,
            responsive code for any device.
          </p>
        ) : (
          <p key="id" ref={intro} className="col-span-4 self-end lg:max-w-[32ch]">
            <span className="text-dim">
              Saya merancang dan membangun website dari awal hingga akhir,
              menggabungkan desain UI/UX dengan coding agar tidak ada yang
              hilang antara ide dan hasil akhir.
            </span>{" "}
            Setiap tampilan dirancang sesuai cara pengguna berpikir, dengan
            kode yang rapi dan responsif di berbagai perangkat.
          </p>
        )}

        <p ref={copyright} className="hidden text-mute lg:col-span-4 lg:col-start-9 lg:block lg:self-end lg:text-right">
          Copyright 2026 By Ari Wijaya Putra
        </p>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { scrollToY } from "@/components/snap-scroll";
import clears from "@/public/img/sample-clears-studio.png";
import daru from "@/public/img/sample-daru-invitation.png";
import komi from "@/public/img/sample-komi-design-studio.png";
import longevity from "@/public/img/sample-longevity.png";
import pkb from "@/public/img/sample-pesta-kesenian-bali.png";
import studioKo from "@/public/img/sample-studio-ko.png";

// ponytail: placeholder copy, swap in real project data (or a CMS) later
const lorem =
  "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud.";
const projects = [
  { title: "Clears Studio", image: clears },
  { title: "Pesta Kesenian Bali", image: pkb },
  { title: "Komi Design Studio", image: komi },
  { title: "Studio KO", image: studioKo },
  { title: "Longevity", image: longevity },
  { title: "Daru Invitation", image: daru },
];

export default function Work() {
  // dir: +1 moving to the next project (it rises from below), -1 back to the previous one
  const [{ active, dir }, setView] = useState({ active: 0, dir: 1 });
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const n = projects.length;
  const project = projects[active];

  // the section is n screens tall with the frame pinned; how far the frame has
  // slid down inside it (in frame heights) is the active project
  useEffect(() => {
    const onScroll = () => {
      const frame = frameRef.current!.getBoundingClientRect();
      // a tiny viewport (e.g. devtools open) collapses --section-h to 0, and 0/0 is NaN
      if (!frame.height) return;
      const top = sectionRef.current!.getBoundingClientRect().top;
      const i = Math.min(projects.length - 1, Math.max(0, Math.round((frame.top - top) / frame.height)));
      setView((v) => (v.active === i ? v : { active: i, dir: Math.sign(i - v.active) }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (offset: number) =>
    scrollToY(window.scrollY + offset * frameRef.current!.offsetHeight);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(${n} * var(--section-h))` }}
    >
      {/* one paging point per project, see components/snap-scroll.tsx;
          sized, because CSS snap (mobile) ignores empty snap areas */}
      {projects.map((p, i) => (
        <div
          key={p.title}
          aria-hidden
          data-snap
          className="absolute inset-x-0 h-(--section-h)"
          style={{ top: `calc(${i} * var(--section-h))` }}
        />
      ))}

      {/* mobile: title / panel / description, panel dead centre (the y slide relies on it).
          desktop: panel centred above, title and description share the bottom row */}
      <div
        ref={frameRef}
        className="page-grid sticky top-(--nav-h) h-(--section-h) grid-rows-[1fr_auto_1fr] text-body lg:grid-rows-[1fr_auto] lg:pb-6"
        style={{ "--reveal-dir": dir } as CSSProperties}
      >
        {/* text reveal finishes together with the slide, see --animate-reveal */}
        <div className="col-span-5 self-end pb-6 lg:col-span-7 lg:row-start-2 lg:pb-0">
          <h2
            key={active}
            className="font-display text-title uppercase motion-safe:animate-reveal"
          >
            {project.title}
          </h2>
        </div>

        {/* desktop: centred between navbar and the text below, so both gaps match;
            the padding reserves room for the active project's panel */}
        <div className="col-span-full justify-self-center p-(--work-pad) lg:row-start-1 lg:self-center">
          <div className="grid h-(--work-img-h) w-(--work-img-w)">
            {projects.map((p, i) => {
              const offset = i - active;
              const far = Math.abs(offset) > 1;
              return (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(offset)}
                  tabIndex={Math.abs(offset) === 1 ? 0 : -1}
                  aria-hidden={far}
                  aria-label={offset ? `Lihat proyek ${p.title}` : p.title}
                  className="work-slide relative col-start-1 row-start-1 transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={
                    {
                      "--o": offset,
                      "--k": offset ? "var(--work-side)" : 1,
                      opacity: far ? 0 : 1,
                      zIndex: offset ? 0 : 1,
                    } as CSSProperties
                  }
                >
                  {/* panel hides behind the screenshot and grows out once the project is active */}
                  <div
                    className="absolute -inset-(--work-pad) -z-10 bg-panel transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{
                      clipPath: offset ? "inset(var(--work-pad))" : "inset(0px)",
                      transitionDelay: offset ? "0ms" : "300ms",
                    }}
                  />
                  {/* the blur is a static copy crossfaded on opacity: Chrome won't run an animated
                      blur on the compositor, so phones dropped its frames and it popped at the end */}
                  <Image
                    src={p.image}
                    alt=""
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    loading="eager"
                    placeholder="blur"
                    className="block size-full transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ opacity: offset ? 0 : 1 }}
                  />
                  <Image
                    src={p.image}
                    alt=""
                    aria-hidden
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    loading="eager"
                    className="absolute inset-0 size-full blur-(--work-blur) transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ opacity: offset ? 1 : 0 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-5 self-start pt-5 lg:col-start-8 lg:row-start-2 lg:self-end lg:pt-0">
          <p key={active} className="motion-safe:animate-reveal">
            {lorem}
          </p>
        </div>
      </div>
    </section>
  );
}

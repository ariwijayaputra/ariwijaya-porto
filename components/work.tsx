"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useLang } from "@/components/lang";
import { scrollToY } from "@/components/snap-scroll";

// shape of PROJECTS_QUERY in app/page.tsx
export type Project = {
  _id: string;
  title: string;
  description: { id: string; en: string };
  url: string | null;
  image: { url: string; lqip: string; width: number; height: number };
};

export default function Work({ projects }: { projects: Project[] }) {
  // dir: +1 moving to the next project (it rises from below), -1 back to the previous one
  const [{ active, dir }, setView] = useState({ active: 0, dir: 1 });
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const en = useLang() === "en";
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
      const i = Math.min(n - 1, Math.max(0, Math.round((frame.top - top) / frame.height)));
      setView((v) => (v.active === i ? v : { active: i, dir: Math.sign(i - v.active) }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

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
          key={p._id}
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
            {project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
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
                  key={p._id}
                  type="button"
                  // ponytail: stays a <button> so the slide keeps its DOM node (and transition);
                  // the title is the real <a> for keyboard and middle-click
                  onClick={() =>
                    offset ? goTo(offset) : p.url && window.open(p.url, "_blank", "noopener")
                  }
                  tabIndex={Math.abs(offset) === 1 ? 0 : -1}
                  // the active slide without a url does nothing on click
                  data-no-hover={offset || p.url ? undefined : ""}
                  aria-hidden={far}
                  aria-label={
                    offset
                      ? `${en ? "View project" : "Lihat proyek"} ${p.title}`
                      : p.url
                        ? `${en ? "Visit" : "Kunjungi"} ${p.title}`
                        : p.title
                  }
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
                    src={p.image.url}
                    width={p.image.width}
                    height={p.image.height}
                    alt=""
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    loading="eager"
                    placeholder="blur"
                    blurDataURL={p.image.lqip}
                    className="block size-full transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ opacity: offset ? 0 : 1 }}
                  />
                  <Image
                    src={p.image.url}
                    width={p.image.width}
                    height={p.image.height}
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
            {project.description[en ? "en" : "id"]}
          </p>
        </div>
      </div>
    </section>
  );
}

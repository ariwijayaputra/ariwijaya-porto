"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

const MIN_MS = 1000;

// Runs cb once the splash is gone (right away if it already is). Returns the cleanup.
export function onSplashDone(cb: () => void) {
  if (!document.querySelector("[data-splash]")) {
    cb();
    return () => {};
  }
  addEventListener("splash:reveal", cb, { once: true });
  return () => removeEventListener("splash:reveal", cb);
}

// The site's reveal, like --animate-reveal in globals.css: fade in out of the work slider's blur,
// floating up. The rise is a share of each element's own height, so a headline word travels
// further than a nav label and both read as the same motion
export function blurIn(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}, from: gsap.TweenVars = {}) {
  const probe = document.body.appendChild(document.createElement("div"));
  probe.style.width = "var(--work-blur)"; // resolves the token to px for GSAP
  const blur = probe.offsetWidth;
  probe.remove();
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, filter: `blur(${blur}px)`, yPercent: 40, ...from },
    {
      autoAlpha: 1,
      filter: "blur(0px)",
      yPercent: 0,
      duration: 1.6,
      ease: "power3.out",
      clearProps: "opacity,visibility,filter,transform",
      ...vars,
    },
  );
}

// Hides a reveal straight away and plays it once the splash is gone. `build` runs after the fonts
// load (so SplitText breaks lines where the final text will) and returns the timeline; split()
// tracks each SplitText so the plain text comes back when it ends. Everything reverts on cleanup,
// and nothing runs for reduced motion or while `enabled` is false.
export function useReveal(
  build: (split: (target: gsap.DOMTarget, vars: SplitText.Vars) => SplitText) => gsap.core.Timeline,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const splits: SplitText[] = [];
    const revert = () => splits.forEach((s) => s.revert());
    let tl: gsap.core.Timeline | undefined;
    let off = () => {};
    let dead = false;

    const make = () => {
      tl?.revert();
      revert();
      splits.length = 0;
      tl = build((target, vars) => {
        const s = SplitText.create(target, vars);
        splits.push(s);
        return s;
      });
      tl.pause().eventCallback("onComplete", revert);
    };

    document.fonts.ready.then(() => {
      if (dead) return;
      make(); // hidden from now on, under the splash
      // built again right before playing: lines split under the splash were measured without the
      // scrollbar it hides, so they'd wrap once it's back. Same task, so nothing flashes
      off = onSplashDone(() => {
        make();
        tl!.play();
      });
    });

    return () => {
      dead = true;
      off();
      tl?.revert();
      revert();
    };
    // build only reads refs, so the first render's closure is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

// Real progress: the fonts plus every <img> in the page (the work screenshots load eagerly so
// they count). The number never runs ahead of MIN_MS, so a cached visit still counts up for a
// second. At 100% an ink circle grows from the centre into the site, then the splash unmounts.
// While it's mounted, globals.css locks scrolling and components/snap-scroll.tsx won't page.
export default function Splash() {
  const text = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLParagraphElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const imgs = [...document.images];
    const pending = imgs.filter((img) => !img.complete);
    const total = imgs.length + 1;
    let loaded = imgs.length - pending.length;
    const tick = () => loaded++;
    document.fonts.ready.then(tick);
    for (const img of pending) {
      img.addEventListener("load", tick, { signal: ac.signal });
      img.addEventListener("error", tick, { signal: ac.signal });
    }

    let tl: gsap.core.Timeline | undefined;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let shown = 0;

    const update = () => {
      const target = Math.min(loaded / total, (performance.now() - start) / MIN_MS, 1);
      shown += (target - shown) * (1 - Math.pow(0.8, gsap.ticker.deltaRatio()));
      if (target === 1 && shown > 0.995) shown = 1;
      count.current!.textContent = `${Math.round(shown * 100)}%`;
      if (shown < 1) return;

      gsap.ticker.remove(update);
      if (reduce) return setDone(true);
      tl = gsap
        .timeline({ onComplete: () => setDone(true) })
        .to(text.current, { autoAlpha: 0, duration: 0.3, ease: "power2.out" })
        .to(
          circle.current,
          // 75% of the clip-path reference box reaches past the corners.
          // expo: holds small for a beat, rushes out, then settles softly on the edges
          { clipPath: "circle(75% at 50% 50%)", duration: 1.4, ease: "expo.inOut" },
          "<0.1",
        );
    };
    gsap.ticker.add(update);

    return () => {
      ac.abort();
      gsap.ticker.remove(update);
      tl?.kill();
    };
  }, []);

  // reveals (useReveal) start once the splash has unmounted: the site only shows then, and the
  // scrollbar the splash hid is back, so SplitText measures the final line widths
  useEffect(() => {
    if (done) dispatchEvent(new Event("splash:reveal"));
  }, [done]);

  if (done) return null;

  return (
    <div data-splash aria-hidden className="fixed inset-0 z-40 bg-white text-black">
      <div
        ref={text}
        className="grid h-full place-content-center justify-items-center gap-5 font-display leading-none uppercase"
      >
        <p className="text-[length:max(1.5rem,calc(var(--vw)*2.5))]">Loading...</p>
        <p ref={count} className="text-[length:max(2.5rem,calc(var(--vw)*5))]">
          0%
        </p>
      </div>
      <div
        ref={circle}
        className="absolute inset-0 bg-ink"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />
      <noscript>
        <style>{"[data-splash]{display:none}"}</style>
      </noscript>
    </div>
  );
}

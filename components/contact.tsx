"use client";

import gsap from "gsap";
import { useRef } from "react";
import { tabs, useActiveSection } from "@/components/bottombar";
import { useLang } from "@/components/lang";
import { blurIn, useReveal } from "@/components/splash";

const links = [
  {
    label: "ariwijayaputra",
    href: "https://instagram.com/ariwijayaputra",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  {
    label: "aryanathaa@gmail.com",
    href: "mailto:aryanathaa@gmail.com",
    icon: <path d="M2.5 5h19v14h-19zm0 0 9.5 8 9.5-8" />,
  },
  {
    label: "+628516424407",
    href: "tel:+628516424407",
    icon: (
      <path d="M21.5 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.6 4.2 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.5 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    ),
  },
];

const nav = [
  { id: "home", label: "Home", en: "Home" },
  { id: "work", label: "Proyek", en: "Project" },
  { id: "contact", label: "Kontak", en: "Contact" },
];

// mobile stacks headline / text / form / links / copyright (rows placed explicitly, the
// left column is display:contents there); desktop puts text + links left, form right
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const active = tabs[useActiveSection()].id === "contact";
  const en = useLang() === "en";

  // replays on every visit (leaving already fades the section out, see main > section[data-away]):
  // headline word by word, intro line by line, then the form, links and footer
  useReveal((split) => {
    const el = root.current!;
    const words = split(el.querySelector("h2")!, { type: "words" });
    const lines = split(el.querySelector("p")!, { type: "lines" });
    return gsap
      .timeline()
      .add(blurIn(words.words, { duration: 1.8, stagger: 0.12 }))
      .add(blurIn(lines.lines, { stagger: 0.12 }), "<0.5")
      .add(blurIn(el.querySelector("form"), {}, { yPercent: 10 }), "<0.2") // a tall panel rises less
      .add(blurIn(el.querySelectorAll("address a"), { stagger: 0.1 }), "<0.3")
      .add(blurIn(el.querySelectorAll("footer a, footer p"), { stagger: 0.1 }), "<0.3");
  }, active);

  return (
    <section
      ref={root}
      id="contact"
      data-snap
      className="page-grid min-h-(--section-h) grid-rows-[auto_auto_1fr_auto_auto] pt-9 pb-5 text-body lg:grid-rows-[auto_1fr_auto] lg:pt-14 lg:pb-6"
    >
      {/* keyed by language: a switch mid-reveal swaps in fresh nodes instead of fighting SplitText */}
      <h2 key={`h${en}`} className="col-span-full font-display text-display uppercase lg:text-right">
        {en ? "Let’s collaborate" : "Mari kolaborasi"}
      </h2>

      <div className="contents lg:col-span-5 lg:row-start-2 lg:mt-10 lg:flex lg:flex-col lg:justify-between lg:py-5">
        <p key={`p${en}`} className="col-span-full row-start-2 mt-10 lg:mt-0">
          {en
            ? "Have an idea, a project, or a problem you’d like to solve? Let’s talk about it. I’m always open to new opportunities, interesting collaborations, and building something meaningful together."
            : "Punya ide, proyek, atau masalah yang ingin dipecahkan? Mari kita bicarakan. Saya selalu terbuka untuk peluang baru, kolaborasi yang menarik, dan membangun sesuatu yang bermakna bersama."}
        </p>

        <address className="col-span-full row-start-4 mt-10 flex flex-col items-start gap-5 text-link text-dim not-italic lg:gap-6 lg:text-paper">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[1em] shrink-0"
              >
                {l.icon}
              </svg>
              <span className="underline decoration-1 underline-offset-4">{l.label}</span>
            </a>
          ))}
        </address>
      </div>

      {/* ponytail: native mailto form, no backend; swap for an API route if a mail client isn't enough.
          Browsers form-encode GET mailto (spaces -> "+"), so build the URL with encodeURIComponent (%20).
          action/method stay as the no-JS fallback. */}
      <form
        action="mailto:aryanathaa@gmail.com"
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const q = ["subject", "body"].map((k) => `${k}=${encodeURIComponent(String(data.get(k)))}`).join("&");
          window.location.href = `mailto:aryanathaa@gmail.com?${q}`;
        }}
        className="col-span-full row-start-3 -mr-(--margin) mt-10 flex flex-col gap-5 bg-panel px-(--contact-pad) py-8 text-nav lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:py-16"
      >
        <input type="hidden" name="subject" value={en ? "Collaboration" : "Kolaborasi"} />
        <textarea
          name="body"
          required
          aria-label={en ? "Message" : "Pesan"}
          placeholder={en ? "Type a message for me" : "Ketik pesan untuk saya"}
          className="min-h-10 flex-1 resize-none bg-transparent text-white caret-white outline-none placeholder:text-mute"
        />
        <button
          type="submit"
          className="h-10 self-start bg-white px-3 text-ink transition-colors hover:bg-paper"
        >
          {en ? "Send Message" : "Kirim Pesan"}
        </button>
      </form>

      <footer className="col-span-full row-start-5 mt-5 grid grid-cols-subgrid items-baseline lg:row-start-3 lg:mt-16">
        {/* mobile has the bottom bar instead */}
        <nav aria-label={en ? "Footer navigation" : "Navigasi footer"} className="hidden gap-4 text-link uppercase lg:col-span-4 lg:flex">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="transition-colors hover:text-white">
              {en ? n.en : n.label}
            </a>
          ))}
        </nav>
        <p className="col-span-full text-mute lg:col-span-4 lg:col-start-9 lg:text-right lg:text-paper">
          Copyright 2026 By Ari Wijaya Putra
        </p>
      </footer>
    </section>
  );
}

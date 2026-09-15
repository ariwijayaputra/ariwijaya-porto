"use client";

import { tabs, useActiveSection } from "@/components/bottombar";

export default function Navbar() {
  const active = useActiveSection();

  return (
    <header className="sticky top-0 z-10 bg-ink">
      <nav className="page-grid h-(--nav-h) text-nav">
        <div className="col-span-full grid grid-cols-subgrid items-center border-b border-line">
          <ul className="hidden gap-10 font-light lg:col-span-4 lg:flex">
            {tabs.map((t, i) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={i === active ? "location" : undefined}
                  className={`flex items-center gap-2 transition-colors duration-300 hover:text-white ${i === active ? "text-white" : "text-mute"}`}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinejoin="round"
                    className="size-[1.333em]"
                  >
                    {t.icon}
                  </svg>
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="col-span-3 font-display text-white uppercase lg:col-span-4 lg:text-center">
            Ari Wijaya Putra
          </p>
          {/* ponytail: static label, wire up when i18n lands */}
          <p className="col-span-3 flex items-center justify-self-end gap-2 text-mute lg:col-span-4">
            ID
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
          </p>
        </div>
      </nav>
    </header>
  );
}

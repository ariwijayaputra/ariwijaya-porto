import { useEffect, useSyncExternalStore } from "react";

export type Lang = "id" | "en";

// <html lang> is the source of truth, so the attribute and the copy can't drift apart.
const STORAGE_KEY = "lang";
const subs = new Set<() => void>();
let detected = false;

function detectLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "id" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("id") ? "id" : "en";
}

export function toggleLang() {
  const html = document.documentElement;
  const next: Lang = html.lang === "en" ? "id" : "en";
  html.lang = next;
  localStorage.setItem(STORAGE_KEY, next);
  subs.forEach((f) => f());
}

export function useLang() {
  // ponytail: runs once across all callers via the module-level flag, no dedicated top-level init component
  useEffect(() => {
    if (detected) return;
    detected = true;
    const lang = detectLang();
    if (lang !== document.documentElement.lang) {
      document.documentElement.lang = lang;
      subs.forEach((f) => f());
    }
  }, []);

  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => document.documentElement.lang as Lang,
    (): Lang => "id",
  );
}

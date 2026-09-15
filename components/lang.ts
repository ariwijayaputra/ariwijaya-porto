import { useSyncExternalStore } from "react";

export type Lang = "id" | "en";

// <html lang> is the source of truth, so the attribute and the copy can't drift apart.
// ponytail: not persisted, add localStorage when a remembered choice matters
const subs = new Set<() => void>();

export function toggleLang() {
  const html = document.documentElement;
  html.lang = html.lang === "en" ? "id" : "en";
  subs.forEach((f) => f());
}

export function useLang() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => document.documentElement.lang as Lang,
    (): Lang => "id",
  );
}

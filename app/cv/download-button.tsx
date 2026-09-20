"use client";

export function DownloadButton({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="cv-download-btn"
      onClick={() => window.print()}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}

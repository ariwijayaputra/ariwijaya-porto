"use client";

export function DownloadButton() {
  return (
    <button
      type="button"
      className="cv-download-btn"
      onClick={() => window.print()}
      aria-label="Download CV as PDF"
    >
      Download PDF
    </button>
  );
}

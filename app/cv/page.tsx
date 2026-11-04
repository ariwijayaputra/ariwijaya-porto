import { defineQuery, PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { DownloadButton } from "./download-button";
import "./cv.css";

export const revalidate = 60;

type Lang = "id" | "en";
type Loc = Record<Lang, string>;
type LocList = Record<Lang, string[]>;

type Site = { _key: string; url: string; stack: string };
type Job = { _key: string; company: string; role: Loc; dateRange: Loc; bullets: LocList };
type Education = { _key: string; school: string; degree: Loc; dateRange: Loc; bullets: LocList };
type Certification = { _key: string; title: string; url: string | null; issuer: string; credential: string | null; year: string };
type Achievement = { _key: string; title: Loc; url: string | null; subtitle: Loc; year: string };

type Cv = {
  name: string;
  role: Loc;
  location: string;
  phone: string;
  email: string;
  portfolioUrl: string;
  summary: Loc;
  summaryRich?: Partial<Record<Lang, PortableTextBlock[]>>;
  liveWebsites: Site[];
  experience: Job[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
};

const summaryComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
  },
};

function Summary({ blocks, fallback, role }: {
  blocks?: PortableTextBlock[];
  fallback?: string;
  role: string;
}) {
  if (!blocks?.length) return <p>{fallback?.replaceAll("{role}", role)}</p>;

  const value = blocks.map((block) => ({
    ...block,
    children: block.children.map((span) => ({
      ...span,
      text: span.text.replaceAll("{role}", role),
    })),
  }));

  return <div className="cv-summary"><PortableText value={value} components={summaryComponents} /></div>;
}

const CV_QUERY = defineQuery(`*[_type == "cv"][0]{
  name, role, location, phone, email, portfolioUrl, summary, summaryRich,
  liveWebsites, experience, education, certifications, achievements
}`);

// Indonesian is the default; ?lang=en serves the English CV.
const LABELS = {
  id: {
    summary: "Ringkasan",
    sites: "Situs Langsung",
    experience: "Pengalaman",
    education: "Pendidikan",
    certification: "Sertifikasi",
    achievement: "Penghargaan",
    credential: "Kredensial",
    portfolio: "portofolio",
    download: "Unduh PDF",
    downloadAria: "Unduh CV sebagai PDF",
  },
  en: {
    summary: "Summary",
    sites: "Live Websites",
    experience: "Experience",
    education: "Education",
    certification: "Certification",
    achievement: "Achievement",
    credential: "Credential",
    portfolio: "portfolio",
    download: "Download PDF",
    downloadAria: "Download CV as PDF",
  },
} satisfies Record<Lang, Record<string, string>>;

function readParams(q: Awaited<PageProps<"/cv">["searchParams"]>) {
  const lang: Lang = q.lang === "en" ? "en" : "id";
  const role = Array.isArray(q.role) ? q.role[0] : q.role;
  return { lang, role: role?.trim() || null };
}

function portfolioLabel(url: string) {
  return url.replace(/^https?:\/\//, "");
}

// The printed PDF takes its filename from the document title, so the shared
// ?role= link downloads as e.g. "CV - Ari Wijaya Putra - Web Developer".
export async function generateMetadata(props: PageProps<"/cv">): Promise<Metadata> {
  const { lang, role } = readParams(await props.searchParams);
  const cv = await client.fetch<Cv | null>(CV_QUERY);
  const title = ["CV", cv?.name ?? "Ari Wijaya Putra", role ?? cv?.role[lang]].filter(Boolean).join(" - ");
  return { title };
}

export default async function CvPage(props: PageProps<"/cv">) {
  const { lang, role } = readParams(await props.searchParams);
  const cv = await client.fetch<Cv | null>(CV_QUERY);
  if (!cv) notFound();

  const t = LABELS[lang];
  // one role, two places: the headline and the {role} placeholder in the summary
  const headlineRole = role ?? cv.role[lang];
  const contact = (
    <div className="contact">
      <span>{cv.location}</span>
      <span>{cv.phone}</span>
      <span>{cv.email}</span>
      <span>
        {t.portfolio}: <a href={cv.portfolioUrl}>{portfolioLabel(cv.portfolioUrl)}</a>
      </span>
    </div>
  );

  return (
    <div className="cv-doc" lang={lang}>
      <DownloadButton label={t.download} ariaLabel={t.downloadAria} />
      <div className="page">
        <header>
          <h1>{cv.name}</h1>
          <div className="role">{headlineRole}</div>
          {contact}
        </header>

        <main>
          <section>
            <h2>{t.summary}</h2>
            <Summary blocks={cv.summaryRich?.[lang]} fallback={cv.summary?.[lang]} role={headlineRole} />
          </section>

          {cv.liveWebsites.length > 0 && (
            <section>
              <h2>{t.sites}</h2>
              <ul className="sites">
                {cv.liveWebsites.map((s) => (
                  <li key={s._key}>
                    <a href={s.url}>{s.url}</a>
                    <span>{s.stack}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cv.experience.length > 0 && (
            <section>
              <h2>{t.experience}</h2>
              {cv.experience.map((job) => (
                <div className="entry" key={job._key}>
                  <div className="entry-head">
                    <span className="title">{job.company}</span>
                    <span className="date">{job.dateRange[lang]}</span>
                  </div>
                  <div className="sub">{job.role[lang]}</div>
                  <ul className="bullets">
                    {job.bullets[lang].map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {cv.education.length > 0 && (
            <section>
              <h2>{t.education}</h2>
              {cv.education.map((edu) => (
                <div className="entry" key={edu._key}>
                  <div className="entry-head">
                    <span className="title">{edu.school}</span>
                    <span className="date">{edu.dateRange[lang]}</span>
                  </div>
                  <div className="sub">{edu.degree[lang]}</div>
                  <ul className="bullets">
                    {edu.bullets[lang].map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {cv.certifications.length > 0 && (
            <section>
              <h2>{t.certification}</h2>
              {cv.certifications.map((c) => (
                <div className="entry" key={c._key}>
                  <div className="entry-head">
                    {c.url ? (
                      <a className="title" href={c.url}>
                        {c.title}
                      </a>
                    ) : (
                      <span className="title">{c.title}</span>
                    )}
                    <span className="date">{c.year}</span>
                  </div>
                  <div className="sub">
                    {c.issuer}
                    {c.credential && ` | ${t.credential}: ${c.credential}`}
                  </div>
                </div>
              ))}
            </section>
          )}

          {cv.achievements.length > 0 && (
            <section className="last">
              <h2>{t.achievement}</h2>
              {cv.achievements.map((a) => (
                <div className="entry" key={a._key}>
                  <div className="entry-head">
                    {a.url ? (
                      <a className="title" href={a.url}>
                        {a.title[lang]}
                      </a>
                    ) : (
                      <span className="title">{a.title[lang]}</span>
                    )}
                    <span className="date">{a.year}</span>
                  </div>
                  <div className="sub">{a.subtitle[lang]}</div>
                </div>
              ))}
            </section>
          )}
        </main>

        <footer>
          <div className="contact">
            <span>{cv.phone}</span>
            <span>{cv.email}</span>
            <span>
              {t.portfolio}: <a href={cv.portfolioUrl}>{portfolioLabel(cv.portfolioUrl)}</a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

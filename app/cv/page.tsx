import { defineQuery } from "next-sanity";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import "./cv.css";

export const revalidate = 60;

type Site = { url: string; stack: string };
type Job = { company: string; role: string; dateRange: string; bullets: string[] };
type Education = { school: string; degree: string; dateRange: string; bullets: string[] };
type Certification = { title: string; url: string | null; issuer: string; credential: string | null; year: string };
type Achievement = { title: string; url: string | null; subtitle: string; year: string };

type Cv = {
  name: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  portfolioUrl: string;
  summary: string;
  liveWebsites: Site[];
  experience: Job[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
};

const CV_QUERY = defineQuery(`*[_type == "cv"][0]{
  name, role, location, phone, email, portfolioUrl, summary,
  liveWebsites, experience, education, certifications, achievements
}`);

export const metadata: Metadata = {
  title: "CV — Ari Wijaya Putra",
};

function portfolioLabel(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export default async function CvPage() {
  const cv = await client.fetch<Cv | null>(CV_QUERY);
  if (!cv) notFound();

  return (
    <div className="cv-doc">
      <div className="page">
        <header>
          <h1>{cv.name}</h1>
          <div className="role">{cv.role}</div>
          <div className="contact">
            <span>{cv.location}</span>
            <span>{cv.phone}</span>
            <span>{cv.email}</span>
            <span>
              portfolio: <a href={cv.portfolioUrl}>{portfolioLabel(cv.portfolioUrl)}</a>
            </span>
          </div>
        </header>

        <main>
          <section>
            <h2>Summary</h2>
            <p>{cv.summary}</p>
          </section>

          {cv.liveWebsites.length > 0 && (
            <section>
              <h2>Live Websites</h2>
              <ul className="sites">
                {cv.liveWebsites.map((s) => (
                  <li key={s.url}>
                    <a href={s.url}>{s.url}</a>
                    <span>{s.stack}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cv.experience.length > 0 && (
            <section>
              <h2>Experience</h2>
              {cv.experience.map((job) => (
                <div className="entry" key={`${job.company}-${job.dateRange}`}>
                  <div className="entry-head">
                    <span className="title">{job.company}</span>
                    <span className="date">{job.dateRange}</span>
                  </div>
                  <div className="sub">{job.role}</div>
                  <ul className="bullets">
                    {job.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {cv.education.length > 0 && (
            <section>
              <h2>Education</h2>
              {cv.education.map((edu) => (
                <div className="entry" key={`${edu.school}-${edu.dateRange}`}>
                  <div className="entry-head">
                    <span className="title">{edu.school}</span>
                    <span className="date">{edu.dateRange}</span>
                  </div>
                  <div className="sub">{edu.degree}</div>
                  <ul className="bullets">
                    {edu.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {cv.certifications.length > 0 && (
            <section>
              <h2>Certification</h2>
              {cv.certifications.map((c) => (
                <div className="entry" key={`${c.title}-${c.year}`}>
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
                    {c.credential && ` | Credential: ${c.credential}`}
                  </div>
                </div>
              ))}
            </section>
          )}

          {cv.achievements.length > 0 && (
            <section className="last">
              <h2>Achievement</h2>
              {cv.achievements.map((a) => (
                <div className="entry" key={`${a.title}-${a.year}`}>
                  <div className="entry-head">
                    {a.url ? (
                      <a className="title" href={a.url}>
                        {a.title}
                      </a>
                    ) : (
                      <span className="title">{a.title}</span>
                    )}
                    <span className="date">{a.year}</span>
                  </div>
                  <div className="sub">{a.subtitle}</div>
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
              portfolio: <a href={cv.portfolioUrl}>{portfolioLabel(cv.portfolioUrl)}</a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

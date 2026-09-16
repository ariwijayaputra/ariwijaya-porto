import Bottombar from "@/components/bottombar";
import Contact from "@/components/contact";
import Cursor from "@/components/cursor";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import SnapScroll from "@/components/snap-scroll";
import Splash from "@/components/splash";
import Work, { type Project } from "@/components/work";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

// ponytail: time-based ISR, swap for a Sanity webhook + revalidateTag if edits must show instantly
export const revalidate = 60;

const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(order asc) {
  _id,
  title,
  description,
  url,
  "image": image.asset->{ url, "lqip": metadata.lqip, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
}`);

export default async function Home() {
  const projects = await client.fetch<Project[]>(PROJECTS_QUERY);

  return (
    <>
      <Navbar />
      <SnapScroll />
      <main className="@container overflow-clip">
        <Hero />

        {projects.length > 0 && <Work projects={projects} />}
        <Contact />
      </main>
      <Bottombar />
      <Cursor />
      <Splash />
    </>
  );
}

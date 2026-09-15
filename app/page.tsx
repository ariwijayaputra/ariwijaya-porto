import Bottombar from "@/components/bottombar";
import Contact from "@/components/contact";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import SnapScroll from "@/components/snap-scroll";
import Work from "@/components/work";

export default function Home() {
  return (
    <>
      <Navbar />
      <SnapScroll />
      <main className="@container overflow-clip">
        <Hero />

        <Work />
        <Contact />
      </main>
      <Bottombar />
    </>
  );
}

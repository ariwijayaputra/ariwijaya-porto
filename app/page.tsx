import Bottombar from "@/components/bottombar";
import Navbar from "@/components/navbar";
import SnapScroll from "@/components/snap-scroll";
import Work from "@/components/work";

export default function Home() {
  return (
    <>
      <Navbar />
      <SnapScroll />
      <main className="@container overflow-clip">
        <section id="home" data-snap className="page-grid relative min-h-(--section-h) grid-rows-[auto_1fr] pt-9 pb-5 text-body lg:pt-14 lg:pb-6">
          {/* touch devices get a static glow; mouse users get it on the cursor */}
          <div
            aria-hidden
            className="glow top-1/2 right-0 size-[150vw] translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
          />

          {/* mobile lets the first two lines flow (UBAH IDE / RUMIT JADI / PENGALAMAN) */}
          <h1 className="relative col-span-full font-display text-display uppercase">
            <span className="lg:block">Ubah ide rumit</span>{" "}
            <span className="lg:block">jadi pengalaman</span>
            <span className="block text-right">berkesan</span>
          </h1>

          <div className="relative col-span-full grid grid-cols-subgrid self-end">
            <p className="col-span-4 self-end lg:max-w-[32ch]">
              <span className="text-dim">
                Saya adalah software engineer yang senang mengubah ide kompleks
                menjadi pengalaman yang sederhana.
              </span>{" "}
              Saya mampu mengerjakan berbagai hal, mulai dari merancang
              antarmuka hingga membangun sistem di baliknya, dengan memadukan
              desain yang matang, teknologi yang tepat, dan kode yang bersih.
            </p>

            <p className="hidden lg:col-span-4 lg:col-start-9 lg:block lg:self-end lg:text-right">
              Copyright 2026 By Ari Wijaya Putra
            </p>
          </div>
        </section>

        <Work />
      </main>
      <Bottombar />
    </>
  );
}

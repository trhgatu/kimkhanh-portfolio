import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Marquee } from "@/components/sections/Marquee";
import { Contact } from "@/components/sections/Contact";
import { HeroAboutDivider } from "@/components/animation/HeroAboutDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroAboutDivider />

      <div
        id="content-stack"
        className="relative z-10 bg-[var(--color-blush)]"
      >
        <div className="relative z-0 flex min-h-svh items-center bg-[var(--color-blush)] lg:sticky lg:top-0">
          <div className="relative z-10 w-full">
            <About />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none hidden h-[45svh] lg:block"
        />

        <Projects />
      </div>

      <Marquee />
      <Contact />
    </>
  );
}

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Marquee } from "@/components/sections/Marquee";
import { Contact } from "@/components/sections/Contact";
import { HeroAboutDivider } from "@/components/animation/HeroAboutDivider";
import { AboutFrame } from "@/components/animation/AboutFrame";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroAboutDivider />

      <div
        id="content-stack"
        className="relative z-10 bg-[var(--color-blush)]"
      >
        <div className="sticky top-0 z-0 flex min-h-svh items-center bg-[var(--color-blush)]">
          <AboutFrame />
          <div className="relative z-10 w-full">
            <About />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none h-[45svh]"
        />

        <Projects />
      </div>

      <Marquee />
      <Contact />
    </>
  );
}

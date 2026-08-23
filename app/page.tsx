import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Marquee } from "@/components/sections/Marquee";
import { Contact } from "@/components/sections/Contact";
import { BotanicalVine } from "@/components/flowers/BotanicalVine";
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
        <div className="sticky top-0 z-0 flex min-h-svh items-center overflow-hidden bg-[var(--color-blush)]">
          <div className="relative z-10 w-full">
            <BotanicalVine className="hidden sm:block" />
            <About />
          </div>
        </div>

        <Projects />
      </div>

      <Marquee />
      <Contact />
    </>
  );
}

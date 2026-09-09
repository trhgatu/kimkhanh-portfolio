import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Notes } from "@/components/sections/Notes";
import { Contact } from "@/components/sections/Contact";
import { HeroAboutDivider } from "@/components/animation/HeroAboutDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <HeroAboutDivider />

      <div
        id="content-stack"
        className="relative z-10 bg-[var(--color-paper)]"
      >
        <About />
        <Projects />
      </div>

      <Notes />
      <Contact />
    </>
  );
}

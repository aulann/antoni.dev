import { TopBar } from "@/components/navigation/top-bar";
import { HeroScroll } from "@/components/sections/hero-scroll";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Playground } from "@/components/sections/playground";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { EasterEggs } from "@/components/easter-eggs";

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="main" className="relative">
        <HeroScroll />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Process />
        <Playground />
        <Contact />
      </main>
      <Footer />
      <EasterEggs />
    </>
  );
}

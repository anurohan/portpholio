import Hero from "@/components/sections/Hero";
import StorySection from "@/components/sections/StorySection";
import FeedbackLoop from "@/components/sections/FeedbackLoop";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import GitHubSection from "@/components/sections/GitHubSection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { stories } from "@/content/stories";

export default function Page() {
  return (
    <>
      {/* Hero — the system wakes */}
      <Hero />

      {/* The narrative: Intelligence → Electronics → Robotics → Mechanics → Builder */}
      {stories.map((story) => (
        <StorySection key={story.id} story={story} />
      ))}

      {/* Signature: the closed control loop that ties it all together */}
      <FeedbackLoop />

      {/* The studio: real work + who I am */}
      <Projects />
      <About />
      <Skills />
      <GitHubSection />
      <Contact />
      <Footer />
    </>
  );
}

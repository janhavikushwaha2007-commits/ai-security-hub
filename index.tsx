import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/mesh/Navbar";
import { Hero } from "@/components/mesh/Hero";
import { SecurityModules } from "@/components/mesh/SecurityModules";
import { HowItWorks } from "@/components/mesh/HowItWorks";
import { WhyMesh } from "@/components/mesh/WhyMesh";
import { ArchitecturePreview } from "@/components/mesh/ArchitecturePreview";
import { FinalCta } from "@/components/mesh/FinalCta";
import { Footer } from "@/components/mesh/Footer";

const title = "AI Security Mesh — Your Intelligent Digital Security Layer";
const description =
  "AI Security Mesh helps you analyse suspicious messages, links, websites, files, and passwords, then turns the signals into clear security guidance.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SecurityModules />
        <HowItWorks />
        <WhyMesh />
        <ArchitecturePreview />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

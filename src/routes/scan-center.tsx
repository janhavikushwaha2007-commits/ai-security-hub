import { createFileRoute } from "@tanstack/react-router";
import { ScanCenterHeader } from "@/components/scan-center/ScanCenterHeader";
import { ScanCenterGrid } from "@/components/scan-center/ScanCenterGrid";
import { ScanCenterGuidance } from "@/components/scan-center/ScanCenterGuidance";
import { Footer } from "@/components/mesh/Footer";

const title = "Scan Center — AI Security Mesh";
const description =
  "Centralized scan hub for AI Security Mesh. Open frontend previews of the message, URL, website, screenshot, file, and password scanners.";

export const Route = createFileRoute("/scan-center")({
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
  component: ScanCenterPage,
});

function ScanCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <ScanCenterHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-16 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Scan Center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              One place to access every AI Security Mesh scanner. Select a module below to run a
              frontend demo analysis — no backend or external service is connected yet.
            </p>
          </div>

          <ScanCenterGrid />
          <ScanCenterGuidance />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AssistantHeader } from "@/components/security-assistant/AssistantHeader";
import { AssistantChat } from "@/components/security-assistant/AssistantChat";
import { Footer } from "@/components/mesh/Footer";

const title = "Security Assistant — AI Security Mesh";
const description =
  "Ask everyday security questions and get rule-based educational answers about phishing, suspicious URLs, password safety, and malicious files. Frontend demo assistant only.";

export const Route = createFileRoute("/security-assistant")({
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
  component: SecurityAssistantPage,
});

function SecurityAssistantPage() {
  return (
    <div className="min-h-screen bg-background">
      <AssistantHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold sm:text-4xl">Security Assistant</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A demo assistant that answers common security questions with fixed, rule-based
              educational guidance. It is not a connected AI model — answers are matched from a
              built-in set of topics, and the conversation stays on this page only.
            </p>
          </div>
          <AssistantChat />
        </div>
      </main>
      <Footer />
    </div>
  );
}

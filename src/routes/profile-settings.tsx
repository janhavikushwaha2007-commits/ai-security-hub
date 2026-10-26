import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { ProfileSettingsHeader } from "@/components/profile-settings/ProfileSettingsHeader";
import { ProfileDetailsForm } from "@/components/profile-settings/ProfileDetailsForm";
import { PreferencesSection } from "@/components/profile-settings/PreferencesSection";
import { SecuritySettingsSection } from "@/components/profile-settings/SecuritySettingsSection";
import { demoProfile } from "@/components/profile-settings/profile-settings-data";
import { Footer } from "@/components/mesh/Footer";
import { MeshButton } from "@/components/mesh/MeshButton";

const title = "Profile & Settings — AI Security Mesh";
const description =
  "Preview the profile details, display and notification preferences, and security settings screens with clearly labelled demo data. Frontend preview only.";

export const Route = createFileRoute("/profile-settings")({
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
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!demoProfile.name || !demoProfile.email) {
          throw new Error("Sample data unavailable");
        }
        setError(null);
      } catch {
        setError("The demo profile could not be prepared. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ProfileSettingsHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Profile &amp; Settings</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Preview the account screens: profile details, display and notification preferences,
              and security settings. Everything on this page is demo data for interface preview
              only — nothing is saved to an account, and no password is ever requested or stored.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MeshButton variant="outline" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Dashboard
                </Link>
              </MeshButton>
            </div>
          </div>

          {error ? (
            <section className="surface-card flex flex-col items-center gap-3 p-10 text-center" role="alert">
              <span className="grid size-12 place-items-center rounded-xl border border-destructive/40 bg-destructive/10">
                <ShieldAlert className="size-6 text-destructive" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold">Settings unavailable</h2>
              <p className="max-w-md text-sm text-muted-foreground">{error}</p>
              <MeshButton variant="outline" onClick={() => window.location.reload()}>
                Try again
              </MeshButton>
            </section>
          ) : loading ? (
            <section className="surface-card flex flex-col items-center gap-4 p-12 text-center" aria-live="polite">
              <span className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Preparing the demo profile...</p>
            </section>
          ) : (
            <>
              <ProfileDetailsForm />
              <PreferencesSection />
              <SecuritySettingsSection />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

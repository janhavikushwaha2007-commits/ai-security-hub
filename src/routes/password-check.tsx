import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PasswordHeader } from "@/components/password/PasswordHeader";
import { PasswordForm } from "@/components/password/PasswordForm";
import { PasswordResult } from "@/components/password/PasswordResult";
import { PasswordEmpty } from "@/components/password/PasswordEmpty";
import { analyzePassword } from "@/components/password/password-data";

const title = "Password Strength Checker — AI Security Mesh";
const description =
  "Check password strength in real time with AI Security Mesh. Length, character variety, and common-password checks run entirely in your browser — nothing is stored or sent.";

export const Route = createFileRoute("/password-check")({
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
  component: PasswordCheckPage,
});

function PasswordCheckPage() {
  const [password, setPassword] = useState("");
  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="min-h-screen bg-background">
      <PasswordHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto w-full max-w-3xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Password Strength Checker</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Measure how resilient a password is against guessing and brute-force attacks. All
              analysis happens locally in your browser — no backend, no storage, no transmission.
            </p>
          </div>

          <PasswordForm
            password={password}
            onChange={setPassword}
            onClear={() => setPassword("")}
          />

          {password ? <PasswordResult analysis={analysis} /> : <PasswordEmpty />}
        </div>
      </main>
    </div>
  );
}

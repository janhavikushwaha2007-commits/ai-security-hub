import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PasswordHeader } from "@/components/password/PasswordHeader";
import { PasswordForm } from "@/components/password/PasswordForm";
import { PasswordResult } from "@/components/password/PasswordResult";
import { PasswordEmpty } from "@/components/password/PasswordEmpty";
import { analyzePassword } from "@/components/password/password-data";

const API_BASE = "http://localhost:8000";

const title = "Password Strength Checker — Live Entropy Analyzer | AI Security Mesh";
const description =
  "Check password strength in real time with AI Security Mesh FastAPI backend cryptographic entropy and crack-time estimation.";

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
  const [backendInfo, setBackendInfo] = useState<{
    entropy_bits?: number;
    crack_time_estimate?: string;
    risk_score?: number;
    reasons?: string[];
  } | null>(null);

  useEffect(() => {
    if (!password) {
      setBackendInfo(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/scan/password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          setBackendInfo({
            risk_score: json.data.risk_score,
            reasons: json.data.reasons,
            ...(json.data.details || {}),
          });
        }
      } catch {
        // Ignore aborted or offline calls gracefully
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [password]);

  const analysis = useMemo(() => {
    const base = analyzePassword(password);
    if (!backendInfo) return base;
    return {
      ...base,
      score: Math.max(0, 100 - (backendInfo.risk_score ?? 50)),
      crackTime: backendInfo.crack_time_estimate || base.crackTime,
      entropy: backendInfo.entropy_bits ?? base.entropy,
    };
  }, [password, backendInfo]);

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
              Real-time cryptographic entropy and brute-force resistance analysis powered by the AI
              Security Mesh FastAPI backend.
            </p>
          </div>

          <PasswordForm
            password={password}
            onChange={setPassword}
            onClear={() => setPassword("")}
          />

          {backendInfo && password ? (
            <div className="surface-card flex flex-wrap items-center justify-between gap-3 border-primary/30 px-4 py-3 text-xs sm:text-sm">
              <span>
                <strong>Live Backend Entropy:</strong> {backendInfo.entropy_bits} bits
              </span>
              <span>
                <strong>Estimated Crack Time:</strong> {backendInfo.crack_time_estimate}
              </span>
            </div>
          ) : null}

          {password ? <PasswordResult analysis={analysis} /> : <PasswordEmpty />}
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Footer } from "@/components/mesh/Footer";
import { Reveal } from "@/components/mesh/Reveal";
import { MeshButton } from "@/components/mesh/MeshButton";

const API_BASE = "http://localhost:8000";

const title = "Sign In / Register — AI Security Mesh";
const description =
  "Sign in or register for your AI Security Mesh account connected to the FastAPI security backend.";

export const Route = createFileRoute("/auth")({
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
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(mode === "signup" ? { name } : {}),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || "Authentication failed");
      }

      localStorage.setItem("asm_token", json.data.token);
      localStorage.setItem("asm_user", JSON.stringify(json.data.user));
      setSuccess(
        mode === "signup"
          ? "Account created! Redirecting to dashboard..."
          : "Signed in! Redirecting to dashboard..."
      );
      setTimeout(() => navigate({ to: "/dashboard" }), 700);
    } catch (err: any) {
      setError(err.message || "Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <main className="relative">
        <div
          aria-hidden="true"
          className="grid-mesh pointer-events-none absolute inset-x-0 top-0 h-80 opacity-30 [mask-image:linear-gradient(black,transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-accent shadow-[var(--shadow-soft)]">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Live Authentication · FastAPI + MongoDB
              </span>
              <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
                Access your security layer
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Create an account or sign in to access your AI Security Mesh workspace. Credentials
                are hashed with SHA-256 and verified through our live FastAPI authentication API.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <MeshButton variant="outline" asChild>
                  <Link to="/">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to Homepage
                  </Link>
                </MeshButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            <div className="surface-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="mb-5 flex gap-2 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                    mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                    mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Janhavi Kushwaha"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@securitymesh.ai"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium">Password</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}
                {success && <p className="text-xs text-emerald-500">{success}</p>}

                <MeshButton type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Please wait..."
                    : mode === "signup"
                      ? "Create Real Account"
                      : "Sign In"}
                </MeshButton>
              </form>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}

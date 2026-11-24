import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/live-scan")({
  component: LiveScan,
});

const API = "http://localhost:8000";

type Result = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
  mode: string;
};

function LiveScan() {
  const [kind, setKind] = useState<"url" | "message">("url");
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function scan() {
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError("Please enter something to scan.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/scan/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kind === "url" ? { url: text } : { message: text }),
      });
      if (!res.ok) throw new Error("Server error " + res.status);
      const json = await res.json();
      setResult(json.data);
    } catch (e) {
      setError("Backend not reachable. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  const color =
    result?.risk_level === "High"
      ? "#dc2626"
      : result?.risk_level === "Medium"
        ? "#d97706"
        : "#16a34a";

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>AI Security Mesh - Live Scan</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Rule-based analysis. No AI model is connected.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setKind("url")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #888",
            background: kind === "url" ? "#111" : "#fff",
            color: kind === "url" ? "#fff" : "#111",
          }}
        >
          URL Scan
        </button>
        <button
          onClick={() => setKind("message")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #888",
            background: kind === "message" ? "#111" : "#fff",
            color: kind === "message" ? "#fff" : "#111",
          }}
        >
          Message Scan
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={kind === "url" ? "Paste a link here..." : "Paste the SMS / message here..."}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #888" }}
      />

      <button
        onClick={scan}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 24px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
        }}
      >
        {loading ? "Scanning..." : "Scan Now"}
      </button>

      {error && <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: `2px solid ${color}` }}>
          <div style={{ fontSize: 22, fontWeight: 700, color }}>
            {result.risk_level} Risk ({result.risk_score}/100)
          </div>
          <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>{result.mode}</p>
        </div>
      )}
    </div>
  );
}
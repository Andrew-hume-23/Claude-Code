import { ArrowUpRight } from "lucide-react";
import { C } from "../tokens";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const endpoints = [
  { method: "POST", path: "/v1/evaluations", desc: "Launch an evaluation against one or more models." },
  { method: "GET", path: "/v1/evaluations/{id}", desc: "Retrieve evaluation status and aggregate scores." },
  { method: "GET", path: "/v1/studies", desc: "List available eval modules with dimension and modality filters." },
  { method: "GET", path: "/v1/scenarios", desc: "List scenario packs; fetch prompts and `goodLooks` criteria." },
  { method: "POST", path: "/v1/studyrunner/jobs", desc: "Submit a human rating job to the calibrated rater pool." },
  { method: "POST", path: "/v1/switchboard/compare", desc: "Run head-to-head model comparison with paired preference signal." },
];

const snippet = `import { Hume } from "@humeai/voice-eq";

const hume = new Hume({ apiKey: process.env.HUME_KEY });

const evaluation = await hume.evaluations.create({
  model: { vendor: "elevenlabs", id: "eleven_v3" },
  studies: ["empathic_response", "naturalness_mos"],
  scenarios: ["healthcare_triage", "frustration_recovery"],
  modality: "s2s",
  rater_pool: { min_raters: 40, languages: ["en-US", "es-MX"] },
});

await hume.evaluations.wait(evaluation.id);
const scores = await hume.evaluations.scores(evaluation.id);

console.log(scores.dimensions);
// { reliability: 91, expressivity: 87, eq: 93 }`;

export default function API() {
  return (
    <div>
      <SectionHeader
        eyebrow="Unified API"
        title="API & Integration"
        action={<Button icon={ArrowUpRight}>Full reference</Button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div style={{ background: C.black, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "ui-monospace, monospace" }}>example.ts</div>
          </div>
          <pre style={{ margin: 0, padding: 20, fontSize: 12, lineHeight: 1.6, color: "#E8E8E8", fontFamily: "ui-monospace, monospace", overflow: "auto" }}>
            {snippet}
          </pre>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Endpoints</div>
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
            {endpoints.map((e, i) => (
              <div key={i} style={{ padding: "12px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "ui-monospace, monospace",
                    padding: "2px 6px",
                    borderRadius: 3,
                    background: e.method === "POST" ? "#F0E9FB" : C.lineSoft,
                    color: e.method === "POST" ? C.purpleDeep : C.gray,
                  }}>{e.method}</span>
                  <span style={{ fontSize: 12, fontFamily: "ui-monospace, monospace", color: C.black }}>{e.path}</span>
                </div>
                <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.5, paddingLeft: 2 }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

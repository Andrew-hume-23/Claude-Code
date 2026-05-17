import { Plus, Play } from "lucide-react";
import { C } from "../tokens";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const activeStudies = [
  { id: 1, name: "Empathic Response · Healthcare Triage", raters: 38, target: 50, languages: ["EN-US", "ES-MX"], progress: 76 },
  { id: 2, name: "Naturalness MOS · Audiobook Narration", raters: 52, target: 60, languages: ["EN-US", "EN-GB"], progress: 87 },
  { id: 3, name: "Tone Matching · Frustration Recovery", raters: 24, target: 40, languages: ["EN-US"], progress: 60 },
  { id: 4, name: "Inflection Authenticity · Cold Discovery", raters: 41, target: 45, languages: ["EN-US", "DE-DE", "FR-FR"], progress: 91 },
];

export default function StudyRunner({ open }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Human rating pipeline"
        title="StudyRunner"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={Play} onClick={() => open("rater")}>Preview rater task</Button>
            <Button primary icon={Plus}>Launch study</Button>
          </div>
        }
      />

      {/* pool stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Calibrated raters", value: "1,847" },
          { label: "Languages", value: "23" },
          { label: "Avg. inter-rater κ", value: "0.81" },
          { label: "Throughput · 24h", value: "12.4k" },
        ].map((s, i) => (
          <div key={i} style={{ background: i === 0 ? C.black : C.white, color: i === 0 ? C.white : C.black, border: i === 0 ? "none" : `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 11, color: i === 0 ? "rgba(255,255,255,0.6)" : C.gray, fontWeight: 500, marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 12 }}>Active studies</div>

      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {activeStudies.map((s, i) => (
          <div key={s.id} style={{ padding: "16px 20px", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{s.name}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {s.languages.map(l => (
                    <span key={l} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>{l}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.gray }}>
                  <span style={{ color: C.black, fontWeight: 700 }}>{s.raters}</span> / {s.target} raters
                </div>
              </div>
            </div>
            <div style={{ height: 6, background: C.lineSoft, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.progress}%`, background: C.purple }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

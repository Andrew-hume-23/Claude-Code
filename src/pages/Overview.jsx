import { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { C } from "../tokens";
import { RECENT_RUNS } from "../mock/runs";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import DimChip from "../ui/DimChip";
import ModalityChip from "../ui/ModalityChip";
import StatusPill from "../ui/StatusPill";

export default function Overview({ modality, open }) {
  const [hovStat, setHovStat] = useState(null);
  const filtered = modality === "all" ? RECENT_RUNS : RECENT_RUNS.filter(r => r.modality === modality);

  const stats = [
    { label: "Studies run · 7d", value: "248", delta: "+34" },
    { label: "Active rater pool", value: "1,847", delta: "+62" },
    { label: "Models tracked", value: "12", delta: "+2" },
    { label: "Languages covered", value: "23", delta: "—" },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Console"
        title="Overview"
        action={<Button primary icon={Plus}>New evaluation</Button>}
      />

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i}
            onMouseEnter={() => setHovStat(i)}
            onMouseLeave={() => setHovStat(null)}
            style={{ background: C.white, border: `1px solid ${hovStat === i ? C.black : C.line}`, borderRadius: 10, padding: 18, transition: "border-color .15s" }}>
            <div style={{ fontSize: 11, color: C.gray, fontWeight: 500, marginBottom: 10 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: s.delta.startsWith("+") ? C.green : C.gray, fontWeight: 600 }}>{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* dimension snapshot for primary model */}
      <div style={{ background: C.beige, borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Tracked model</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.black }}>Hume Octave · latest checkpoint</div>
          </div>
          <a onClick={() => open("checkpoints")} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: C.black, fontWeight: 600, cursor: "pointer" }}>
            View checkpoint history <ArrowUpRight size={13} />
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { dim: "Reliability", score: 92, sub: "P95 latency · WER · endpointing" },
            { dim: "Expressivity", score: 89, sub: "Prosody · MOS · naturalness" },
            { dim: "EQ", score: 94, sub: "Empathy · attunement · de-escalation" },
          ].map((d) => (
            <div key={d.dim} style={{ background: C.white, padding: 18, borderRadius: 10 }}>
              <DimChip dim={d.dim} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 12, marginBottom: 4 }}>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em" }}>{d.score}</div>
                <div style={{ fontSize: 12, color: C.gray }}>/ 100</div>
              </div>
              <div style={{ fontSize: 11, color: C.gray }}>{d.sub}</div>
              <div style={{ marginTop: 14, height: 4, background: C.lineSoft, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.score}%`, background: d.dim === "EQ" ? C.green : d.dim === "Expressivity" ? C.purpleDeep : C.orange }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recent runs */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.black }}>Recent runs</div>
          <a style={{ fontSize: 12, color: C.gray, cursor: "pointer" }}>View all →</a>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.4fr 0.6fr 0.8fr 0.6fr 0.6fr 0.6fr", padding: "10px 16px", background: C.lineSoft, fontSize: 10, fontWeight: 700, color: C.gray, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <div>Study</div><div>Model</div><div>Mod.</div><div>Status</div><div>Raters</div><div>Score</div><div></div>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: C.gray, fontSize: 13 }}>
              No runs match this modality filter yet.
            </div>
          )}
          {filtered.map((r, i) => (
            <div
              key={r.id}
              onClick={() => open("run")}
              style={{ display: "grid", gridTemplateColumns: "1.8fr 1.4fr 0.6fr 0.8fr 0.6fr 0.6fr 0.6fr", padding: "14px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, alignItems: "center", fontSize: 13, cursor: "pointer", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.lineSoft}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontWeight: 600, color: C.black }}>{r.study}</div>
              <div style={{ color: C.ink }}>{r.model}</div>
              <div><ModalityChip m={r.modality} /></div>
              <div><StatusPill status={r.status} /></div>
              <div style={{ color: C.gray, fontSize: 12 }}>{r.raters || "—"}</div>
              <div style={{ fontWeight: 700, color: r.score ? C.black : C.grayLight }}>{r.score ?? "—"}</div>
              <div style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>{r.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

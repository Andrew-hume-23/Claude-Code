import { useState } from "react";
import { Play, ChevronRight } from "lucide-react";
import { C, FONT } from "../tokens";
import { MODELS } from "../mock/models";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

function ModelSelector({ value, onChange, side }) {
  const [open, setOpen] = useState(false);
  const selected = MODELS.find(m => m.id === value);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          padding: 18,
          background: C.white,
          border: `2px solid ${selected.color}`,
          borderRadius: 10,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: FONT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Model {side}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.black }}>{selected.name}</div>
          <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{selected.vendor}</div>
        </div>
        <ChevronRight size={16} color={C.gray} style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
          {MODELS.map(m => (
            <div
              key={m.id}
              onClick={() => { onChange(m.id); setOpen(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = C.lineSoft}
              onMouseLeave={e => e.currentTarget.style.background = C.white}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{m.name}</div>
                <div style={{ fontSize: 11, color: C.gray }}>{m.vendor}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const compareRows = [
  { label: "Reliability", k: "r", caption: "Latency, WER, endpointing" },
  { label: "Expressivity", k: "e", caption: "Prosody, MOS, naturalness" },
  { label: "Emotional Intelligence", k: "q", caption: "Empathy, attunement, tone" },
];

const SAMPLES = ["Frustration Recovery · prompt 14", "Healthcare Triage · prompt 22", "Cold Discovery · prompt 7"];

export default function Switchboard() {
  const [a, setA] = useState("hume");
  const [b, setB] = useState("11l");
  const ma = MODELS.find(m => m.id === a);
  const mb = MODELS.find(m => m.id === b);

  return (
    <div>
      <SectionHeader
        eyebrow="Head-to-head"
        title="Switchboard"
        action={<Button icon={Play}>Run live comparison</Button>}
      />

      {/* model selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 28 }}>
        <ModelSelector value={a} onChange={setA} side="A" />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray }}>VS</div>
        <ModelSelector value={b} onChange={setB} side="B" />
      </div>

      {/* dimension comparison */}
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
        {compareRows.map((row, i) => {
          const va = ma.scores[row.k];
          const vb = mb.scores[row.k];
          return (
            <div key={row.k} style={{ paddingTop: i === 0 ? 0 : 22, paddingBottom: 22, borderBottom: i === compareRows.length - 1 ? "none" : `1px solid ${C.lineSoft}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{row.caption}</div>
                </div>
                <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: ma.color, letterSpacing: "-0.02em" }}>{va}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>vs</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: mb.color, letterSpacing: "-0.02em" }}>{vb}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: va, height: 6, background: ma.color, borderRadius: 3 }} />
                <div style={{ flex: vb, height: 6, background: mb.color, borderRadius: 3, opacity: 0.85 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* sample comparison rows */}
      <div style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 12 }}>Sample audio · paired rater task</div>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {SAMPLES.map((sample, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 20px", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, alignItems: "center" }}>
            <div style={{ fontSize: 12, color: C.black, fontWeight: 500 }}>{sample}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ width: 28, height: 28, borderRadius: "50%", background: ma.color, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white }}>
                <Play size={12} fill={C.white} />
              </button>
              <div style={{ fontSize: 11, color: C.gray }}>{ma.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ width: 28, height: 28, borderRadius: "50%", background: mb.color, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white }}>
                <Play size={12} fill={C.white} />
              </button>
              <div style={{ fontSize: 11, color: C.gray }}>{mb.name}</div>
            </div>
            <div style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>
              <span style={{ color: ma.color, fontWeight: 700 }}>62%</span> prefer A
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

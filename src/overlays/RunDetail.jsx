import { Volume2, TrendingUp } from "lucide-react";
import { C, FONT } from "../tokens";
import { RUN_DETAIL } from "../mock/runDetail";
import DrawerHeader from "../ui/DrawerHeader";
import DimChip from "../ui/DimChip";
import ModalityChip from "../ui/ModalityChip";
import StatusPill from "../ui/StatusPill";

export default function RunDetail({ onClose }) {
  const r = RUN_DETAIL;
  return (
    <div>
      <DrawerHeader
        eyebrow={`Run · ${r.checkpoint}`}
        title={`${r.study} × ${r.model}`}
        subtitle={`${r.when} · ${r.duration} · ${r.prompts} prompts · ${r.rater_count} raters · κ ${r.kappa}`}
        onClose={onClose}
        action={<StatusPill status={r.status} />}
      />

      <div style={{ padding: 28 }}>
        {/* aggregate score band */}
        <div style={{ background: C.beige, borderRadius: 10, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Composite score</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em" }}>{r.score}</div>
              <div style={{ fontSize: 13, color: C.gray }}>/ 100</div>
              <div style={{ marginLeft: 12, fontSize: 12, color: C.green, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 2 }}>
                <TrendingUp size={12} /> +3 vs v0.8.2
              </div>
            </div>
          </div>
          <ModalityChip m={r.modality} />
        </div>

        {/* dimensions */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>Dimensions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {r.dimensions.map(d => (
            <div key={d.name} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <DimChip dim={d.name} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{d.score}</span>
                  <span style={{ fontSize: 11, color: d.delta > 0 ? C.green : C.red, fontWeight: 600 }}>
                    {d.delta > 0 ? "+" : ""}{d.delta}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${d.sub.length}, 1fr)`, gap: 8 }}>
                {d.sub.map(s => (
                  <div key={s.name} style={{ background: C.lineSoft, borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: C.gray, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{s.score}{s.unit || ""}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* by scenario */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>By scenario</div>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
          {r.by_scenario.map((s, i) => (
            <div key={i}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 60px", padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, alignItems: "center", fontSize: 13, cursor: "pointer", transition: "background .12s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.lineSoft}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontWeight: 600, color: C.black }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{s.prompts} prompts</div>
              <div style={{ fontSize: 11, color: C.gray }}>{s.raters} raters</div>
              <div style={{ fontWeight: 700, textAlign: "right" }}>{s.score}</div>
            </div>
          ))}
        </div>

        {/* rater distribution */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>Rater distribution</div>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 28 }}>
          {r.rater_histogram.map(h => (
            <div key={h.score} style={{ display: "grid", gridTemplateColumns: "32px 1fr 60px 50px", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.black }}>{h.score} ★</div>
              <div style={{ height: 8, background: C.lineSoft, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${h.pct * 2}%`, background: h.score >= 4 ? C.green : h.score === 3 ? C.orange : C.red }} />
              </div>
              <div style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>{h.count}</div>
              <div style={{ fontSize: 11, color: C.black, fontWeight: 600, textAlign: "right" }}>{h.pct}%</div>
            </div>
          ))}
        </div>

        {/* sample turns */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>Sample turns · highest rated</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {r.sample_turns.map(t => (
            <div key={t.id}
              style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.black}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.gray, background: C.lineSoft, padding: "2px 6px", borderRadius: 3 }}>USER</span>
                <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{t.user}</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.white, background: C.purpleDeep, padding: "2px 6px", borderRadius: 3 }}>MODEL</span>
                <div style={{ fontSize: 12, color: C.black, lineHeight: 1.5, fontWeight: 500 }}>{t.model}</div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.lineSoft}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${C.line}`, borderRadius: 5, padding: "4px 10px", fontSize: 11, fontFamily: FONT, color: C.black, cursor: "pointer" }}>
                  <Volume2 size={11} /> Play turn
                </button>
                <span style={{ fontSize: 11, color: C.gray }}>Score <strong style={{ color: C.black }}>{t.score}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

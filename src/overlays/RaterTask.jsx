import { useState } from "react";
import { Play, X, SkipForward, ChevronRight } from "lucide-react";
import { C, FONT } from "../tokens";
import { RUBRIC } from "../mock/rubric";

export default function RaterTask({ onClose }) {
  const [ratings, setRatings] = useState({});
  const [preference, setPreference] = useState(null);
  const [playing, setPlaying] = useState(null);

  const setRating = (id, val) => setRatings(r => ({ ...r, [id]: val }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A0E14", zIndex: 100, overflowY: "auto", fontFamily: FONT, color: "#fff" }}>
      {/* header */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}>HUME · RATER</div>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Frustration Recovery · turn 14 of 32</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>13</span> / 32 done
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <X size={12} /> Exit preview
          </button>
        </div>
      </div>

      {/* progress */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: "100%", width: "41%", background: C.purple }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px" }}>
        {/* context */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Scenario context</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
            A customer has called four times about an unresolved charge. They are frustrated and the resolution attempts have failed. The agent's task is to acknowledge, validate, and move toward resolution.
          </div>
        </div>

        {/* user turn */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>USER SAID</div>
          <div style={{ fontSize: 15, color: "#fff", lineHeight: 1.5, marginBottom: 14 }}>
            "I've called four times about this charge and nobody can help me. I just need someone to actually fix it."
          </div>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
            <Play size={12} fill="#fff" /> Play user audio · 0:08
          </button>
        </div>

        {/* paired responses */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 10 }}>Two model responses</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
          {["A", "B"].map(k => (
            <button
              key={k}
              onClick={() => setPlaying(k)}
              style={{
                background: playing === k ? "rgba(187,171,237,0.12)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${preference === k ? C.purple : "rgba(255,255,255,0.1)"}`,
                borderRadius: 12, padding: 24, cursor: "pointer", textAlign: "left", fontFamily: FONT, color: "#fff",
                transition: "border-color .15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.purple }}>{k}</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.purple, color: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={14} fill={C.black} />
                </div>
              </div>
              <div style={{ height: 28, display: "flex", alignItems: "center", gap: 2, marginBottom: 14 }}>
                {/* fake waveform */}
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: `${20 + Math.sin(i * (k === "A" ? 0.7 : 0.5)) * 40 + Math.cos(i * 0.3) * 20}%`, minHeight: 3, background: "rgba(187,171,237,0.4)", borderRadius: 1 }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>0:11 · 24 words</div>
            </button>
          ))}
        </div>

        {/* preference */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Which response is better?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "A", label: "A is clearly better" },
              { id: "A-soft", label: "A slightly better" },
              { id: "tie", label: "About the same" },
              { id: "B-soft", label: "B slightly better" },
              { id: "B", label: "B is clearly better" },
            ].map(opt => {
              const active = preference === opt.id;
              return (
                <button key={opt.id} onClick={() => setPreference(opt.id)}
                  style={{ flex: 1, padding: "10px 8px", background: active ? C.purple : "rgba(255,255,255,0.05)", border: `1px solid ${active ? C.purple : "rgba(255,255,255,0.1)"}`, color: active ? C.black : "rgba(255,255,255,0.9)", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* rubric */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Rate the preferred response across dimensions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {RUBRIC.map(item => (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>{item.q}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => {
                    const active = ratings[item.id] === n;
                    return (
                      <button key={n} onClick={() => setRating(item.id, n)}
                        style={{ flex: 1, padding: "8px 0", background: active ? C.purple : "rgba(255,255,255,0.05)", border: `1px solid ${active ? C.purple : "rgba(255,255,255,0.1)"}`, color: active ? C.black : "#fff", borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", padding: "10px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
            <SkipForward size={13} /> Skip · can't rate
          </button>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.purple, border: "none", color: C.black, padding: "10px 22px", borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>
            Submit & next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

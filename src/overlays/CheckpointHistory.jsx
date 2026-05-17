import { C } from "../tokens";
import { CHECKPOINTS } from "../mock/checkpoints";
import DrawerHeader from "../ui/DrawerHeader";

export default function CheckpointHistory({ onClose }) {
  const max = 100;
  return (
    <div>
      <DrawerHeader
        eyebrow="Hume Octave"
        title="Checkpoint history"
        subtitle="REACT dimension scores across all training checkpoints"
        onClose={onClose}
      />

      <div style={{ padding: 28 }}>
        {/* mini trend */}
        <div style={{ background: C.beige, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase" }}>Trend · last 8 checkpoints</div>
            <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange }} /> Reliability
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.purpleDeep }} /> Expressivity
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} /> EQ
              </span>
            </div>
          </div>
          <svg viewBox="0 0 320 100" width="100%" height="100" style={{ display: "block" }}>
            {[
              { key: "r", color: C.orange },
              { key: "e", color: C.purpleDeep },
              { key: "q", color: C.green },
            ].map(({ key, color }) => {
              const points = [...CHECKPOINTS].reverse().map((c, i) => {
                const x = (i / (CHECKPOINTS.length - 1)) * 320;
                const y = 100 - ((c[key] - 75) / 25) * 100;
                return `${x},${y}`;
              }).join(" ");
              return <polyline key={key} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />;
            })}
            {[...CHECKPOINTS].reverse().map((c, i) => {
              const x = (i / (CHECKPOINTS.length - 1)) * 320;
              return ["r", "e", "q"].map(k => {
                const color = k === "r" ? C.orange : k === "e" ? C.purpleDeep : C.green;
                const y = 100 - ((c[k] - 75) / 25) * 100;
                return <circle key={`${i}-${k}`} cx={x} cy={y} r="2.5" fill={color} />;
              });
            })}
          </svg>
        </div>

        {/* list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKPOINTS.map(c => (
            <div key={c.id} style={{
              border: c.current ? `2px solid ${C.purpleDeep}` : `1px solid ${C.line}`,
              borderRadius: 10, padding: 16, position: "relative",
              background: c.current ? "#FAFAFE" : C.white,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 700, color: C.black }}>{c.id}</span>
                    {c.current && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "2px 6px", background: C.purpleDeep, color: C.white, borderRadius: 3 }}>CURRENT</span>}
                    {c.regression && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "2px 6px", background: "#FBEAEA", color: "#A33A3A", borderRadius: 3 }}>REGRESSION</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.gray }}>{c.date} · {c.note}</div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { k: "r", label: "R", color: C.orange, val: c.r },
                    { k: "e", label: "E", color: C.purpleDeep, val: c.e },
                    { k: "q", label: "Q", color: C.green, val: c.q },
                  ].map(d => (
                    <div key={d.k} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: d.color, letterSpacing: "0.05em" }}>{d.label}</div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>{d.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { C, FONT } from "../tokens";

const LEADERS = [
  { rank: 1,  name: "Hume Octave",         vendor: "Hume",        color: "#8A6BD9", modality: "S2S", r: 92, e: 89, q: 94, c: 91, s: 85, composite: 90.2, trend: "up",   change: +1.4, certified: true  },
  { rank: 2,  name: "GPT-4o Realtime",      vendor: "OpenAI",      color: "#10A37F", modality: "S2S", r: 90, e: 81, q: 76, c: 86, s: 91, composite: 84.8, trend: "up",   change: +0.6, certified: true  },
  { rank: 3,  name: "ElevenLabs v3",        vendor: "ElevenLabs",  color: "#444444", modality: "TTS", r: 88, e: 87, q: 71, c: 82, s: 93, composite: 84.2, trend: "flat", change: 0,    certified: true  },
  { rank: 4,  name: "Cartesia Sonic 2",     vendor: "Cartesia",    color: "#FF6B35", modality: "TTS", r: 87, e: 84, q: 68, c: 79, s: 94, composite: 82.4, trend: "up",   change: +2.1, certified: false },
  { rank: 5,  name: "Google Chirp 3",       vendor: "Google",      color: "#4285F4", modality: "STT", r: 85, e: 78, q: 64, c: 77, s: 90, composite: 78.8, trend: "down", change: -0.8, certified: true  },
  { rank: 6,  name: "Deepgram Nova 3",      vendor: "Deepgram",    color: "#FF5C6C", modality: "STT", r: 84, e: 73, q: 60, c: 75, s: 92, composite: 76.8, trend: "up",   change: +1.2, certified: false },
  { rank: 7,  name: "Azure Neural TTS",     vendor: "Microsoft",   color: "#00A4EF", modality: "TTS", r: 83, e: 76, q: 62, c: 78, s: 86, composite: 77.0, trend: "flat", change: 0,    certified: true  },
  { rank: 8,  name: "Amazon Polly v4",      vendor: "Amazon",      color: "#FF9900", modality: "TTS", r: 80, e: 70, q: 55, c: 74, s: 88, composite: 73.4, trend: "down", change: -1.5, certified: false },
];

const AXES = [
  { k: "r", label: "Reliability" },
  { k: "e", label: "Expressivity" },
  { k: "q", label: "EQ" },
  { k: "c", label: "Consistency" },
  { k: "s", label: "Speed" },
];

const MODALITIES = ["All", "TTS", "STT", "S2S"];

function ScoreBar({ score, max = 100, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 52, height: 5, background: C.lineSoft, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.black, minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function TrendIcon({ trend, change }) {
  if (trend === "up") return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: C.green }}><TrendingUp size={11} />+{change}</span>;
  if (trend === "down") return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: C.red }}><TrendingDown size={11} />{change}</span>;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: C.grayLight }}><Minus size={11} />0</span>;
}

function RankMedal({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 16 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 16 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 16 }}>🥉</span>;
  return <span style={{ fontSize: 13, fontWeight: 700, color: C.gray, width: 20, textAlign: "center", display: "inline-block" }}>{rank}</span>;
}

function MiniRadar({ model, size = 60 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = AXES.length;
  const toXY = (angle, radius) => ({
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  });

  const buildPath = (scale) =>
    AXES.map((a, i) => {
      const angle = (i / n) * 2 * Math.PI;
      const p = toXY(angle, r * scale);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";

  const dataPath = AXES.map((a, i) => {
    const angle = (i / n) * 2 * Math.PI;
    const val = (model[a.k] - 50) / 50;
    const p = toXY(angle, r * val);
    return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <path key={s} d={buildPath(s)} fill="none" stroke={C.line} strokeWidth="0.5" />
      ))}
      {AXES.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI;
        const p = toXY(angle, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke={C.line} strokeWidth="0.5" />;
      })}
      <path d={dataPath} fill={model.color + "33"} stroke={model.color} strokeWidth="1.5" />
    </svg>
  );
}

export default function Leaderboard() {
  const [modalityFilter, setModalityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("composite");
  const [highlighted, setHighlighted] = useState(null);

  const filtered = LEADERS
    .filter(m => modalityFilter === "All" || m.modality === modalityFilter)
    .sort((a, b) => {
      if (sortBy === "composite") return b.composite - a.composite;
      return b[sortBy] - a[sortBy];
    });

  return (
    <div style={{ maxWidth: 1060 }}>
      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>OBSERVE</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>EQ Leaderboard</h1>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 4, background: "#EAF5EF", color: C.green }}>PUBLIC</span>
            </div>
            <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>Independent REACT benchmark ranking across Reliability, Expressivity, and Emotional Intelligence.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.gray }}>
            <span>Updated May 29, 2026</span>
            <ExternalLink size={12} color={C.grayLight} />
          </div>
        </div>
      </div>

      {/* top 3 podium */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {LEADERS.slice(0, 3).map(m => (
          <div key={m.rank} style={{
            border: m.rank === 1 ? `2px solid ${C.purpleDeep}` : `1px solid ${C.line}`,
            borderRadius: 12, padding: 18, background: m.rank === 1 ? "#FAFAFE" : C.white,
            position: "relative",
          }}>
            {m.rank === 1 && (
              <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)" }}>
                <Trophy size={18} color={C.orange} />
              </div>
            )}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <RankMedal rank={m.rank} />
            </div>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <MiniRadar model={m} size={72} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>{m.name}</div>
              <div style={{ fontSize: 10, color: C.gray, marginBottom: 8 }}>{m.vendor} · {m.modality}</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: m.color }}>{m.composite}</div>
              <div style={{ fontSize: 10, color: C.gray }}>composite</div>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {MODALITIES.map(m => (
            <button key={m} onClick={() => setModalityFilter(m)}
              style={{ padding: "5px 12px", border: `1px solid ${modalityFilter === m ? C.black : C.line}`, borderRadius: 5, background: modalityFilter === m ? C.black : C.white, color: modalityFilter === m ? C.white : C.gray, fontFamily: FONT, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {m}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.gray }}>
          <span style={{ fontWeight: 600 }}>Sort by</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "5px 10px", border: `1px solid ${C.line}`, borderRadius: 5, fontFamily: FONT, fontSize: 11, color: C.black, cursor: "pointer", background: C.white }}>
            <option value="composite">Composite</option>
            <option value="r">Reliability</option>
            <option value="e">Expressivity</option>
            <option value="q">EQ</option>
            <option value="c">Consistency</option>
            <option value="s">Speed</option>
          </select>
        </div>
      </div>

      {/* full table */}
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {/* header row */}
        <div style={{ display: "grid", gridTemplateColumns: "40px 200px 70px 80px 80px 80px 80px 80px 80px 80px", gap: 0, padding: "10px 16px", background: C.lineSoft, borderBottom: `1px solid ${C.line}` }}>
          {["#", "Model", "Mode", "Composite", "Reliability", "Expressivity", "EQ", "Consistency", "Speed", "Δ 30d"].map((h, i) => (
            <div key={i}
              onClick={() => {
                const map = { "Reliability": "r", "Expressivity": "e", "EQ": "q", "Consistency": "c", "Speed": "s", "Composite": "composite" };
                if (map[h]) setSortBy(map[h]);
              }}
              style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", cursor: i >= 3 && i <= 8 ? "pointer" : "default", textAlign: i >= 3 ? "right" : "left" }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.map((m, i) => {
          const isHov = highlighted === m.rank;
          const isHume = m.vendor === "Hume";
          return (
            <div key={m.rank}
              onMouseEnter={() => setHighlighted(m.rank)}
              onMouseLeave={() => setHighlighted(null)}
              style={{
                display: "grid", gridTemplateColumns: "40px 200px 70px 80px 80px 80px 80px 80px 80px 80px",
                gap: 0, padding: "13px 16px",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                background: isHov ? C.lineSoft : isHume ? "#FAFAFE" : C.white,
                transition: "background .1s", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}><RankMedal rank={m.rank} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: C.gray }}>{m.vendor}{m.certified ? " · certified" : ""}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: C.lineSoft, color: C.gray }}>{m.modality}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: m.color }}>{m.composite}</span>
              </div>
              {AXES.map(a => (
                <div key={a.k} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <ScoreBar score={m[a.k]} color={m.color} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <TrendIcon trend={m.trend} change={m.change} />
              </div>
            </div>
          );
        })}
      </div>

      {/* footnote */}
      <div style={{ marginTop: 20, padding: "14px 18px", background: C.beige, borderRadius: 8, fontSize: 11, color: C.gray, lineHeight: 1.6 }}>
        <strong style={{ color: C.black }}>Methodology · </strong>
        Scores are averages across 500+ rated turns per model, using Hume's REACT rubric with a minimum inter-rater reliability of κ = 0.72.
        Models must complete certification evaluation to receive a <strong style={{ color: C.black }}>certified</strong> badge.
        Last full evaluation cycle: May 24, 2026.
      </div>
    </div>
  );
}

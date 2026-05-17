import { useState, useRef, useEffect } from "react";
import {
  Play, ChevronRight, Check, Volume2, Plus, X,
  Mic2, MicOff, Square, Tag, MessageCircle,
  ThumbsUp, ThumbsDown, Save, Send, Edit3, RotateCcw,
} from "lucide-react";
import { C, FONT } from "../tokens";
import { MODELS } from "../mock/models";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import Textarea from "../ui/Textarea";

// ---------- mock data (Step 2) ----------

const ROLES = [
  { id: "att", label: "Telecom Call Center Operator", desc: "Explaining terms and conditions on a service plan" },
  { id: "nurse", label: "Triage Nurse", desc: "Initial symptom intake, anxious caller" },
  { id: "sdr", label: "SDR / Inside Sales", desc: "First-touch outbound discovery call" },
  { id: "tutor", label: "K-12 Tutor", desc: "Helping a struggling student through fractions" },
  { id: "receptionist", label: "Front Desk Receptionist", desc: "Booking and rescheduling appointments" },
  { id: "support", label: "Tier-2 Support Agent", desc: "Resolving an escalated billing dispute" },
];

const USER_PERSONAS = [
  { id: "confused", label: "Confused customer", desc: "Doesn't follow the explanation, asks the same thing differently" },
  { id: "angry", label: "Angry repeat caller", desc: "Frustrated, has called multiple times, wants escalation" },
  { id: "anxious", label: "Anxious patient", desc: "Worried about health, needs reassurance and pace" },
  { id: "skeptical", label: "Skeptical buyer", desc: "Doesn't trust the pitch, pokes holes" },
  { id: "rushed", label: "Time-pressed user", desc: "Wants the answer immediately, no preamble" },
  { id: "elderly", label: "Elderly user", desc: "Needs slower pace, clearer language" },
];

const RUBRICS = [
  { id: "default", name: "Default REACT rubric", items: [
    { id: "resonance", q: "Tone matches the user's emotional state" },
    { id: "empathy", q: "Acknowledges the user's situation before responding" },
    { id: "attunement", q: "Adapts pace and energy across the turn" },
    { id: "coherence", q: "Stays on task and resolves" },
    { id: "trust", q: "Builds confidence — no hedging or corporate hedging" },
  ]},
  { id: "support", name: "Customer support", items: [
    { id: "validate", q: "Validates frustration without dismissing" },
    { id: "restate", q: "Restates the problem accurately" },
    { id: "path", q: "Proposes a concrete next step" },
    { id: "tone", q: "Lower vocal energy than the user" },
  ]},
  { id: "healthcare", name: "Healthcare conversation", items: [
    { id: "pace", q: "Warm pace, no rushed clinical tone" },
    { id: "clarify", q: "Clarifying questions before reassurance" },
    { id: "boundaries", q: "Stays within scope of role" },
  ]},
];

function mockResponse(modelId, prompt) {
  const intros = {
    hume: ["I hear you,", "Yeah, that makes sense —", "I can see why that's frustrating.", "Let me look at this with you."],
    "11l": ["I understand.", "Of course.", "Let me help with that.", "Certainly,"],
    oai: ["I see what you mean.", "Got it,", "Sure thing —", "Okay,"],
    cart: ["Right,", "Understood.", "Mm, okay —", "Yes,"],
    goog: ["Understood.", "Thank you for reaching out.", "I can help with that.", "Certainly."],
  };
  const i = (prompt.length + modelId.length) % 4;
  const intro = intros[modelId]?.[i] ?? "Sure,";
  return `${intro} ${prompt.length > 60 ? "Let me pull up your account and we'll get this sorted." : "Here's what I'd suggest — let's start with what you've already tried."}`;
}

// ---------- shared style constants ----------

const iconBtn = {
  display: "inline-flex", alignItems: "center", gap: 4,
  background: C.white, border: `1px solid ${C.line}`,
  padding: "4px 8px", borderRadius: 4,
  fontSize: 10, fontWeight: 600, fontFamily: FONT,
  color: C.black, cursor: "pointer",
};

const iconBtnSm = {
  width: 24, height: 24, border: `1px solid ${C.line}`,
  background: C.white, borderRadius: 4,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: C.gray,
};

// ---------- Compare tab constants ----------

const compareRows = [
  { label: "Reliability",            k: "r", caption: "Latency, WER, endpointing" },
  { label: "Expressivity",           k: "e", caption: "Prosody, MOS, naturalness" },
  { label: "Emotional Intelligence", k: "q", caption: "Empathy, attunement, tone" },
  { label: "Consistency",            k: "c", caption: "Cross-turn coherence" },
  { label: "Speed",                  k: "s", caption: "TTFB, streaming latency" },
];

const RADAR_AXES = [
  { k: "r", label: "Reliability" },
  { k: "e", label: "Expressivity" },
  { k: "q", label: "EQ" },
  { k: "c", label: "Consistency" },
  { k: "s", label: "Speed" },
];

const SAMPLES = [
  { label: "Frustration Recovery · prompt 14", pctA: 62 },
  { label: "Healthcare Triage · prompt 22",    pctA: 71 },
  { label: "Cold Discovery · prompt 7",        pctA: 48 },
];

// ---------- WaveformCanvas ----------

function WaveformCanvas({ isPlaying, color, width = 100, height = 26 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const phaseRef  = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const N = 28;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      phaseRef.current += isPlaying ? 0.07 : 0;
      for (let i = 0; i < N; i++) {
        const amp = isPlaying
          ? 0.15 + Math.abs(Math.sin(i * 0.45 + phaseRef.current)) * 0.5
                 + Math.abs(Math.sin(i * 1.1  + phaseRef.current * 0.6)) * 0.25
          : 0.1 + Math.abs(Math.sin(i * 0.5)) * 0.12;
        const h  = amp * H;
        const bw = W / N - 1;
        ctx.globalAlpha = isPlaying ? 0.85 : 0.35;
        ctx.fillStyle   = color;
        ctx.beginPath();
        ctx.roundRect(i * (W / N), (H - h) / 2, Math.max(bw, 1), h, 1);
        ctx.fill();
      }
      if (isPlaying) rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, color]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: "block" }} />;
}

// ---------- RadarChart ----------

function RadarChart({ ma, mb }) {
  const size = 200, cx = size / 2, cy = size / 2, r = 72, n = RADAR_AXES.length;

  const polar = (i, dist) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
  };

  const ring = (scale) => RADAR_AXES.map((_, i) => polar(i, r * scale)).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";

  const buildPath = (model) => RADAR_AXES.map((ax, i) => {
    const v = (model.scores[ax.k] - 50) / 50;
    const [x, y] = polar(i, r * Math.max(0, Math.min(1, v)));
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {[0.33, 0.66, 1].map((s, i) => (
          <path key={i} d={ring(s)} fill="none" stroke={C.line} strokeWidth="0.5" />
        ))}
        {RADAR_AXES.map((_, i) => {
          const [x, y] = polar(i, r);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.lineSoft} strokeWidth="0.5" />;
        })}
        <path d={buildPath(ma)} fill={ma.color} fillOpacity="0.18" stroke={ma.color} strokeWidth="2" strokeLinejoin="round" />
        <path d={buildPath(mb)} fill={mb.color} fillOpacity="0.18" stroke={mb.color} strokeWidth="2" strokeLinejoin="round" />
        {RADAR_AXES.map((ax, i) => {
          const [x, y] = polar(i, r + 16);
          return <text key={i} x={x} y={y} fontSize="9" fill={C.gray} fontFamily={FONT} fontWeight="600" textAnchor="middle" dominantBaseline="middle">{ax.label}</text>;
        })}
      </svg>
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        {[ma, mb].map((m, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
            <span style={{ width: 10, height: 3, background: m.color, borderRadius: 2 }} /> {m.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- ModelSelector ----------

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

// ---------- Step 4: SwitchboardCompare ----------

function SwitchboardCompare() {
  const [a, setA] = useState("hume");
  const [b, setB] = useState("11l");
  const [playing, setPlaying] = useState(null); // { row, side: "A"|"B" } | null
  const [votes, setVotes] = useState({});         // { [rowIdx]: "A"|"B" }
  const ma = MODELS.find(m => m.id === a);
  const mb = MODELS.find(m => m.id === b);

  const togglePlay = (row, side) => {
    setPlaying(p => p?.row === row && p?.side === side ? null : { row, side });
  };

  const castVote = (row, side) => {
    setVotes(v => ({ ...v, [row]: side }));
  };

  const clearVote = (row) => {
    setVotes(v => { const n = { ...v }; delete n[row]; return n; });
  };

  return (
    <div>
      {/* model selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 28 }}>
        <ModelSelector value={a} onChange={setA} side="A" />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray }}>VS</div>
        <ModelSelector value={b} onChange={setB} side="B" />
      </div>

      {/* dimension comparison + radar side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16, marginBottom: 20, alignItems: "stretch" }}>
        {/* bars */}
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 24 }}>
          {compareRows.map((row, i) => {
            const va = ma.scores[row.k];
            const vb = mb.scores[row.k];
            const total = va + vb;
            return (
              <div key={row.k} style={{ paddingTop: i === 0 ? 0 : 18, paddingBottom: 18, borderBottom: i === compareRows.length - 1 ? "none" : `1px solid ${C.lineSoft}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{row.caption}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: ma.color, letterSpacing: "-0.02em" }}>{va}</div>
                    <div style={{ fontSize: 11, color: C.gray }}>vs</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: mb.color, letterSpacing: "-0.02em" }}>{vb}</div>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, overflow: "hidden", background: mb.color + "44", display: "flex" }}>
                  <div style={{ width: `${(va / total) * 100}%`, height: "100%", background: ma.color, transition: "width .4s ease", borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG radar */}
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>All 5 axes</div>
          <RadarChart ma={ma} mb={mb} />
        </div>
      </div>

      {/* sample comparison rows with canvas waveform + vote */}
      <div style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 12 }}>Sample audio · paired rater task</div>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        {SAMPLES.map((sample, i) => {
          const voted = votes[i];
          const pctA  = voted === "A" ? 100 : voted === "B" ? 0 : sample.pctA;
          return (
            <div key={i}
              style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1.2fr 180px", padding: "16px 20px", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: C.black, fontWeight: 600 }}>{sample.label}</div>

              {/* Model A */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => togglePlay(i, "A")}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: ma.color, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {playing?.row === i && playing?.side === "A"
                    ? <Square size={10} fill={C.white} color={C.white} />
                    : <Play   size={12} fill={C.white} color={C.white} />}
                </button>
                <WaveformCanvas
                  isPlaying={playing?.row === i && playing?.side === "A"}
                  color={ma.color}
                />
              </div>

              {/* Model B */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => togglePlay(i, "B")}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: mb.color, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {playing?.row === i && playing?.side === "B"
                    ? <Square size={10} fill={C.white} color={C.white} />
                    : <Play   size={12} fill={C.white} color={C.white} />}
                </button>
                <WaveformCanvas
                  isPlaying={playing?.row === i && playing?.side === "B"}
                  color={mb.color}
                />
              </div>

              {/* Vote + animated preference bar */}
              <div>
                {!voted ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 10, color: C.gray, fontWeight: 600 }}>Which is better?</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => castVote(i, "A")}
                        style={{ flex: 1, padding: "5px 0", background: C.white, border: `1.5px solid ${ma.color}`, color: ma.color, borderRadius: 5, fontSize: 11, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>A</button>
                      <button onClick={() => castVote(i, "B")}
                        style={{ flex: 1, padding: "5px 0", background: C.white, border: `1.5px solid ${mb.color}`, color: mb.color, borderRadius: 5, fontSize: 11, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>B</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <div style={{ fontSize: 10, color: voted === "A" ? ma.color : mb.color, fontWeight: 700 }}>
                        {voted} preferred · {voted === "A" ? pctA : 100 - pctA}%
                      </div>
                      <button onClick={() => clearVote(i)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: C.gray, padding: 2, display: "flex", alignItems: "center" }}>
                        <RotateCcw size={11} />
                      </button>
                    </div>
                    <div style={{ height: 6, background: mb.color + "33", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pctA}%`, background: ma.color, transition: "width .5s cubic-bezier(.4,0,.2,1)", borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.gray, marginTop: 3 }}>
                      <span style={{ color: ma.color, fontWeight: 600 }}>A {pctA}%</span>
                      <span style={{ color: mb.color, fontWeight: 600 }}>B {100 - pctA}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Step 5: Generate tab components ----------

function ConfigBlock({ title, hint, children }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</div>
        {hint && <div style={{ fontSize: 10, color: C.gray }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function DropdownPicker({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.id === value);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", padding: "9px 12px", border: `1px solid ${C.line}`, background: C.white, borderRadius: 6, textAlign: "left", cursor: "pointer", fontFamily: FONT, display: "flex", justifyContent: "space-between", alignItems: "center", color: C.black }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{selected ? selected.label : "Select…"}</span>
        <ChevronRight size={14} color={C.gray} style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .12s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: C.white, border: `1px solid ${C.line}`, borderRadius: 6, zIndex: 20, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", maxHeight: 280, overflowY: "auto" }}>
          {options.map(o => (
            <div key={o.id} onClick={() => { onChange(o.id); setOpen(false); }}
              style={{ padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${C.lineSoft}`, fontFamily: FONT }}
              onMouseEnter={e => e.currentTarget.style.background = C.lineSoft}
              onMouseLeave={e => e.currentTarget.style.background = C.white}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.black }}>{o.label}</div>
              <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{o.desc}</div>
            </div>
          ))}
          <div style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.purpleDeep, fontSize: 12, fontWeight: 600, fontFamily: FONT }}>
            <Plus size={12} /> Custom…
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyOutput() {
  return (
    <div style={{ border: `2px dashed ${C.line}`, borderRadius: 12, padding: 60, textAlign: "center", background: C.lineSoft }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.white, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Play size={18} color={C.gray} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.black }}>No output yet</div>
      <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>
        Configure role, persona, and models on the left — then hit Run.
      </div>
    </div>
  );
}

function TranscriptCard({ result, rubric }) {
  const [turns, setTurns] = useState(result.turns);
  const [labelInput, setLabelInput] = useState({});

  const updateTurn = (id, patch) => {
    setTurns(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const addLabel = (turnId, label) => {
    if (!label.trim()) return;
    const t = turns.find(x => x.id === turnId);
    updateTurn(turnId, { labels: [...t.labels, label.trim()] });
    setLabelInput(s => ({ ...s, [turnId]: "" }));
  };

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
      {/* header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.lineSoft }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: result.color }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{result.modelName}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={iconBtn}><Volume2 size={12} /> Play full</button>
          <button style={iconBtn}><Save size={12} /> Save</button>
        </div>
      </div>

      {/* turns */}
      <div>
        {turns.map((t, i) => (
          <div key={t.id} style={{ padding: 16, borderTop: i === 0 ? "none" : `1px solid ${C.lineSoft}` }}>
            {/* user prompt */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, background: C.lineSoft, padding: "3px 6px", borderRadius: 3, height: "fit-content" }}>USER</span>
              <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5, flex: 1 }}>{t.user}</div>
            </div>
            {/* model response */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.white, background: result.color, padding: "3px 6px", borderRadius: 3, height: "fit-content" }}>MODEL</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.black, lineHeight: 1.5, fontWeight: 500, marginBottom: 8 }}>{t.model}</div>
                <button style={{ ...iconBtn, marginBottom: 0 }}><Play size={11} fill={C.black} /> 0:0{4 + i}</button>
              </div>
            </div>

            {/* turn actions */}
            <div style={{ marginTop: 12, padding: 10, background: C.lineSoft, borderRadius: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {/* rating */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.gray, letterSpacing: "0.05em", textTransform: "uppercase", marginRight: 4 }}>Rate</span>
                  {[1, 2, 3, 4, 5].map(n => {
                    const active = t.rating === n;
                    return (
                      <button key={n} onClick={() => updateTurn(t.id, { rating: active ? null : n })}
                        style={{
                          width: 24, height: 24, border: `1px solid ${active ? C.black : C.line}`,
                          background: active ? C.black : C.white,
                          color: active ? C.white : C.gray,
                          borderRadius: 4,
                          fontFamily: FONT, fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}>{n}</button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => updateTurn(t.id, { thumb: t.thumb === "up" ? null : "up" })}
                    style={{ ...iconBtnSm, background: t.thumb === "up" ? C.green : C.white, color: t.thumb === "up" ? C.white : C.gray, borderColor: t.thumb === "up" ? C.green : C.line }}>
                    <ThumbsUp size={11} />
                  </button>
                  <button onClick={() => updateTurn(t.id, { thumb: t.thumb === "down" ? null : "down" })}
                    style={{ ...iconBtnSm, background: t.thumb === "down" ? C.red : C.white, color: t.thumb === "down" ? C.white : C.gray, borderColor: t.thumb === "down" ? C.red : C.line }}>
                    <ThumbsDown size={11} />
                  </button>
                </div>
              </div>

              {/* labels */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                <Tag size={11} color={C.gray} />
                {t.labels.map((l, li) => (
                  <span key={li} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", background: C.purple, color: C.black, borderRadius: 3 }}>
                    {l}
                  </span>
                ))}
                <input
                  value={labelInput[t.id] || ""}
                  onChange={e => setLabelInput(s => ({ ...s, [t.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") addLabel(t.id, labelInput[t.id] || ""); }}
                  placeholder="Add label + Enter"
                  style={{ flex: 1, minWidth: 120, border: "none", background: "transparent", fontSize: 11, fontFamily: FONT, color: C.black, outline: "none", padding: "2px 4px" }}
                />
              </div>

              {/* comment */}
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <MessageCircle size={11} color={C.gray} style={{ marginTop: 4 }} />
                <textarea
                  value={t.comment}
                  onChange={e => updateTurn(t.id, { comment: e.target.value })}
                  placeholder="Notes for this turn…"
                  rows={1}
                  style={{ flex: 1, border: "none", background: "transparent", fontSize: 11, fontFamily: FONT, color: C.black, outline: "none", resize: "vertical", padding: "2px 4px", lineHeight: 1.4 }}
                />
              </div>

              {/* rubric scores */}
              {rubric && (
                <div style={{ paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.gray, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{rubric.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {rubric.items.map(item => (
                      <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: C.ink }}>{item.q}</div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1, 2, 3, 4, 5].map(n => {
                            const key = `rubric_${item.id}`;
                            const active = t[key] === n;
                            return (
                              <button key={n} onClick={() => updateTurn(t.id, { [key]: active ? null : n })}
                                style={{ width: 18, height: 18, border: `1px solid ${active ? C.black : C.line}`, background: active ? C.black : C.white, color: active ? C.white : C.gray, borderRadius: 3, fontFamily: FONT, fontSize: 9, fontWeight: 700, cursor: "pointer", padding: 0 }}>
                                {n}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwitchboardGenerate() {
  const [role, setRole] = useState("att");
  const [persona, setPersona] = useState("confused");
  const [selectedModels, setSelectedModels] = useState(["hume", "11l", "oai"]);
  const [mode, setMode] = useState("prompts"); // "prompts" | "live"
  const [prompts, setPrompts] = useState(
    "I don't understand what this charge is for. Can you explain?\nWhy is my bill higher this month?\nI didn't sign up for any of that. Take it off."
  );
  const [recording, setRecording] = useState(false);
  const [results, setResults] = useState(null);
  const [activeRubric, setActiveRubric] = useState("default");
  const [rubricOpen, setRubricOpen] = useState(false);

  const roleObj = ROLES.find(r => r.id === role);
  const personaObj = USER_PERSONAS.find(p => p.id === persona);
  const promptList = prompts.split("\n").map(p => p.trim()).filter(Boolean);

  const toggleModel = (id) => {
    setSelectedModels(s => s.includes(id) ? s.filter(m => m !== id) : [...s, id]);
  };

  const run = () => {
    const generated = selectedModels.map(modelId => {
      const model = MODELS.find(m => m.id === modelId);
      return {
        modelId,
        modelName: model.name,
        color: model.color,
        turns: promptList.map((p, i) => ({
          id: i,
          user: p,
          model: mockResponse(modelId, p),
          rating: null,
          comment: "",
          labels: [],
        })),
      };
    });
    setResults(generated);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "flex-start" }}>
      {/* LEFT: configuration */}
      <div style={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* role */}
        <ConfigBlock title="Role" hint="Who the model plays">
          <DropdownPicker options={ROLES} value={role} onChange={setRole} />
          {roleObj && (
            <div style={{ fontSize: 11, color: C.gray, marginTop: 8, padding: "8px 10px", background: C.lineSoft, borderRadius: 6, lineHeight: 1.5 }}>
              {roleObj.desc}
            </div>
          )}
        </ConfigBlock>

        {/* user persona */}
        <ConfigBlock title="User persona" hint="Who they're talking to">
          <DropdownPicker options={USER_PERSONAS} value={persona} onChange={setPersona} />
          {personaObj && (
            <div style={{ fontSize: 11, color: C.gray, marginTop: 8, padding: "8px 10px", background: C.lineSoft, borderRadius: 6, lineHeight: 1.5 }}>
              {personaObj.desc}
            </div>
          )}
        </ConfigBlock>

        {/* models */}
        <ConfigBlock title="Models" hint={`${selectedModels.length} selected`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {MODELS.map(m => {
              const on = selectedModels.includes(m.id);
              return (
                <button key={m.id} onClick={() => toggleModel(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px",
                    background: on ? C.beige : C.white,
                    border: `1px solid ${on ? C.black : C.line}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: FONT,
                    textAlign: "left",
                  }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${on ? C.black : C.line}`, background: on ? C.black : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {on && <Check size={10} color={C.white} strokeWidth={3} />}
                  </div>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.black }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: C.gray }}>{m.vendor}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </ConfigBlock>

        {/* mode + prompts */}
        <ConfigBlock title="Input">
          <div style={{ display: "flex", gap: 4, marginBottom: 10, padding: 3, background: C.lineSoft, borderRadius: 6 }}>
            {[
              { id: "prompts", label: "Prompts" },
              { id: "live", label: "Live voice" },
            ].map(t => {
              const active = mode === t.id;
              return (
                <button key={t.id} onClick={() => setMode(t.id)}
                  style={{ flex: 1, padding: "6px 10px", background: active ? C.white : "transparent", border: "none", borderRadius: 4, fontFamily: FONT, fontSize: 11, fontWeight: 600, color: active ? C.black : C.gray, cursor: "pointer", boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
                  {t.label}
                </button>
              );
            })}
          </div>

          {mode === "prompts" ? (
            <>
              <Textarea value={prompts} onChange={setPrompts} rows={8} placeholder="One prompt per line" />
              <div style={{ fontSize: 11, color: C.gray, marginTop: 6 }}>
                {promptList.length} prompt{promptList.length === 1 ? "" : "s"} · runs against {selectedModels.length} model{selectedModels.length === 1 ? "" : "s"}
              </div>
            </>
          ) : (
            <div style={{ padding: 24, border: `2px dashed ${recording ? C.purpleDeep : C.line}`, borderRadius: 8, textAlign: "center", background: recording ? "#FAFAFE" : C.white }}>
              <button onClick={() => setRecording(r => !r)}
                style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: recording ? C.red : C.black,
                  border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto",
                }}>
                {recording ? <Square size={20} color={C.white} fill={C.white} /> : <Mic2 size={24} color={C.white} />}
              </button>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.black, marginTop: 12 }}>
                {recording ? "Recording…" : "Tap to speak"}
              </div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>
                {recording ? "All selected models will respond in real time" : "Direct voice → model conversation"}
              </div>
            </div>
          )}
        </ConfigBlock>

        <button onClick={run}
          style={{
            background: C.black, color: C.white, border: "none",
            padding: "12px 16px", borderRadius: 8, fontFamily: FONT,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          <Play size={14} fill={C.white} /> Run · {selectedModels.length} model{selectedModels.length === 1 ? "" : "s"} × {promptList.length || 1} turn{promptList.length === 1 ? "" : "s"}
        </button>
      </div>

      {/* RIGHT: output */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* rubric bar */}
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase" }}>Rubric</div>
            <select value={activeRubric} onChange={e => setActiveRubric(e.target.value)}
              style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.black, border: `1px solid ${C.line}`, borderRadius: 5, padding: "5px 8px", background: C.white, cursor: "pointer" }}>
              {RUBRICS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <span style={{ fontSize: 11, color: C.gray }}>
              {RUBRICS.find(r => r.id === activeRubric).items.length} criteria
            </span>
          </div>
          <button onClick={() => setRubricOpen(o => !o)}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${C.line}`, padding: "5px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", color: C.black }}>
            <Edit3 size={11} /> {rubricOpen ? "Hide" : "Build custom"}
          </button>
        </div>

        {rubricOpen && (
          <div style={{ background: "#FAFAFE", border: `1px solid ${C.purple}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 10 }}>Custom rubric questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {RUBRICS.find(r => r.id === activeRubric).items.map((item, i) => (
                <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: C.white, borderRadius: 6, border: `1px solid ${C.line}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.gray, width: 16 }}>{i + 1}.</span>
                  <span style={{ flex: 1, fontSize: 12, color: C.black }}>{item.q}</span>
                  <X size={12} color={C.gray} style={{ cursor: "pointer" }} />
                </div>
              ))}
              <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.white, border: `1px dashed ${C.line}`, padding: "8px 10px", borderRadius: 6, fontSize: 12, fontFamily: FONT, color: C.gray, cursor: "pointer", justifyContent: "center" }}>
                <Plus size={12} /> Add question
              </button>
            </div>
          </div>
        )}

        {/* results */}
        {!results ? (
          <EmptyOutput />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map(r => (
              <TranscriptCard key={r.modelId} result={r} rubric={RUBRICS.find(rb => rb.id === activeRubric)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Step 3: Switchboard tab wrapper (default export) ----------

export default function Switchboard() {
  const [tab, setTab] = useState("compare");

  return (
    <div>
      <SectionHeader
        eyebrow="Head-to-head"
        title="Switchboard"
        action={tab === "compare"
          ? <Button icon={Play}>Run live comparison</Button>
          : <Button primary icon={Save}>Save session</Button>
        }
      />

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, marginBottom: 24 }}>
        {[
          { id: "compare", label: "Compare", sub: "Side-by-side benchmark" },
          { id: "generate", label: "Generate", sub: "Run scenarios against models with humans in the loop" },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "12px 18px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${active ? C.black : "transparent"}`,
                marginBottom: -1,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? C.black : C.gray,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
              }}>
              <span>{t.label}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: active ? C.gray : C.grayLight, letterSpacing: "0.02em" }}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      {tab === "compare" ? <SwitchboardCompare /> : <SwitchboardGenerate />}
    </div>
  );
}

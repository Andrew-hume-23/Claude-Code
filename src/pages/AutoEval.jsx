import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock, Bell, GitCommit, ChevronRight, Zap, Pause, Play, Settings } from "lucide-react";
import { C, FONT } from "../tokens";

const EVALS = [
  {
    id: "ae-001", name: "Reliability Regression Suite", model: "Hume Octave", schedule: "every commit",
    status: "passing", lastRun: "2 min ago", score: 92, delta: +1, runs: 248, alertOn: ["regression > 2pt"],
  },
  {
    id: "ae-002", name: "Expressivity Full Battery", model: "Hume Octave", schedule: "nightly",
    status: "passing", lastRun: "6 h ago", score: 89, delta: 0, runs: 41, alertOn: ["regression > 3pt", "score < 85"],
  },
  {
    id: "ae-003", name: "EQ Benchmark Sweep", model: "All models", schedule: "weekly",
    status: "passing", lastRun: "2 d ago", score: 87, delta: +2, runs: 12, alertOn: ["any regression"],
  },
  {
    id: "ae-004", name: "Speed & Latency Monitor", model: "Hume Octave", schedule: "every commit",
    status: "regression", lastRun: "18 min ago", score: 81, delta: -4, runs: 247, alertOn: ["latency > 400 ms", "regression > 2pt"],
  },
  {
    id: "ae-005", name: "Consistency Probe", model: "Hume Octave", schedule: "nightly",
    status: "paused", lastRun: "5 d ago", score: 88, delta: null, runs: 33, alertOn: ["regression > 4pt"],
  },
];

const HISTORY = [
  { id: "run-248", eval: "Reliability Regression Suite", checkpoint: "v0.9.4", status: "pass", score: 92, when: "2 min ago" },
  { id: "run-247", eval: "Speed & Latency Monitor",       checkpoint: "v0.9.4", status: "regression", score: 81, when: "18 min ago" },
  { id: "run-246", eval: "Reliability Regression Suite",  checkpoint: "v0.9.3", status: "pass", score: 91, when: "4 h ago" },
  { id: "run-245", eval: "Expressivity Full Battery",     checkpoint: "v0.9.3", status: "pass", score: 89, when: "6 h ago" },
  { id: "run-244", eval: "Speed & Latency Monitor",       checkpoint: "v0.9.3", status: "pass", score: 85, when: "7 h ago" },
  { id: "run-243", eval: "Reliability Regression Suite",  checkpoint: "v0.9.2", status: "pass", score: 91, when: "1 d ago" },
  { id: "run-242", eval: "EQ Benchmark Sweep",            checkpoint: "v0.9.1", status: "pass", score: 85, when: "2 d ago" },
];

const CHANNELS = [
  { id: "slack",   label: "Slack",   dest: "#voice-eq-alerts",       active: true },
  { id: "webhook", label: "Webhook", dest: "https://hooks.internal/…", active: true },
  { id: "email",   label: "Email",   dest: "team@hume.ai",           active: false },
];

function StatusBadge({ status }) {
  const map = {
    passing:    { bg: "#EAF5EF", color: C.green,    label: "PASSING" },
    regression: { bg: "#FBEAEA", color: "#A33A3A",  label: "REGRESSION" },
    paused:     { bg: C.lineSoft, color: C.gray,    label: "PAUSED" },
    running:    { bg: "#EEF3FF", color: C.purpleDeep, label: "RUNNING" },
  };
  const s = map[status] || map.paused;
  return (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 7px", borderRadius: 4, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function DeltaBadge({ delta }) {
  if (delta === null) return <span style={{ fontSize: 11, color: C.grayLight }}>—</span>;
  if (delta === 0) return <span style={{ fontSize: 11, color: C.gray }}>±0</span>;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: delta > 0 ? C.green : C.red }}>
      {delta > 0 ? "+" : ""}{delta}
    </span>
  );
}

function EvalRow({ ev }) {
  const [hov, setHov] = useState(false);
  const Icon = ev.status === "passing" ? CheckCircle : ev.status === "regression" ? AlertTriangle : Pause;
  const iconColor = ev.status === "passing" ? C.green : ev.status === "regression" ? C.red : C.grayLight;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "24px 1fr 120px 80px 64px 64px 64px 28px",
        alignItems: "center", gap: 12, padding: "14px 16px",
        borderBottom: `1px solid ${C.line}`, cursor: "pointer",
        background: hov ? C.lineSoft : C.white, transition: "background .1s",
      }}
    >
      <Icon size={15} color={iconColor} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 2 }}>{ev.name}</div>
        <div style={{ fontSize: 11, color: C.gray }}>{ev.model} · <span style={{ fontFamily: "ui-monospace, monospace" }}>{ev.id}</span></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.gray }}>
        <Clock size={10} /> {ev.schedule}
      </div>
      <StatusBadge status={ev.status} />
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", textAlign: "right" }}>{ev.score}</div>
      <div style={{ textAlign: "right" }}><DeltaBadge delta={ev.delta} /></div>
      <div style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>{ev.lastRun}</div>
      <ChevronRight size={14} color={C.grayLight} />
    </div>
  );
}

function HistoryRow({ r, i }) {
  const [hov, setHov] = useState(false);
  const isReg = r.status === "regression";
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "90px 1fr 100px 50px 80px",
        alignItems: "center", gap: 12, padding: "11px 16px",
        borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
        cursor: "pointer", background: hov ? C.lineSoft : C.white, transition: "background .1s",
      }}
    >
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: C.gray }}>{r.id}</span>
      <div style={{ fontSize: 12, fontWeight: 500, color: C.black }}>{r.eval}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
        <GitCommit size={10} /> {r.checkpoint}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, textAlign: "right" }}>{r.score}</div>
      <div style={{ textAlign: "right" }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 6px", borderRadius: 3,
          background: isReg ? "#FBEAEA" : "#EAF5EF", color: isReg ? "#A33A3A" : C.green,
        }}>
          {isReg ? "REGRESSION" : "PASS"}
        </span>
      </div>
    </div>
  );
}

export default function AutoEval() {
  const [activeTab, setActiveTab] = useState("evals");
  const regressions = EVALS.filter(e => e.status === "regression").length;
  const passing = EVALS.filter(e => e.status === "passing").length;

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>OBSERVE</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>AutoEval</h1>
            <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>Define it once, run it forever — continuous regression detection on every checkpoint.</p>
          </div>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: C.black, color: C.white, border: "none",
            padding: "10px 18px", borderRadius: 8, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <Zap size={13} /> New eval
          </button>
        </div>
      </div>

      {/* stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Active evals", value: EVALS.filter(e => e.status !== "paused").length, icon: Activity, color: C.purpleDeep },
          { label: "Passing", value: passing, icon: CheckCircle, color: C.green },
          { label: "Regressions", value: regressions, icon: AlertTriangle, color: regressions ? C.red : C.gray },
          { label: "Total runs", value: "583", icon: GitCommit, color: C.gray },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: C.beige, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <Icon size={13} color={s.color} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: s.color === C.red && regressions ? C.red : C.black }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* regression alert */}
      {regressions > 0 && (
        <div style={{ background: "#FBEAEA", border: `1px solid #F0B0B0`, borderRadius: 10, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={16} color="#A33A3A" />
          <div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#A33A3A" }}>Regression detected · </span>
            <span style={{ fontSize: 13, color: "#7A2A2A" }}>Speed &amp; Latency Monitor dropped 4 pts on v0.9.4. Alerts sent to #voice-eq-alerts.</span>
          </div>
        </div>
      )}

      {/* tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.line}`, marginBottom: 0 }}>
        {[{ id: "evals", label: "Eval monitors" }, { id: "history", label: "Run history" }, { id: "alerts", label: "Notifications" }].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: "transparent", border: "none", borderBottom: activeTab === t.id ? `2px solid ${C.black}` : "2px solid transparent",
              padding: "10px 18px", fontFamily: FONT, fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? C.black : C.gray, cursor: "pointer", marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "evals" && (
        <div style={{ border: `1px solid ${C.line}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          {/* col headers */}
          <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 120px 80px 64px 64px 64px 28px", gap: 12, padding: "10px 16px", background: C.lineSoft, borderBottom: `1px solid ${C.line}` }}>
            {["", "Eval", "Schedule", "Status", "Score", "Δ", "Last run", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", textAlign: i >= 4 ? "right" : "left" }}>{h}</div>
            ))}
          </div>
          {EVALS.map(ev => <EvalRow key={ev.id} ev={ev} />)}
        </div>
      )}

      {activeTab === "history" && (
        <div style={{ border: `1px solid ${C.line}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 50px 80px", gap: 12, padding: "10px 16px", background: C.lineSoft, borderBottom: `1px solid ${C.line}` }}>
            {["Run ID", "Eval", "Checkpoint", "Score", "Result"].map((h, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", textAlign: i >= 3 ? "right" : "left" }}>{h}</div>
            ))}
          </div>
          {HISTORY.map((r, i) => <HistoryRow key={r.id} r={r} i={i} />)}
        </div>
      )}

      {activeTab === "alerts" && (
        <div style={{ padding: "24px 0" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>Notification channels</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHANNELS.map(ch => (
                <div key={ch.id} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Bell size={14} color={ch.active ? C.purpleDeep : C.grayLight} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{ch.label}</div>
                      <div style={{ fontSize: 11, color: C.gray, fontFamily: "ui-monospace, monospace" }}>{ch.dest}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: ch.active ? "#EAF5EF" : C.lineSoft, color: ch.active ? C.green : C.gray }}>
                      {ch.active ? "ACTIVE" : "OFF"}
                    </span>
                    <button style={{ background: "transparent", border: `1px solid ${C.line}`, borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontFamily: FONT, fontSize: 11, color: C.gray }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 12 }}>Alert triggers</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Any regression detected", "Score drops > 2 points vs prior checkpoint", "Score drops > 5 points vs baseline", "Latency exceeds 400 ms"].map(t => (
                <div key={t} style={{ border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.purpleDeep }} />
                    <span style={{ fontSize: 13, color: C.black }}>{t}</span>
                  </div>
                  <Settings size={13} color={C.grayLight} style={{ cursor: "pointer" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

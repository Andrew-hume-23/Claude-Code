import { useState } from "react";
import { Upload, CheckCircle, Clock, Sparkles, Users, Mic, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { C, FONT } from "../tokens";

const ORDERS = [
  {
    id: "hd-041", title: "Empathetic support — 200 turns", modality: "S2S", status: "labeling",
    submitted: "May 27", eta: "Jun 3", samples: 200, labeled: 124, dims: ["Expressivity", "EQ"],
  },
  {
    id: "hd-040", title: "Medical intake scenarios", modality: "TTS", status: "delivered",
    submitted: "May 18", eta: "May 25", samples: 500, labeled: 500, dims: ["Reliability", "EQ"],
  },
  {
    id: "hd-039", title: "Sales objection handling", modality: "S2S", status: "recording",
    submitted: "May 26", eta: "Jun 5", samples: 300, labeled: 0, dims: ["Expressivity", "Consistency"],
  },
  {
    id: "hd-038", title: "Children's educational content", modality: "TTS", status: "delivered",
    submitted: "May 10", eta: "May 17", samples: 150, labeled: 150, dims: ["Reliability", "EQ"],
  },
  {
    id: "hd-037", title: "Crisis line support voices", modality: "S2S", status: "delivered",
    submitted: "May 3", eta: "May 12", samples: 400, labeled: 400, dims: ["EQ", "Expressivity"],
  },
];

const TIERS = [
  {
    name: "Standard", price: "$0.40 / sample", turnaround: "7–10 days",
    features: ["5 trained raters per sample", "REACT scoring", "CSV + JSON export"],
    highlight: false,
  },
  {
    name: "Priority", price: "$0.80 / sample", turnaround: "3–5 days",
    features: ["10 trained raters per sample", "REACT + sub-dimension scoring", "CSV + JSON + API export", "Dedicated QA review"],
    highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", turnaround: "Custom SLA",
    features: ["Unlimited raters", "Custom rubric design", "Real-time webhook delivery", "Dedicated account manager"],
    highlight: false,
  },
];

const STATUS_MAP = {
  recording: { label: "Recording", color: C.orange,     bg: "#FFF4EA" },
  labeling:  { label: "Labeling",  color: C.purpleDeep, bg: "#F0ECFD" },
  qareview:  { label: "QA Review", color: "#2266CC",    bg: "#EEF3FF" },
  delivered: { label: "Delivered", color: C.green,      bg: "#EAF5EF" },
};

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 4, background: C.lineSoft, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width .4s" }} />
    </div>
  );
}

function OrderRow({ o, i }) {
  const [hov, setHov] = useState(false);
  const st = STATUS_MAP[o.status];
  const pct = Math.round((o.labeled / o.samples) * 100);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "90px 1fr 60px 200px 100px 28px",
        alignItems: "center", gap: 12, padding: "14px 16px",
        borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
        cursor: "pointer", background: hov ? C.lineSoft : C.white, transition: "background .1s",
      }}
    >
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: C.gray }}>{o.id}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 2 }}>{o.title}</div>
        <div style={{ fontSize: 11, color: C.gray }}>{o.dims.join(" · ")} · ETA {o.eta}</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: C.lineSoft, color: C.gray }}>{o.modality}</span>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: st.bg, color: st.color }}>{st.label}</span>
          <span style={{ fontSize: 11, color: C.gray }}>{o.labeled}/{o.samples}</span>
        </div>
        <ProgressBar pct={pct} color={st.color} />
      </div>
      <span style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>{o.submitted}</span>
      <ChevronRight size={14} color={C.grayLight} />
    </div>
  );
}

function SubmitForm() {
  const [step, setStep] = useState(1);
  const [modality, setModality] = useState("S2S");
  const [dims, setDims] = useState(["Expressivity"]);

  const toggleDim = d => setDims(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
      {/* step bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.line}`, background: C.lineSoft }}>
        {[{ n: 1, label: "Brief" }, { n: 2, label: "Samples" }, { n: 3, label: "Tier" }, { n: 4, label: "Confirm" }].map((s, i) => (
          <div key={s.n} style={{ flex: 1, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderRight: i < 3 ? `1px solid ${C.line}` : "none" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: step > s.n ? C.green : step === s.n ? C.black : C.grayLight,
              color: C.white, fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>
              {step > s.n ? <CheckCircle size={12} /> : s.n}
            </div>
            <span style={{ fontSize: 12, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? C.black : C.gray }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: C.black }}>What do you need?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Dataset title</label>
                <input placeholder="e.g. Empathetic customer support — 200 turns" style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 7, fontFamily: FONT, fontSize: 13, color: C.black, boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Modality</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["TTS", "STT", "S2S"].map(m => (
                    <button key={m} onClick={() => setModality(m)}
                      style={{ padding: "7px 14px", border: `1px solid ${modality === m ? C.black : C.line}`, borderRadius: 6, background: modality === m ? C.black : C.white, color: modality === m ? C.white : C.gray, fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Dimensions to label</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Reliability", "Expressivity", "EQ", "Consistency", "Speed"].map(d => (
                    <button key={d} onClick={() => toggleDim(d)}
                      style={{ padding: "7px 14px", border: `1px solid ${dims.includes(d) ? C.purpleDeep : C.line}`, borderRadius: 6, background: dims.includes(d) ? "#F0ECFD" : C.white, color: dims.includes(d) ? C.purpleDeep : C.gray, fontFamily: FONT, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Use case / context</label>
                <textarea placeholder="Describe the intended use case, target users, and any specific labeling requirements..." rows={3}
                  style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 7, fontFamily: FONT, fontSize: 13, color: C.black, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: C.black }}>Upload samples or provide a script</div>
            <div style={{ border: `2px dashed ${C.line}`, borderRadius: 10, padding: 40, textAlign: "center", marginBottom: 16, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.purpleDeep}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
            >
              <Upload size={24} color={C.grayLight} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 4 }}>Drop audio files here</div>
              <div style={{ fontSize: 11, color: C.gray }}>MP3, WAV, FLAC — up to 500 MB per batch</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 12, color: C.gray, marginBottom: 16 }}>— or —</div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Script / prompt list</label>
              <textarea placeholder="Paste a list of prompts/scripts. We'll synthesize audio on your behalf." rows={4}
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 7, fontFamily: FONT, fontSize: 13, color: C.black, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: C.black }}>Choose a labeling tier</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {TIERS.map(t => (
                <div key={t.name} style={{
                  border: `${t.highlight ? 2 : 1}px solid ${t.highlight ? C.purpleDeep : C.line}`,
                  borderRadius: 10, padding: 18, cursor: "pointer",
                  background: t.highlight ? "#FAFAFE" : C.white,
                }}>
                  {t.highlight && <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.purpleDeep, marginBottom: 8 }}>RECOMMENDED</div>}
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: t.highlight ? C.purpleDeep : C.black, marginBottom: 6 }}>{t.price}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginBottom: 12 }}>{t.turnaround} turnaround</div>
                  {t.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
                      <CheckCircle size={11} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 11, color: C.gray }}>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAF5EF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle size={24} color={C.green} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.black, marginBottom: 6 }}>Order submitted</div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>Reference <strong>hd-042</strong> · Expected delivery June 5</div>
            <div style={{ fontSize: 12, color: C.gray }}>You'll receive a Slack notification when recording begins and when labeled data is ready to export.</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          {step > 1 && step < 4 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ padding: "9px 18px", border: `1px solid ${C.line}`, borderRadius: 7, background: C.white, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.gray, cursor: "pointer" }}>
              Back
            </button>
          )}
          {step < 3 && (
            <button onClick={() => setStep(s => s + 1)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 7, background: C.black, color: C.white, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Next <ArrowRight size={13} />
            </button>
          )}
          {step === 3 && (
            <button onClick={() => setStep(4)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", border: "none", borderRadius: 7, background: C.purpleDeep, color: C.white, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Submit order <ArrowRight size={13} />
            </button>
          )}
          {step === 4 && (
            <button onClick={() => setStep(1)}
              style={{ padding: "9px 18px", border: "none", borderRadius: 7, background: C.black, color: C.white, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              New order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HyperData() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>BUILD</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>Hyper Data</h1>
            <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>Commission, scale, and acquire high-quality labeled voice datasets. We record, label, and deliver.</p>
          </div>
          <button
            onClick={() => setActiveTab("new")}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.black, color: C.white, border: "none", padding: "10px 18px", borderRadius: 8, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Sparkles size={13} /> Commission dataset
          </button>
        </div>
      </div>

      {/* stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Active orders", value: 2, icon: Clock, color: C.orange },
          { label: "Delivered", value: 3, icon: CheckCircle, color: C.green },
          { label: "Total samples", value: "1,550", icon: Mic, color: C.purpleDeep },
          { label: "Avg turnaround", value: "6.2 d", icon: FileText, color: C.gray },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: C.beige, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <Icon size={13} color={s.color} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.line}`, marginBottom: 24 }}>
        {[{ id: "orders", label: "My orders" }, { id: "new", label: "New order" }].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: "transparent", border: "none",
              borderBottom: activeTab === t.id ? `2px solid ${C.black}` : "2px solid transparent",
              padding: "10px 18px", fontFamily: FONT, fontSize: 13,
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? C.black : C.gray,
              cursor: "pointer", marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 200px 100px 28px", gap: 12, padding: "10px 16px", background: C.lineSoft, borderBottom: `1px solid ${C.line}` }}>
            {["Order ID", "Title", "Mode", "Progress", "Submitted", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {ORDERS.map((o, i) => <OrderRow key={o.id} o={o} i={i} />)}
        </div>
      )}

      {activeTab === "new" && <SubmitForm />}
    </div>
  );
}

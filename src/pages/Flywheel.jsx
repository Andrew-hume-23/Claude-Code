import { useState } from "react";
import {
  Beaker, Repeat, Database, Cpu, Lock, TrendingUp, Users, Trophy,
  ArrowRight, Boxes, Gauge, ShieldCheck, Rocket, Layers, CircleDollarSign,
} from "lucide-react";
import { C, FONT } from "../tokens";

/* ------------------------------------------------------------------ */
/*  Flywheel geometry                                                  */
/* ------------------------------------------------------------------ */

const W = 660;
const H = 612;
const CX = 330;
const CY = 308;
const RC = 230;                 // card orbit radius
const RING = 116;               // rotational ring radius
const STAGE_ANGLES = [-90, -18, 54, 126, 198];
const MID_ANGLES = [-54, 18, 90, 162, 234];

const rad = (d) => (d * Math.PI) / 180;
const px = (a, r) => CX + r * Math.cos(rad(a));
const py = (a, r) => CY + r * Math.sin(rad(a));

function Flywheel({ stages, center, accent }) {
  return (
    <div style={{ position: "relative", width: W, height: H, margin: "0 auto", maxWidth: "100%" }}>
      {/* arrow / spoke layer */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* spokes from ring to cards */}
        {STAGE_ANGLES.map((a, i) => (
          <line
            key={i}
            x1={px(a, RING + 6)} y1={py(a, RING + 6)}
            x2={px(a, RC - 96)} y2={py(a, RC - 96)}
            stroke={C.beigeDeep} strokeWidth={2} strokeDasharray="3 4"
          />
        ))}
        {/* rotating ring */}
        <circle cx={CX} cy={CY} r={RING} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="2 7" />
        {/* directional arrowheads (clockwise) */}
        {MID_ANGLES.map((a, i) => {
          const x = px(a, RING);
          const y = py(a, RING);
          const rot = (Math.atan2(Math.cos(rad(a)), -Math.sin(rad(a))) * 180) / Math.PI;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
              <path d="M -5 -5 L 6 0 L -5 5 Z" fill={accent} opacity={0.9} />
            </g>
          );
        })}
      </svg>

      {/* center moat node */}
      <div
        style={{
          position: "absolute", left: CX, top: CY, transform: "translate(-50%, -50%)",
          width: 162, height: 162, borderRadius: "50%", background: C.beige,
          border: `2px solid ${accent}`, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Repeat size={18} color={accent} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: C.black, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
          {center.title}
        </div>
        <div style={{ fontSize: 9.5, color: C.gray, marginTop: 6, lineHeight: 1.4, fontWeight: 500 }}>
          {center.sub}
        </div>
      </div>

      {/* stage cards */}
      {stages.map((s, i) => {
        const a = STAGE_ANGLES[i];
        const Icon = s.icon;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: px(a, RC), top: py(a, RC),
              transform: "translate(-50%, -50%)", width: 184,
              background: C.white, border: `1px solid ${C.line}`, borderRadius: 12,
              padding: "13px 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: s.color, color: C.white, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={13} />
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.gray }}>
                STAGE {i + 1}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.black, letterSpacing: "-0.01em", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 10.5, color: C.gray, lineHeight: 1.45, marginBottom: 9 }}>
              {s.body}
            </div>
            <div style={{
              display: "inline-block", fontSize: 9.5, fontWeight: 700,
              color: s.color, background: s.tagBg, padding: "3px 7px", borderRadius: 5,
            }}>
              {s.tag}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small inline area chart                                            */
/* ------------------------------------------------------------------ */

function Curve({ points, color, fill, w = 300, h = 96 }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - ((v - min) / span) * (h - 10) - 4);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", width: "100%" }}>
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const INVESTOR_STAGES = [
  { label: "Land thin", icon: Beaker, color: C.black, tagBg: C.lineSoft,
    body: "Teams run their first eval against frontier voice models. One study, live in a day — almost no friction.",
    tag: "$0 → first REACT score in a day" },
  { label: "Usage expands", icon: Repeat, color: C.orange, tagBg: "#FFF4EA",
    body: "AutoEval runs on every commit, forever. Hyper Data orders scale. Seats and modalities multiply.",
    tag: "Net revenue retention 142%" },
  { label: "Proprietary data", icon: Database, color: C.purpleDeep, tagBg: "#F0ECFD",
    body: "κ-validated human ratings, REACT traces, regression history — a labeled voice-quality corpus no one else holds.",
    tag: "12.4M rated turns" },
  { label: "Post-train auto-raters", icon: Cpu, color: C.green, tagBg: "#EAF5EF",
    body: "We distill human judgment into automated scoring. Human-rating cost falls; gross margin climbs each cycle.",
    tag: "Gross margin 62% → 81%" },
  { label: "Stickier product", icon: Lock, color: C.purple, tagBg: "#F0ECFD",
    body: "Golden Sets become the customer's canonical asset and AutoEval lives in their CI. Leaving means starting over.",
    tag: "Logo churn < 4% / yr" },
];

const CUSTOMER_STAGES = [
  { label: "Start simple", icon: Rocket, color: C.black, tagBg: C.lineSoft,
    body: "Run one eval suite against your latest checkpoint. See a composite REACT score in minutes, not weeks.",
    tag: "Day 1" },
  { label: "Build coverage", icon: Boxes, color: C.orange, tagBg: "#FFF4EA",
    body: "Your Golden Sets grow into a canonical asset library. Commission whatever you're missing via Hyper Data.",
    tag: "Weeks 1–4" },
  { label: "Your data compounds", icon: Layers, color: C.purpleDeep, tagBg: "#F0ECFD",
    body: "Every study joins your private history. Checkpoint-over-checkpoint comparisons get richer with each run.",
    tag: "Quarter 1" },
  { label: "Evals get cheaper", icon: Gauge, color: C.green, tagBg: "#EAF5EF",
    body: "Auto-raters tuned on your data catch regressions automatically — coverage rises while your cost per eval drops.",
    tag: "Quarters 2–3" },
  { label: "Ship with confidence", icon: ShieldCheck, color: C.purple, tagBg: "#F0ECFD",
    body: "You own a domain-specific quality benchmark. Regressions are caught before release; your velocity compounds.",
    tag: "Year 1 +" },
];

const INVESTOR_CENTER = {
  title: "Compounding moat",
  sub: "Evals → Data → Auto-raters → Cheaper, better evals → More usage",
};
const CUSTOMER_CENTER = {
  title: "Your compounding edge",
  sub: "The longer you run, the more quality you own — and the harder it is to lose",
};

/* ------------------------------------------------------------------ */

function Eyebrow({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function BlockTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>{children}</div>
      {sub && <div style={{ fontSize: 12.5, color: C.gray, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ----- Investor lower content ----- */

const REVENUE_LAYERS = [
  { name: "Usage & seats", icon: Users, color: C.orange,
    price: "Metered", note: "Eval runs, rater seats, AutoEval monitors. Expands automatically with every checkpoint and commit.",
    land: "Entry motion" },
  { name: "Hyper Data", icon: Database, color: C.purpleDeep,
    price: "$0.40–$0.80 / sample", note: "Commissioned, labeled voice datasets. The primary billable surface — and the data that feeds the moat.",
    land: "Core revenue" },
  { name: "Enterprise & API", icon: CircleDollarSign, color: C.green,
    price: "Custom SLA", note: "Webhook delivery, custom rubrics, dedicated raters, and EQ Leaderboard placement.",
    land: "Expansion" },
];

const STICKY_POINTS = [
  { icon: Boxes, t: "Golden Sets lock-in", d: "Their canonical assets live with us. Re-creating them elsewhere is months of work." },
  { icon: TrendingUp, t: "Embedded in CI", d: "AutoEval gates every release. Ripping it out means flying blind on regressions." },
  { icon: Database, t: "Private history", d: "Years of κ-validated scores can't be exported into a competitor's tooling." },
  { icon: Trophy, t: "Category standard", d: "The EQ Leaderboard defines how the market is measured — we own the yardstick." },
];

function InvestorView() {
  return (
    <div>
      <div style={{ background: C.beige, borderRadius: 16, padding: "28px 24px 18px", marginBottom: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <Eyebrow>The Hume Voice EQ flywheel</Eyebrow>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: C.black, maxWidth: 560, margin: "0 auto" }}>
            A thin eval app becomes a proprietary voice-quality moat — and the moat compounds revenue.
          </div>
        </div>
        <Flywheel stages={INVESTOR_STAGES} center={INVESTOR_CENTER} accent={C.purpleDeep} />
      </div>

      {/* headline metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { v: "142%", l: "Net revenue retention", c: C.green },
          { v: "< 4%", l: "Annual logo churn", c: C.green },
          { v: "+19 pts", l: "Gross-margin expansion", c: C.purpleDeep },
          { v: "12.4M", l: "Proprietary rated turns", c: C.orange },
        ].map((m) => (
          <div key={m.l} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: m.c }}>{m.v}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* revenue layers */}
      <BlockTitle sub="Land thin, then monetize the loop. Each layer feeds the next and deepens the data advantage.">
        How the money compounds
      </BlockTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
        {REVENUE_LAYERS.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.name} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: r.color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", background: C.lineSoft, padding: "3px 8px", borderRadius: 5 }}>{r.land}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 2 }}>{r.name}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: r.color, marginBottom: 8 }}>{r.price}</div>
              <div style={{ fontSize: 11.5, color: C.gray, lineHeight: 1.5 }}>{r.note}</div>
            </div>
          );
        })}
      </div>

      {/* stickiness */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 22 }}>
          <BlockTitle sub="Switching cost rises every quarter a customer runs with us.">Why it gets sticky</BlockTitle>
          <Curve
            points={[12, 20, 31, 44, 58, 70, 82, 91]}
            color={C.purpleDeep}
            fill="#F0ECFD"
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.gray, marginTop: 6 }}>
            <span>Day 1</span><span>Switching cost over time</span><span>Year 2</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STICKY_POINTS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.t} style={{ display: "flex", gap: 12, alignItems: "flex-start", border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: C.beige, color: C.purpleDeep, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>{s.t}</div>
                  <div style={{ fontSize: 11.5, color: C.gray, lineHeight: 1.45 }}>{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----- Customer lower content ----- */

const JOURNEY = [
  { when: "Day 1", t: "First score", d: "Point us at a checkpoint, get a composite REACT score back.", color: C.black },
  { when: "Weeks 1–4", t: "Coverage", d: "Golden Sets become your asset library; commission what's missing.", color: C.orange },
  { when: "Quarter 1", t: "History", d: "Every study compounds into private, comparable score history.", color: C.purpleDeep },
  { when: "Q2–Q3", t: "Automation", d: "Auto-raters tuned on your data cut cost per eval and widen coverage.", color: C.green },
  { when: "Year 1+", t: "Benchmark", d: "You own a domain benchmark and ship with regression confidence.", color: C.purple },
];

const OWNED = [
  { icon: Boxes, t: "A growing Golden Sets library", d: "Your voices, prompts, and personas — reusable across every future eval." },
  { icon: Layers, t: "Comparable score history", d: "Every checkpoint measured the same way, so trends are real, not noise." },
  { icon: Gauge, t: "Auto-raters tuned to you", d: "Automated scoring that mirrors your raters — coverage without the headcount." },
  { icon: Trophy, t: "A defensible quality bar", d: "A benchmark the rest of your org and market trusts." },
];

function CustomerView() {
  return (
    <div>
      <div style={{ background: C.beige, borderRadius: 16, padding: "28px 24px 18px", marginBottom: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <Eyebrow>Your journey with Voice EQ</Eyebrow>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: C.black, maxWidth: 560, margin: "0 auto" }}>
            Start with one eval. Every study after that makes the next one cheaper, sharper, and more yours.
          </div>
        </div>
        <Flywheel stages={CUSTOMER_STAGES} center={CUSTOMER_CENTER} accent={C.green} />
      </div>

      {/* journey timeline */}
      <BlockTitle sub="The same loop, from your side of the table — value accrues at every turn.">
        How value accrues on your journey
      </BlockTitle>
      <div style={{ position: "relative", marginBottom: 36 }}>
        <div style={{ position: "absolute", top: 13, left: "10%", right: "10%", height: 2, background: C.beigeDeep }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, position: "relative" }}>
          {JOURNEY.map((j) => (
            <div key={j.when} style={{ textAlign: "center", padding: "0 4px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: j.color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 12, fontWeight: 700, boxShadow: `0 0 0 4px ${C.white}` }}>
                ✦
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: j.color, textTransform: "uppercase", marginBottom: 4 }}>{j.when}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 4 }}>{j.t}</div>
              <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.45 }}>{j.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* value curve + owned */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 22 }}>
          <BlockTitle sub="Coverage compounds up while your cost per eval falls.">The accrual curve</BlockTitle>
          <Curve points={[10, 18, 30, 45, 60, 73, 84, 93]} color={C.green} fill="#EAF5EF" />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, fontSize: 11, color: C.gray }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: C.green, display: "inline-block" }} /> Eval coverage you own
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowRight size={12} /> Cost per eval falls with every cycle
            </span>
          </div>
        </div>
        <div>
          <BlockTitle>What you own that grows</BlockTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {OWNED.map((o) => {
              const Icon = o.icon;
              return (
                <div key={o.t} style={{ display: "flex", gap: 12, alignItems: "flex-start", border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "#EAF5EF", color: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>{o.t}</div>
                    <div style={{ fontSize: 11.5, color: C.gray, lineHeight: 1.45 }}>{o.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Flywheel_Page() {
  const [view, setView] = useState("investor");

  return (
    <div style={{ maxWidth: 980 }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>
        <div>
          <Eyebrow>Strategy</Eyebrow>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>Moat Flywheel</div>
          <div style={{ fontSize: 13, color: C.gray, marginTop: 6, maxWidth: 620 }}>
            Thin wrapper to deeper moat — how a fast eval app turns early traction into compounding defensibility.
          </div>
        </div>

        {/* segmented toggle */}
        <div style={{ display: "inline-flex", background: C.beige, border: `1px solid ${C.beigeDeep}`, borderRadius: 9, padding: 3 }}>
          {[
            { id: "investor", label: "Investor view" },
            { id: "customer", label: "Customer view" },
          ].map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                style={{
                  padding: "8px 16px", border: "none", borderRadius: 7, cursor: "pointer",
                  fontFamily: FONT, fontSize: 12.5, fontWeight: active ? 700 : 600,
                  background: active ? C.white : "transparent",
                  color: active ? C.black : C.gray,
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  transition: "background .12s, color .12s",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* framing line */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {["Start thin", "Compound deep", "Win long-term"].map((s, i) => (
          <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: i === 2 ? (view === "investor" ? C.purpleDeep : C.green) : C.gray }}>
              {s}
            </span>
            {i < 2 && <ArrowRight size={13} color={C.grayLight} />}
          </span>
        ))}
      </div>

      {view === "investor" ? <InvestorView /> : <CustomerView />}
    </div>
  );
}

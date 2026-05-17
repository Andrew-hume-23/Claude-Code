import { useState, Fragment } from "react";
import {
  Play, Plus, ChevronRight, Sparkles, X, Upload, Cloud, Link2, Folder,
  ListFilter, Database, ArrowLeft, FileJson, Save, Edit3, Send, ArrowUpRight,
} from "lucide-react";
import { C, FONT } from "../tokens";
import { EMOTIONS, DATASETS, SAMPLE, AGGREGATE, BIG_FIVE, INDUCTION } from "../mock/emotions";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import StatusPill from "../ui/StatusPill";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Drawer from "../ui/Drawer";
import DrawerHeader from "../ui/DrawerHeader";

export default function LabelData() {
  const [view, setView] = useState("list");
  const [activeDataset, setActiveDataset] = useState(null);
  const [connectOpen, setConnectOpen] = useState(false);

  if (view === "explore") {
    return <SampleExplorer datasetId={activeDataset} onBack={() => setView("list")} />;
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Emotionally label your data"
        title="Label Data"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={ListFilter}>Filter</Button>
            <Button primary icon={Plus} onClick={() => setConnectOpen(true)}>Connect data</Button>
          </div>
        }
      />

      <div style={{ background: C.beige, borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles size={16} color={C.orange} />
        <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
          Point Hume at your audio. We run <strong>Octave-Tagger</strong> across every segment, return emotional labels, paralinguistic tags, arousal/valence, and speaker-level metadata. You annotate from there.
        </div>
      </div>

      <DatasetsList datasets={DATASETS} onOpen={(id) => { setActiveDataset(id); setView("explore"); }} />

      {connectOpen && <ConnectDataModal onClose={() => setConnectOpen(false)} />}
    </div>
  );
}

function DatasetsList({ datasets, onOpen }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {datasets.map(d => (
        <div key={d.id} onClick={() => onOpen(d.id)}
          style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18, cursor: "pointer", transition: "border-color .15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.black}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 100px", gap: 16, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 4 }}>{d.name}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", color: C.gray, background: C.lineSoft, padding: "2px 6px", borderRadius: 3 }}>{d.tagger}</span>
                {d.lang.map(l => (
                  <span key={l} style={{ fontSize: 9, fontWeight: 600, color: C.gray, background: C.lineSoft, padding: "2px 5px", borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>{l}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 2 }}>Samples</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>{d.samples.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{d.hours} hours</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Labeled</div>
              <div style={{ height: 6, background: C.lineSoft, borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${(d.labeled / d.samples) * 100}%`, background: d.status === "labeled" ? C.green : d.status === "labeling" ? C.purpleDeep : C.grayLight }} />
              </div>
              <div style={{ fontSize: 11, color: C.gray }}>{d.labeled.toLocaleString()} / {d.samples.toLocaleString()}</div>
            </div>
            <div>
              <StatusPill status={d.status === "labeled" ? "complete" : d.status === "labeling" ? "running" : "queued"} />
              <div style={{ fontSize: 10, color: C.gray, marginTop: 4 }}>{d.updated}</div>
            </div>
            <ChevronRight size={18} color={C.grayLight} style={{ justifySelf: "end" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConnectDataModal({ onClose }) {
  const [method, setMethod] = useState("upload");
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.4)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 560, maxWidth: "92vw", background: C.white, borderRadius: 12, zIndex: 51, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: FONT, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>New dataset</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>Point Hume at your data</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: "none", background: C.lineSoft, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color={C.gray} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>Source</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
            {[
              { id: "upload", label: "Upload",  sub: "Audio files",      icon: Upload },
              { id: "s3",     label: "S3 / GCS", sub: "Bucket URI",      icon: Cloud  },
              { id: "api",    label: "Webhook",  sub: "Stream endpoint",  icon: Link2  },
            ].map(m => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  style={{ padding: 14, border: `2px solid ${active ? C.black : C.line}`, background: active ? C.beige : C.white, borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: FONT }}>
                  <Icon size={16} color={C.black} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginTop: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{m.sub}</div>
                </button>
              );
            })}
          </div>

          {method === "upload" && (
            <div style={{ padding: 32, border: `2px dashed ${C.line}`, borderRadius: 8, textAlign: "center", marginBottom: 16 }}>
              <Folder size={28} color={C.gray} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>Drop audio files here</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>.wav, .mp3, .m4a, .flac · up to 5GB</div>
            </div>
          )}
          {method === "s3" && (
            <div style={{ marginBottom: 16 }}>
              <Input placeholder="s3://bucket-name/path/to/audio/" onChange={() => {}} value="" />
            </div>
          )}
          {method === "api" && (
            <div style={{ marginBottom: 16 }}>
              <Input placeholder="https://your-api.com/audio/stream" onChange={() => {}} value="" />
            </div>
          )}

          <Field label="Tagger model" hint="The Hume model used to label this data">
            <select style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, color: C.black, outline: "none", background: C.white }}>
              <option>Octave-Tagger v2.1 (latest · 605-tag vocab)</option>
              <option>Octave-Tagger v2.0 (stable)</option>
              <option>REACT-only (5-dim, lighter)</option>
            </select>
          </Field>
        </div>

        <div style={{ borderTop: `1px solid ${C.line}`, padding: "14px 24px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", color: C.black }}>Cancel</button>
          <button style={{ background: C.black, color: C.white, border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Start labeling <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </>
  );
}

function SampleExplorer({ datasetId, onBack }) {
  const [tab, setTab] = useState("room");
  const [heatmapMode, setHeatmapMode] = useState("heatmap");
  const [schemaOpen, setSchemaOpen] = useState(false);
  const dataset = DATASETS.find(d => d.id === datasetId);

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", padding: 0, fontSize: 12, fontFamily: FONT, color: C.gray, cursor: "pointer", marginBottom: 8 }}>
          <ArrowLeft size={12} /> {dataset?.name || "Datasets"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${C.line}`, paddingBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Sample</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.black, letterSpacing: "-0.02em", fontFamily: "ui-monospace, monospace" }}>{SAMPLE.shortId}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={FileJson} onClick={() => setSchemaOpen(true)}>Response schema</Button>
            <Button icon={Save}>Export labels</Button>
            <Button primary icon={Edit3}>Annotate</Button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, marginBottom: 20 }}>
        {[
          { id: "room",      label: "Sample view",    sub: "One conversation, deeply labeled" },
          { id: "aggregate", label: "Aggregate view", sub: "Statistics across the dataset" },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "12px 18px", background: "transparent", border: "none", borderBottom: `2px solid ${active ? C.black : "transparent"}`, marginBottom: -1, fontFamily: FONT, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.black : C.gray, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span>{t.label}</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: active ? C.gray : C.grayLight }}>{t.sub}</span>
            </button>
          );
        })}
      </div>

      {tab === "room" ? <SampleRoomView heatmapMode={heatmapMode} setHeatmapMode={setHeatmapMode} /> : <AggregateViewV2 />}

      <Drawer open={schemaOpen} onClose={() => setSchemaOpen(false)}>
        <APISchemaDrawer onClose={() => setSchemaOpen(false)} />
      </Drawer>
    </div>
  );
}

function SampleRoomView({ heatmapMode, setHeatmapMode }) {
  const [selectedSegment, setSelectedSegment] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SampleMetaCard />
      <PlayerWithRadars />
      <SpeechTimeline selectedSegment={selectedSegment} setSelectedSegment={setSelectedSegment} />
      <EmotionHeatmapBlock heatmapMode={heatmapMode} setHeatmapMode={setHeatmapMode} />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <TranscriptPanel />
        <SidePanels />
      </div>
      <AnnotationPanel selectedSegment={selectedSegment} setSelectedSegment={setSelectedSegment} />
    </div>
  );
}

function SampleMetaCard() {
  const L = SAMPLE.speakers.L;
  const R = SAMPLE.speakers.R;
  const totalDur = L.durationS + R.durationS;
  const lPct = (L.durationS / totalDur) * 100;

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>split: {SAMPLE.split}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>lang: {SAMPLE.lang}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{Math.floor(SAMPLE.duration / 60)}m {SAMPLE.duration % 60}s</span>
      </div>

      <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5, marginBottom: 14 }}>{SAMPLE.description}</div>

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>Speaker balance</div>
      <div style={{ display: "flex", height: 22, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
        <div style={{ width: `${lPct}%`, background: L.color, color: C.white, fontSize: 11, fontWeight: 600, padding: "4px 8px", boxSizing: "border-box" }}>L {Math.round(lPct)}% · {L.durationS}s</div>
        <div style={{ flex: 1, background: R.color, color: C.white, fontSize: 11, fontWeight: 600, padding: "4px 8px", textAlign: "right", boxSizing: "border-box" }}>R {Math.round(100 - lPct)}% · {R.durationS}s</div>
      </div>
      <div style={{ fontSize: 11, color: C.gray, marginBottom: 10 }}>
        {SAMPLE.events.total} events ({(SAMPLE.events.total / (SAMPLE.duration / 60)).toFixed(2)}/min) · switch: {SAMPLE.events.switches} · overlap: {SAMPLE.events.overlaps} · interruption: {SAMPLE.events.interruptions}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(59,130,196,0.12)", borderRadius: 4, fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: L.color }} /><strong style={{ color: C.black }}>Left</strong> · {L.gender} · {L.origin}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(168,107,219,0.12)", borderRadius: 4, fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: R.color }} /><strong style={{ color: C.black }}>Right</strong> · {R.gender} · {R.origin}
        </span>
      </div>
    </div>
  );
}

function PlayerWithRadars() {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 180px", gap: 18, alignItems: "center" }}>
        <EmotionRadar values={SAMPLE.radar.L} accent={SAMPLE.speakers.L.color} label="L" />
        <div style={{ background: C.black, borderRadius: 8, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", position: "relative" }}>
          <Play size={32} color="#fff" />
          <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "ui-monospace, monospace" }}>22:07 / 1:14:40</div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.15)" }}>
            <div style={{ height: "100%", width: "29%", background: C.purple }} />
          </div>
        </div>
        <EmotionRadar values={SAMPLE.radar.R} accent={SAMPLE.speakers.R.color} label="R" />
      </div>
    </div>
  );
}

function EmotionRadar({ values, accent, label }) {
  const size = 170, cx = size / 2, cy = size / 2, r = 55, n = EMOTIONS.length;

  const polarToXY = (angle, dist) => {
    const a = angle - Math.PI / 2;
    return [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
  };

  const points = EMOTIONS.map((e, i) => polarToXY((i / n) * Math.PI * 2, r * (values[e.id] || 0)));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 4, left: 4, fontSize: 10, color: C.gray, fontWeight: 700 }}>{label}</div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {[0.33, 0.66, 1].map((s, i) => <circle key={i} cx={cx} cy={cy} r={r * s} fill="none" stroke={C.line} strokeWidth="0.5" />)}
        {EMOTIONS.map((e, i) => {
          const [x, y] = polarToXY((i / n) * Math.PI * 2, r);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.lineSoft} strokeWidth="0.5" />;
        })}
        <path d={path} fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        {EMOTIONS.map((e, i) => {
          const [x, y] = polarToXY((i / n) * Math.PI * 2, r + 12);
          return <text key={i} x={x} y={y} fill={e.color} fontSize="8" fontFamily={FONT} fontWeight="600" textAnchor="middle" dominantBaseline="middle">{e.label}</text>;
        })}
      </svg>
    </div>
  );
}

function SpeechTimeline({ selectedSegment, setSelectedSegment }) {
  const maxT = 60;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Speech activity · colored by dominant emotion</div>
          <div style={{ fontSize: 10, color: C.gray }}>click a segment to annotate it · row 1: speaker active · rows 2–3: per-speaker view</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: "60%" }}>
          {EMOTIONS.map(e => (
            <span key={e.id} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, color: C.gray }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
              {e.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", height: 22, background: C.lineSoft, borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
        {SAMPLE.timeline.map((seg, i) => {
          const e = EMOTIONS.find(em => em.id === seg.emo);
          const isSelected = selectedSegment === i;
          return (
            <div key={i} onClick={() => setSelectedSegment(isSelected ? null : i)}
              style={{ position: "absolute", top: 0, bottom: 0, left: `${(seg.start / maxT) * 100}%`, width: `${((seg.end - seg.start) / maxT) * 100}%`, background: e.color, cursor: "pointer", outline: isSelected ? `2px solid ${C.black}` : "none", outlineOffset: -1, zIndex: isSelected ? 2 : 1 }}
              title={`${seg.speaker} · ${seg.emo} · ${seg.start.toFixed(1)}s–${seg.end.toFixed(1)}s`}
            />
          );
        })}
      </div>

      {["L", "R"].map(sp => (
        <div key={sp} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.gray, width: 12 }}>{sp}</span>
          <div style={{ position: "relative", height: 14, flex: 1, background: C.lineSoft, borderRadius: 2, overflow: "hidden" }}>
            {SAMPLE.timeline.filter(s => s.speaker === sp).map((seg, i) => {
              const e = EMOTIONS.find(em => em.id === seg.emo);
              return <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${(seg.start / maxT) * 100}%`, width: `${((seg.end - seg.start) / maxT) * 100}%`, background: e.color, opacity: 0.85 }} />;
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.gray, marginTop: 6, paddingLeft: 20 }}>
        <span>0s</span><span>15s</span><span>30s</span><span>45s</span><span>60s</span>
      </div>
    </div>
  );
}

function EmotionHeatmapBlock({ heatmapMode, setHeatmapMode }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>Emotion intensity over time · per speaker</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "stacked", label: "Stacked area" }, { id: "heatmap", label: "Heatmap" }, { id: "top3", label: "Top-3 lines" }].map(m => {
            const active = heatmapMode === m.id;
            return (
              <button key={m.id} onClick={() => setHeatmapMode(m.id)}
                style={{ padding: "4px 10px", background: active ? C.black : C.white, color: active ? C.white : C.gray, border: `1px solid ${active ? C.black : C.line}`, borderRadius: 4, fontSize: 11, fontFamily: FONT, fontWeight: 600, cursor: "pointer" }}>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {["L", "R"].map(sp => (
        <div key={sp} style={{ marginBottom: sp === "L" ? 16 : 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>Influence · {sp === "L" ? "Left" : "Right"}</div>
          <Heatmap data={SAMPLE.heatmap[sp]} />
        </div>
      ))}
    </div>
  );
}

function Heatmap({ data }) {
  const cellH = 14;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 32px", gap: 4, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {EMOTIONS.map(e => (
          <div key={e.id} style={{ height: cellH, fontSize: 9, color: C.gray, lineHeight: `${cellH}px`, textAlign: "right", paddingRight: 6 }}>{e.label}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {data.map((row, i) => (
          <div key={i} style={{ display: "flex", height: cellH, gap: 1 }}>
            {row.map((v, j) => (
              <div key={j} style={{ flex: 1, background: viridisColor(Math.min(1, Math.max(0, v))), opacity: 0.92 }} title={v.toFixed(2)} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 8, color: C.gray, paddingLeft: 4, paddingTop: 2, paddingBottom: 2 }}>
        <span>1.0</span>
        <div style={{ flex: 1, width: 6, background: "linear-gradient(to bottom, #FDE725, #5DC863, #21908C, #3B528B, #440154)", margin: "2px 0" }} />
        <span>0</span>
      </div>
    </div>
  );
}

function viridisColor(v) {
  const stops = [
    [0.00, [68, 1, 84]],
    [0.25, [59, 82, 139]],
    [0.50, [33, 144, 140]],
    [0.75, [93, 200, 99]],
    [1.00, [253, 231, 37]],
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i][0] && v <= stops[i + 1][0]) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const t = (v - lo[0]) / (hi[0] - lo[0] || 1);
  return `rgb(${Math.round(lo[1][0] + (hi[1][0] - lo[1][0]) * t)},${Math.round(lo[1][1] + (hi[1][1] - lo[1][1]) * t)},${Math.round(lo[1][2] + (hi[1][2] - lo[1][2]) * t)})`;
}

function TranscriptPanel() {
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState(2);
  const filtered = SAMPLE.transcript.filter(t => !filter || t.text.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>Transcript</div>
        <span style={{ fontSize: 10, color: C.gray, fontFamily: "ui-monospace, monospace" }}>22:07</span>
      </div>
      <Input value={filter} onChange={setFilter} placeholder="filter transcript…" />
      <div style={{ fontSize: 10, color: C.gray, marginTop: 4, marginBottom: 10 }}>click a row to seek · active row follows playback</div>
      <div style={{ maxHeight: 380, overflowY: "auto", border: `1px solid ${C.lineSoft}`, borderRadius: 6 }}>
        {filtered.map(t => {
          const sp = SAMPLE.speakers[t.speaker];
          const isActive = t.id === active;
          return (
            <div key={t.id} onClick={() => setActive(t.id)}
              style={{ padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${C.lineSoft}`, background: isActive ? "#FFF6D6" : t.speaker === "L" ? "rgba(59,130,196,0.06)" : "rgba(168,107,219,0.06)", display: "grid", gridTemplateColumns: "16px 50px 1fr", gap: 8, alignItems: "start" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: sp.color }}>{t.speaker}</span>
              <span style={{ fontSize: 10, color: C.gray, fontFamily: "ui-monospace, monospace" }}>{formatTime(t.t)}</span>
              <span style={{ fontSize: 12, color: C.black, lineHeight: 1.5 }}>{t.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, "0")}`;
}

function SidePanels() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TopTagsBars />
      <ArousalValenceScatter />
      <BigFivePanel />
      <InductionMatrix />
    </div>
  );
}

function TopTagsBars() {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Top tags · per speaker</div>
      <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>left bars = left speaker · right bars = right · sorted by peak · from 605-tag affect vocab</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SAMPLE.topTags.map(tag => (
          <div key={tag.tag} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 2, alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ height: 14, width: `${tag.L * 100}%`, background: SAMPLE.speakers.L.color, borderRadius: "2px 0 0 2px", display: "flex", alignItems: "center", justifyContent: "flex-end", color: C.white, fontSize: 9, fontWeight: 700, padding: "0 4px" }}>{tag.L.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: C.black }}>{tag.tag}</div>
            <div style={{ display: "flex" }}>
              <div style={{ height: 14, width: `${tag.R * 100}%`, background: SAMPLE.speakers.R.color, borderRadius: "0 2px 2px 0", display: "flex", alignItems: "center", color: C.white, fontSize: 9, fontWeight: 700, padding: "0 4px" }}>{tag.R.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArousalValenceScatter() {
  const W = 260, H = 220, pad = 30;
  const xToPx = (x) => pad + ((x + 1) / 2) * (W - pad * 2);
  const yToPx = (y) => H - pad - ((y + 1) / 2) * (H - pad * 2);

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Arousal × Valence</div>
      <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>each bubble = one segment · axes from Hume affect model</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <line x1={xToPx(0)} y1={pad} x2={xToPx(0)} y2={H - pad} stroke={C.line} strokeWidth="1" />
        <line x1={pad} y1={yToPx(0)} x2={W - pad} y2={yToPx(0)} stroke={C.line} strokeWidth="1" />
        {[-1, -0.5, 0.5, 1].map(t => (
          <g key={t}>
            <line x1={xToPx(t)} y1={pad} x2={xToPx(t)} y2={H - pad} stroke={C.lineSoft} strokeWidth="0.5" />
            <line x1={pad} y1={yToPx(t)} x2={W - pad} y2={yToPx(t)} stroke={C.lineSoft} strokeWidth="0.5" />
          </g>
        ))}
        {SAMPLE.scatter.map((pt, i) => (
          <circle key={i} cx={xToPx(pt.valence)} cy={yToPx(pt.arousal)} r={pt.size / 2}
            fill={pt.speaker === "L" ? SAMPLE.speakers.L.color : SAMPLE.speakers.R.color} fillOpacity="0.45"
            stroke={pt.speaker === "L" ? SAMPLE.speakers.L.color : SAMPLE.speakers.R.color} strokeWidth="1" />
        ))}
        <text x={W - pad} y={yToPx(0) - 4} fontSize="8" fill={C.gray} textAnchor="end">valence →</text>
        <text x={xToPx(0) + 4} y={pad + 8} fontSize="8" fill={C.gray}>↑ arousal</text>
        <text x={pad} y={pad + 8} fontSize="8" fill={C.gray}>high-arousal neg.</text>
        <text x={W - pad} y={pad + 8} fontSize="8" fill={C.gray} textAnchor="end">high-arousal pos.</text>
        <text x={pad} y={H - pad - 4} fontSize="8" fill={C.gray}>low-arousal neg.</text>
        <text x={W - pad} y={H - pad - 4} fontSize="8" fill={C.gray} textAnchor="end">low-arousal pos.</text>
      </svg>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: SAMPLE.speakers.L.color, opacity: 0.5 }} /> Left
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: SAMPLE.speakers.R.color, opacity: 0.5 }} /> Right
        </span>
      </div>
    </div>
  );
}

function BigFivePanel() {
  const size = 200, cx = size / 2, cy = size / 2, r = 60, n = BIG_FIVE.axes.length;
  const polar = (i, dist) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
  };
  const buildPath = (data) =>
    BIG_FIVE.axes.map((ax, i) => {
      const [x, y] = polar(i, r * ((data[ax] - 1) / 6));
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Big Five · L vs R</div>
      <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>1–7 self-report · outer = higher · paper fig. 2</div>
      <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {[0.33, 0.66, 1].map((s, i) => <circle key={i} cx={cx} cy={cy} r={r * s} fill="none" stroke={C.line} strokeWidth="0.5" />)}
        {BIG_FIVE.axes.map((ax, i) => {
          const [x, y] = polar(i, r);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.lineSoft} strokeWidth="0.5" />;
        })}
        <path d={buildPath(BIG_FIVE.L)} fill={SAMPLE.speakers.L.color} fillOpacity="0.25" stroke={SAMPLE.speakers.L.color} strokeWidth="1.5" />
        <path d={buildPath(BIG_FIVE.R)} fill={SAMPLE.speakers.R.color} fillOpacity="0.25" stroke={SAMPLE.speakers.R.color} strokeWidth="1.5" />
        {BIG_FIVE.axes.map((ax, i) => {
          const [x, y] = polar(i, r + 14);
          return <text key={i} x={x} y={y} fontSize="8" fill={C.gray} fontFamily={FONT} fontWeight="600" textAnchor="middle" dominantBaseline="middle">{ax}</text>;
        })}
      </svg>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
          <span style={{ width: 10, height: 2, background: SAMPLE.speakers.L.color }} /> Left (F)
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.gray }}>
          <span style={{ width: 10, height: 2, background: SAMPLE.speakers.R.color }} /> Right (M)
        </span>
      </div>
    </div>
  );
}

function InductionMatrix() {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Emotion induction · L → R</div>
      <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>rows: speaker L's emotion · columns: speaker R's next emotion · red induces, blue suppresses</div>
      <div style={{ display: "grid", gridTemplateColumns: `60px repeat(${EMOTIONS.length}, 1fr)`, gap: 1 }}>
        <div />
        {EMOTIONS.map(e => (
          <div key={e.id} style={{ fontSize: 7, color: C.gray, transform: "rotate(-50deg)", transformOrigin: "left bottom", whiteSpace: "nowrap", height: 50, paddingLeft: 2 }}>{e.label}</div>
        ))}
        {EMOTIONS.map(eA => (
          <Fragment key={eA.id}>
            <div style={{ fontSize: 8, color: C.gray, textAlign: "right", paddingRight: 4, lineHeight: "16px" }}>{eA.label}</div>
            {EMOTIONS.map(eB => {
              const v = INDUCTION[eA.id][eB.id];
              const bg = v > 0 ? `rgba(216,107,107,${Math.abs(v) * 1.5})` : `rgba(59,130,196,${Math.abs(v) * 1.5})`;
              return <div key={eB.id} title={`${eA.label} → ${eB.label}: ${v.toFixed(2)}`} style={{ height: 16, background: bg, borderRadius: 1 }} />;
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function AnnotationPanel({ selectedSegment, setSelectedSegment }) {
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState(["customer-friendly", "needs-review"]);
  const [tagInput, setTagInput] = useState("");
  const [scope, setScope] = useState("sample");

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags(t => [...t, tagInput.trim()]);
    setTagInput("");
  };

  const seg = selectedSegment !== null ? SAMPLE.timeline[selectedSegment] : null;
  const emo = seg ? EMOTIONS.find(e => e.id === seg.emo) : null;

  return (
    <div style={{ background: "#FAFAFE", border: `2px solid ${C.purple}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Annotate this sample</div>
          <div style={{ fontSize: 11, color: C.gray }}>Layer your labels on top of Hume's. All annotations export with the dataset.</div>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 3, background: C.white, borderRadius: 6, border: `1px solid ${C.line}` }}>
          {[{ id: "sample", label: "Whole sample" }, { id: "segment", label: "Per segment" }, { id: "speaker", label: "Per speaker" }].map(s => {
            const active = scope === s.id;
            return (
              <button key={s.id} onClick={() => setScope(s.id)}
                style={{ padding: "5px 10px", background: active ? C.black : "transparent", color: active ? C.white : C.gray, border: "none", borderRadius: 4, fontSize: 11, fontFamily: FONT, fontWeight: 600, cursor: "pointer" }}>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {scope === "segment" && (
        <div style={{ marginBottom: 14, padding: 10, background: C.white, borderRadius: 6, border: `1px solid ${seg && emo ? emo.color : C.line}`, display: "flex", alignItems: "center", gap: 10 }}>
          {seg && emo ? (
            <>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: emo.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.black }}>
                  Segment {selectedSegment + 1} · speaker {seg.speaker} · {emo.label}
                </div>
                <div style={{ fontSize: 10, color: C.gray, fontFamily: "ui-monospace, monospace" }}>
                  {seg.start.toFixed(1)}s — {seg.end.toFixed(1)}s · duration {(seg.end - seg.start).toFixed(1)}s
                </div>
              </div>
              <button onClick={() => setSelectedSegment(null)} style={{ background: "transparent", border: `1px solid ${C.line}`, borderRadius: 4, padding: "3px 8px", fontSize: 10, fontFamily: FONT, color: C.gray, cursor: "pointer" }}>Clear</button>
            </>
          ) : (
            <div style={{ fontSize: 11, color: C.gray, fontStyle: "italic" }}>Click any segment in the speech timeline above to annotate it.</div>
          )}
        </div>
      )}

      {scope === "speaker" && (
        <div style={{ marginBottom: 14, padding: 10, background: C.white, borderRadius: 6, border: `1px solid ${C.line}`, display: "flex", gap: 8 }}>
          <div style={{ fontSize: 11, color: C.gray, marginRight: 8, alignSelf: "center" }}>Annotating:</div>
          {["L", "R"].map(s => (
            <button key={s} style={{ padding: "4px 10px", background: s === "L" ? "rgba(59,130,196,0.12)" : "rgba(168,107,219,0.12)", border: `1px solid ${SAMPLE.speakers[s].color}`, borderRadius: 4, fontSize: 11, fontFamily: FONT, fontWeight: 600, color: C.black, cursor: "pointer" }}>
              {SAMPLE.speakers[s].label} · {SAMPLE.speakers[s].gender}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Custom labels</div>
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 6, padding: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", minHeight: 70 }}>
            {tags.map((t, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", background: C.purple, color: C.black, borderRadius: 4 }}>
                {t}
                <X size={11} style={{ cursor: "pointer" }} onClick={() => setTags(ts => ts.filter((_, ix) => ix !== i))} />
              </span>
            ))}
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addTag(); }}
              placeholder="Add label + Enter"
              style={{ flex: 1, minWidth: 120, border: "none", background: "transparent", fontSize: 11, fontFamily: FONT, color: C.black, outline: "none", padding: 2 }} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
          <Textarea value={notes} onChange={setNotes} rows={3} placeholder="Free-text notes…" />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.purple}` }}>
        <div style={{ fontSize: 11, color: C.gray }}>3 annotators on this sample · last edit 14m ago</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={Save}>Save draft</Button>
          <Button primary icon={Send}>Submit annotation</Button>
        </div>
      </div>
    </div>
  );
}

function AggregateViewV2() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Emotion distribution · whole dataset</div>
          <div style={{ fontSize: 10, color: C.gray }}>12,847 samples · share of dominant-emotion segments</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AGGREGATE.emotionDistribution.map(d => {
            const e = EMOTIONS.find(em => em.id === d.emo);
            return (
              <div key={d.emo} style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.black, fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} />{d.emo}
                </div>
                <div style={{ height: 18, background: C.lineSoft, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.share * 100 * 4}%`, background: e.color, opacity: 0.85 }} />
                </div>
                <div style={{ fontSize: 11, color: C.gray, textAlign: "right" }}>
                  <strong style={{ color: C.black }}>{(d.share * 100).toFixed(1)}%</strong> · {d.samples.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Language", data: AGGREGATE.demographics.language },
          { label: "Gender",   data: AGGREGATE.demographics.gender },
          { label: "Region",   data: AGGREGATE.demographics.region },
        ].map((d, i) => {
          const total = d.data.reduce((a, b) => a + b.v, 0);
          const colors = [C.purpleDeep, C.orange, C.green, C.beigeDeep];
          return (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>{d.label}</div>
              <div style={{ display: "flex", height: 12, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                {d.data.map((seg, j) => (
                  <div key={j} title={`${seg.k}: ${seg.v}`} style={{ flex: seg.v, background: colors[j % colors.length] }} />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {d.data.map((seg, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[j % colors.length] }} />
                    <span style={{ color: C.ink, flex: 1 }}>{seg.k}</span>
                    <span style={{ color: C.gray }}>{((seg.v / total) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Outlier samples · review queue</div>
          <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>Highest anomaly scores from the dataset. May indicate edge cases, data quality, or interesting patterns.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {AGGREGATE.outliers.map(o => (
              <div key={o.id} style={{ display: "grid", gridTemplateColumns: "70px 1fr 60px", gap: 10, alignItems: "center", padding: "8px 10px", border: `1px solid ${C.lineSoft}`, borderRadius: 6, cursor: "pointer" }}>
                <div style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", color: C.gray }}>{o.id}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.black }}>{o.reason}</div>
                  <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{o.dom}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, textAlign: "right" }}>{o.score.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 2 }}>Tagger confidence</div>
          <div style={{ fontSize: 10, color: C.gray, marginBottom: 12 }}>Per-segment max softmax over emotion vocab.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {AGGREGATE.confidence.map(c => {
              const max = Math.max(...AGGREGATE.confidence.map(x => x.count));
              return (
                <div key={c.bin} style={{ display: "grid", gridTemplateColumns: "50px 1fr 60px", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: C.gray, fontFamily: "ui-monospace, monospace", textAlign: "right" }}>{c.bin}</span>
                  <div style={{ height: 16, background: C.lineSoft, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.count / max) * 100}%`, background: c.bin.startsWith(">") ? C.green : c.bin.startsWith("<") ? C.red : C.purpleDeep }} />
                  </div>
                  <span style={{ fontSize: 10, color: C.gray, textAlign: "right" }}>{c.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function APISchemaDrawer({ onClose }) {
  const sample = {
    sample_id: "RM02ce9e0ad086c5a7ca6f43d5b425d352",
    tagger: { model: "Octave-Tagger", version: "2.1", vocab_size: 605 },
    duration_s: 4482,
    languages: ["EN-US"],
    speakers: [
      { id: "L", demographics: { gender: "female", age_range: "30-40", origin: "Netherlands" }, duration_s: 1456, word_count: 3908 },
      { id: "R", demographics: { gender: "male",   age_range: "40-50", origin: "Portugal"    }, duration_s: 2542, word_count: 6385 },
    ],
    segments: [{
      id: 142, speaker: "L", start_s: 22.1, end_s: 28.4,
      text: "Sure — last year I went to Asia for the first time…",
      emotions: { joy: 0.71, amusement: 0.62, curiosity: 0.68 },
      tags: ["expressive", "warmth", "amusement"],
      arousal: 0.62, valence: 0.51, confidence: 0.94,
    }],
    aggregates: { dominant_emotion: "joy", arousal_mean: 0.34, valence_mean: 0.21, react: { resonance: 0.84, empathy: 0.79, attunement: 0.81, coherence: 0.88, trust: 0.86 } },
  };

  return (
    <div>
      <DrawerHeader eyebrow="API response · per sample" title="Schema" subtitle="What POST /v1/label-data returns for each labeled sample" onClose={onClose} />
      <div style={{ padding: 28 }}>
        <div style={{ background: C.beige, borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 11, color: C.ink, lineHeight: 1.5 }}>
          Full structured output. Per-segment emotional labels, paralinguistic tags, arousal/valence, REACT aggregates. Stream via webhook or fetch with the sample ID.
        </div>
        <pre style={{ background: C.black, color: "#E8E8E8", padding: 18, borderRadius: 8, fontSize: 11, lineHeight: 1.6, fontFamily: "ui-monospace, monospace", overflow: "auto", margin: 0 }}>
{JSON.stringify(sample, null, 2)}
        </pre>
      </div>
    </div>
  );
}

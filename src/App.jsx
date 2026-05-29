import { useState } from "react";
import { LayoutGrid, Beaker, Users, Columns, Code, Filter, Globe, Mic, Headphones, MessageSquare, Database, Boxes, Activity, Sparkles, Trophy } from "lucide-react";
import { C, FONT } from "./tokens";
import Overview from "./pages/Overview";
import Studies from "./pages/Studies";
import StudyRunner from "./pages/StudyRunner";
import Switchboard from "./pages/Switchboard";
import LabelData from "./pages/LabelData";
import GoldenSets from "./pages/GoldenSets";
import AutoEval from "./pages/AutoEval";
import HyperData from "./pages/HyperData";
import Leaderboard from "./pages/Leaderboard";
import API from "./pages/API";
import RunDetail from "./overlays/RunDetail";
import CheckpointHistory from "./overlays/CheckpointHistory";
import ScenarioAuthoring from "./overlays/ScenarioAuthoring";
import RaterTask from "./overlays/RaterTask";
import Drawer from "./ui/Drawer";

// Each item is either a section divider { section: "..." } or a nav item { id, label, icon }
const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { section: "BUILD" },
  { id: "goldensets",  label: "Golden Sets",     icon: Boxes },
  { id: "hyperdata",   label: "Hyper Data",      icon: Sparkles },
  { id: "labeldata",   label: "Data Explorer",   icon: Database },
  { section: "MEASURE" },
  { id: "studyrunner", label: "Human Ratings",   icon: Users },
  { id: "studies",     label: "Eval Suite",      icon: Beaker },
  { id: "switchboard", label: "Switchboard",     icon: Columns },
  { section: "OBSERVE" },
  { id: "autoeval",    label: "AutoEval",        icon: Activity },
  { id: "leaderboard", label: "EQ Leaderboard",  icon: Trophy },
  { section: "" },
  { id: "api",         label: "API",             icon: Code },
];

const MODALITIES = [
  { id: "all", label: "All modalities", icon: null },
  { id: "tts", label: "TTS", icon: Headphones, sub: "text → voice" },
  { id: "stt", label: "STT", icon: Mic, sub: "voice → text" },
  { id: "s2s", label: "S2S", icon: MessageSquare, sub: "voice ↔ voice" },
];

export default function App() {
  const [page, setPage] = useState("overview");
  const [modality, setModality] = useState("all");
  const [overlay, setOverlay] = useState(null);

  const open = (kind) => setOverlay(kind);
  const close = () => setOverlay(null);

  const renderPage = () => {
    switch (page) {
      case "overview":     return <Overview modality={modality} open={open} />;
      case "studies":      return <Studies modality={modality} />;
      case "studyrunner":  return <StudyRunner open={open} />;
      case "switchboard":  return <Switchboard />;
      case "labeldata":    return <LabelData />;
      case "goldensets":   return <GoldenSets />;
      case "hyperdata":    return <HyperData />;
      case "autoeval":     return <AutoEval />;
      case "leaderboard":  return <Leaderboard />;
      case "api":          return <API />;
      default:             return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.white, fontFamily: FONT, color: C.black }}>
      {/* sidebar */}
      <aside style={{ width: 220, background: C.beige, borderRight: `1px solid ${C.line}`, padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 8px 24px", borderBottom: `1px solid ${C.beigeDeep}`, marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: C.gray, marginBottom: 4 }}>HUME</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>Voice EQ</div>
          <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Eval system · v0.5</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV.map((item, idx) => {
            if ("section" in item) {
              return item.section ? (
                <div key={idx} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: C.grayLight, textTransform: "uppercase", padding: "12px 10px 4px", marginTop: 4 }}>
                  {item.section}
                </div>
              ) : (
                <div key={idx} style={{ height: 1, background: C.beigeDeep, margin: "10px 4px" }} />
              );
            }
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  background: active ? C.white : "transparent",
                  border: "none",
                  borderRadius: 7,
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.black : C.gray,
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                  transition: "background .1s, color .1s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.beigeDeep; e.currentTarget.style.color = C.black; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gray; } }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", padding: 12, background: C.white, borderRadius: 8, border: `1px solid ${C.beigeDeep}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>Workspace</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.black }}>Hume Internal</div>
          <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Plan: Research · unlimited</div>
        </div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* top bar with modality filter */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: `1px solid ${C.line}`, background: C.white }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Filter size={13} color={C.gray} />
            <span style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginRight: 4 }}>Modality</span>
            {MODALITIES.map(m => {
              const active = modality === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setModality(m.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 10px",
                    border: `1px solid ${active ? C.black : C.line}`,
                    background: active ? C.black : C.white,
                    color: active ? C.white : C.ink,
                    borderRadius: 5,
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title={m.sub}
                >
                  {Icon && <Icon size={12} />}
                  {m.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Globe size={14} color={C.gray} />
            <span style={{ fontSize: 11, color: C.gray }}>23 languages live</span>
            <div style={{ width: 1, height: 16, background: C.line }} />
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.purple, color: C.black, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              AE
            </div>
          </div>
        </header>

        <div style={{ padding: "32px 32px 64px", flex: 1, overflowY: "auto" }}>
          {renderPage()}
        </div>
      </main>

      {/* overlays */}
      <Drawer open={overlay === "run"} onClose={close}><RunDetail onClose={close} /></Drawer>
      <Drawer open={overlay === "checkpoints"} onClose={close}><CheckpointHistory onClose={close} /></Drawer>
      <Drawer open={overlay === "authoring"} onClose={close}><ScenarioAuthoring onClose={close} /></Drawer>
      {overlay === "rater" && <RaterTask onClose={close} />}
    </div>
  );
}

import { Plus, Sparkles } from "lucide-react";
import { C } from "../tokens";
import { SCENARIO_PACKS } from "../mock/scenarios";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import ModalityChip from "../ui/ModalityChip";

export default function ScenarioPacks({ modality, open }) {
  const filtered = modality === "all" ? SCENARIO_PACKS : SCENARIO_PACKS.filter(p => p.modality === modality);

  return (
    <div>
      <SectionHeader
        eyebrow="Golden sets"
        title="Scenario Packs"
        action={<Button icon={Plus} onClick={() => open("authoring")}>Author pack</Button>}
      />

      <div style={{ background: C.beige, borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles size={16} color={C.orange} />
        <div style={{ fontSize: 12, color: C.ink }}>
          Each pack defines <strong>role + scenario + prompts</strong> and explicit "what good looks like" criteria — the contract studies grade against.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "60px 24px", textAlign: "center", border: `1px dashed ${C.line}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 4 }}>No packs for this modality</div>
            <div style={{ fontSize: 12, color: C.gray }}>Try switching to "All modalities".</div>
          </div>
        )}
        {filtered.map(p => (
          <div
            key={p.id}
            style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.black}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
          >
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lineSoft}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <ModalityChip m={p.modality} />
                <div style={{ fontSize: 11, color: C.gray }}>{p.prompts} prompts</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.black, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: C.gray }}>
                <span style={{ fontWeight: 600, color: C.ink }}>{p.role}</span> · {p.scenario}
              </div>
            </div>
            <div style={{ padding: "12px 20px", background: C.lineSoft }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>
                What good looks like
              </div>
              <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{p.goodLooks}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

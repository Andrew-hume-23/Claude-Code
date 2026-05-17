import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { C, FONT } from "../tokens";
import { STUDIES } from "../mock/studies";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import DimChip from "../ui/DimChip";
import ModalityChip from "../ui/ModalityChip";

export default function Studies({ modality }) {
  const [dim, setDim] = useState("all");
  const dims = ["all", "Reliability", "Expressivity", "EQ"];
  const filtered = STUDIES.filter(s =>
    (modality === "all" || s.modality === modality) &&
    (dim === "all" || s.dim === dim)
  );

  return (
    <div>
      <SectionHeader
        eyebrow="Eval module library"
        title="Studies"
        action={<Button icon={Plus}>Custom study</Button>}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {dims.map(d => (
          <button
            key={d}
            onClick={() => setDim(d)}
            style={{
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              border: `1px solid ${dim === d ? C.black : C.line}`,
              background: dim === d ? C.black : C.white,
              color: dim === d ? C.white : C.ink,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {d === "all" ? "All dimensions" : d}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map(s => (
          <div
            key={s.id}
            style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 20, cursor: "pointer", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.black}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <DimChip dim={s.dim} />
                <ModalityChip m={s.modality} />
              </div>
              <ChevronRight size={16} color={C.grayLight} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.black, marginBottom: 6 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, marginBottom: 14 }}>{s.desc}</div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.gray }}>
              <span><strong style={{ color: C.black, fontWeight: 700 }}>{s.scenarios}</strong> scenarios</span>
              <span><strong style={{ color: C.black, fontWeight: 700 }}>{s.runs}</strong> total runs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

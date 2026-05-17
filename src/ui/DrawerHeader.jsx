import { X } from "lucide-react";
import { C } from "../tokens";

export default function DrawerHeader({ eyebrow, title, subtitle, onClose, action }) {
  return (
    <div style={{ position: "sticky", top: 0, background: C.white, zIndex: 5, padding: "20px 28px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>{eyebrow}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {action}
        <button onClick={onClose} style={{ width: 28, height: 28, border: "none", background: C.lineSoft, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={14} color={C.gray} />
        </button>
      </div>
    </div>
  );
}

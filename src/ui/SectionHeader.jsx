import { C } from "../tokens";

export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 6 }}>
          {eyebrow}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}

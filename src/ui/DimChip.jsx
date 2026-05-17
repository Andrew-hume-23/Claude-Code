import { C } from "../tokens";

export default function DimChip({ dim, size = "sm" }) {
  const map = {
    Reliability: { bg: C.beige, fg: C.black, dot: C.orange },
    Expressivity: { bg: "#F0E9FB", fg: C.black, dot: C.purpleDeep },
    EQ: { bg: "#EAF5EE", fg: C.black, dot: C.green },
  };
  const s = map[dim] || map.Reliability;
  const px = size === "sm" ? 8 : 10;
  const fs = size === "sm" ? 10 : 11;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.fg,
        fontSize: fs,
        fontWeight: 600,
        padding: `${px / 2}px ${px}px`,
        borderRadius: 6,
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {dim}
    </span>
  );
}

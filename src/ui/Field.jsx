import { C } from "../tokens";

export default function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      {hint && <div style={{ fontSize: 11, color: C.gray, marginBottom: 8 }}>{hint}</div>}
      {children}
    </div>
  );
}

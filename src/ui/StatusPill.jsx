import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { C } from "../tokens";

export default function StatusPill({ status }) {
  const map = {
    complete: { bg: "#EAF5EE", fg: "#2F7A52", icon: CheckCircle2 },
    running: { bg: "#FDF4E9", fg: "#A66A2E", icon: Clock },
    queued: { bg: C.lineSoft, fg: C.gray, icon: Clock },
    failed: { bg: "#FBEAEA", fg: "#A33A3A", icon: AlertCircle },
  };
  const s = map[status];
  const Icon = s.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: s.fg, background: s.bg, padding: "3px 8px", borderRadius: 4 }}>
      <Icon size={11} />
      {status}
    </span>
  );
}

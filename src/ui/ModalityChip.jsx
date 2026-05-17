import { C } from "../tokens";

export default function ModalityChip({ m }) {
  const labels = { tts: "TTS", stt: "STT", s2s: "S2S" };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        padding: "3px 7px",
        background: C.lineSoft,
        color: C.gray,
        borderRadius: 4,
        fontFamily: "ui-monospace, monospace",
      }}
    >
      {labels[m] || m.toUpperCase()}
    </span>
  );
}

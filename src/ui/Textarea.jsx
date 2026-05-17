import { C, FONT } from "../tokens";

export default function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, color: C.black, outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
      onFocus={e => e.target.style.borderColor = C.black}
      onBlur={e => e.target.style.borderColor = C.line}
    />
  );
}

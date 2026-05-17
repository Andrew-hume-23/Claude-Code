import { C, FONT } from "../tokens";

export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, color: C.black, outline: "none", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderColor = C.black}
      onBlur={e => e.target.style.borderColor = C.line}
    />
  );
}

import { C, FONT } from "../tokens";

export default function Button({ children, primary, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: primary ? C.black : C.white,
        color: primary ? C.white : C.black,
        border: primary ? "none" : `1px solid ${C.line}`,
        padding: "8px 14px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: FONT,
        cursor: "pointer",
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

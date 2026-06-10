import { useState } from "react";
import { C, FONT } from "../tokens";

export default function Button({ children, primary, icon: Icon, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: primary ? (hov ? C.ink : C.black) : (hov ? C.lineSoft : C.white),
        color: primary ? C.white : C.black,
        border: primary ? "none" : `1px solid ${C.line}`,
        padding: "8px 14px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: FONT,
        cursor: "pointer",
        transition: "background .12s",
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

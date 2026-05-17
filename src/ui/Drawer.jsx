import { C, FONT } from "../tokens";

export default function Drawer({ open, onClose, width = 720, children }) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(17,17,17,0.4)", zIndex: 50,
        }}
      />
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width, maxWidth: "92vw",
          background: C.white, zIndex: 51,
          boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
          overflowY: "auto",
          fontFamily: FONT,
        }}
      >
        {children}
      </aside>
    </>
  );
}

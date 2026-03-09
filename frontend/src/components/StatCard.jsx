import { C } from "../constants/colors";

export default function StatCard({ label, value, icon, color, sub }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: "14px 16px",
        flex: 1,
        minWidth: 130,
        boxShadow: `0 0 18px ${color}0d`,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color,
          fontFamily: "monospace",
          letterSpacing: -1,
        }}
      >
        {value ?? "…"}
      </div>
      <div style={{ fontSize: 10, color: C.dim, marginTop: 2, letterSpacing: 0.5 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 9, color: color + "88", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

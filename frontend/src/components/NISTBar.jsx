import { C } from "../constants/colors";

export default function NISTBar({ label, value, color, desc }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <span style={{ color, fontWeight: 700, fontSize: 11, letterSpacing: 1 }}>{label}</span>
          <span style={{ color: C.dim, fontSize: 10, marginLeft: 8 }}>{desc}</span>
        </div>
        <span style={{ color, fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: `linear-gradient(90deg,${color}66,${color})`,
            borderRadius: 3,
            transition: "width 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

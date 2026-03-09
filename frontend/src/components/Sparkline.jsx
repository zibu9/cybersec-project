export default function Sparkline({ data = [], color }) {
  const w = 130;
  const h = 38;

  if (!data.length) return null;

  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color + "18"} />
    </svg>
  );
}

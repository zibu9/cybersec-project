import { C } from "../constants/colors";

export default function Badge({ text, colorMap, fallback = C.dim }) {
  const c = colorMap[text] || fallback;

  return (
    <span
      style={{
        background: c + "22",
        color: c,
        border: `1px solid ${c}44`,
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {text}
    </span>
  );
}

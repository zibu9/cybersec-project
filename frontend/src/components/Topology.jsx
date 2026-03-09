import { C } from "../constants/colors";

export default function Topology({ events }) {
  const alert = events?.[0]?.status === "EN COURS";

  const nodes = [
    { id: "internet", label: "INTERNET", x: 50, y: 5, icon: "🌐", c: C.dim },
    {
      id: "firewall",
      label: "FIREWALL\nnginx-proxy",
      x: 50,
      y: 24,
      icon: "🛡️",
      c: alert ? C.red : C.green,
    },
    { id: "dmz", label: "DMZ\n172.16.10.0/24", x: 18, y: 46, icon: "🔀", c: C.accent },
    { id: "ids", label: "IDS/IPS\nSnort", x: 50, y: 46, icon: "👁️", c: C.yellow },
    { id: "siem", label: "SIEM\nsiem-engine", x: 82, y: 46, icon: "📊", c: C.purple },
    { id: "attacker", label: "ATTACKER\n172.16.10.100", x: 18, y: 66, icon: "💀", c: C.red },
    { id: "lan", label: "LAN\n192.168.20.0/24", x: 50, y: 66, icon: "🖥️", c: C.text },
    { id: "servers", label: "SERVEURS\n192.168.30.0/24", x: 30, y: 86, icon: "🗄️", c: C.accent },
    { id: "soc", label: "SOC ADMIN\n192.168.40.0/24", x: 70, y: 86, icon: "👔", c: C.orange },
  ];

  const links = [
    ["internet", "firewall", false],
    ["firewall", "dmz", false],
    ["firewall", "ids", false],
    ["ids", "siem", false],
    ["ids", "lan", false],
    ["dmz", "attacker", alert],
    ["lan", "servers", false],
    ["lan", "soc", false],
  ];

  return (
    <div style={{ position: "relative", height: 440, background: C.bg, borderRadius: 8, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={C.dim} />
          </marker>
        </defs>
        {links.map(([a, b, hostile], i) => {
          const na = nodes.find((n) => n.id === a);
          const nb = nodes.find((n) => n.id === b);
          return (
            <line
              key={i}
              x1={`${na.x}%`}
              y1={`${na.y}%`}
              x2={`${nb.x}%`}
              y2={`${nb.y}%`}
              stroke={hostile ? C.red : C.border}
              strokeWidth={hostile ? 2 : 1}
              strokeDasharray={hostile ? "5,3" : "none"}
              style={hostile ? { animation: "dash 1s linear infinite" } : {}}
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          style={{
            position: "absolute",
            left: `calc(${n.x}% - 36px)`,
            top: `calc(${n.y}% - 18px)`,
            textAlign: "center",
            width: 72,
          }}
        >
          <div
            style={{
              fontSize: 16,
              background: n.id === "attacker" && alert ? C.red + "33" : C.panel,
              border: `1px solid ${n.c}44`,
              borderRadius: 6,
              padding: "3px 2px",
              boxShadow: `0 0 8px ${n.c}22`,
            }}
          >
            {n.icon}
          </div>
          {n.label.split("\n").map((l, i) => (
            <div
              key={i}
              style={{
                fontSize: i === 0 ? 9 : 9,
                color: i === 0 ? n.c : C.dim,
                fontWeight: i === 0 ? 700 : 400,
                lineHeight: 1.3,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ))}
      <style>{`@keyframes dash{to{stroke-dashoffset:-16}}`}</style>
    </div>
  );
}

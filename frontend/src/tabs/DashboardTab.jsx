import { C, SeverityColor, StatusColor } from "../constants/colors";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import Sparkline from "../components/Sparkline";

const IconWrap = ({ color, children }) => (
  <span style={{ display: "inline-flex", color }} aria-hidden="true">
    {children}
  </span>
);

const ClipboardIcon = ({ color }) => (
  <IconWrap color={color}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  </IconWrap>
);

const ShieldIcon = ({ color }) => (
  <IconWrap color={color}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  </IconWrap>
);

const AlertIcon = ({ color }) => (
  <IconWrap color={color}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.9L1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  </IconWrap>
);

const BoltIcon = ({ color }) => (
  <IconWrap color={color}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  </IconWrap>
);

const ChartIcon = ({ color }) => (
  <IconWrap color={color}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
      <circle cx="7" cy="14" r="1" />
      <circle cx="11" cy="10" r="1" />
      <circle cx="14" cy="13" r="1" />
      <circle cx="19" cy="7" r="1" />
    </svg>
  </IconWrap>
);

export default function DashboardTab({ statData, trafficData, evList, API }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <StatCard label="Événements total" value={statData.total_events} icon={<ClipboardIcon color={C.accent} />} color={C.accent} sub="session courante" />
        <StatCard
          label="Attaques bloquées"
          value={statData.blocked}
          icon={<ShieldIcon color={C.green} />}
          color={C.green}
          sub={`${statData.block_rate || 0}% taux blocage`}
        />
        <StatCard label="Alertes critiques" value={statData.critical} icon={<AlertIcon color={C.red} />} color={C.red} sub="nécessite action" />
        <StatCard
          label="Services actifs"
          value={statData.active_services || 5}
          icon={<BoltIcon color={C.yellow} />}
          color={C.yellow}
          sub="Firewall·SIEM·IDS·VPN·DNS"
        />
        <StatCard
          label="Score sécurité"
          value={`${statData.security_score || 0}%`}
          icon={<ChartIcon color={C.purple} />}
          color={C.purple}
          sub="NIST composite"
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {[
          { label: "TRAFIC RÉSEAU (paquets/s)", data: trafficData.packets, color: C.accent },
          { label: "ALERTES IDS/IPS", data: trafficData.alerts, color: C.red },
          { label: "CONNEXIONS BLOQUÉES", data: trafficData.blocked, color: C.orange },
        ].map(({ label, data, color }) => (
          <div
            key={label}
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 14px",
              flex: 1,
            }}
          >
            <div style={{ fontSize: 9, color: C.dim, marginBottom: 6, letterSpacing: 1 }}>{label}</div>
            <Sparkline data={data || []} color={color} />
          </div>
        ))}
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: C.accent, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
            JOURNAL TEMPS RÉEL — ÉVÉNEMENTS DE SÉCURITÉ
          </span>
          <span style={{ color: C.dim, fontSize: 10 }}>{evList.length} entrées · API : {API}</span>
        </div>
        <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead style={{ position: "sticky", top: 0, background: C.bg }}>
              <tr>
                {["HEURE", "IP SOURCE", "DEST.", "ATTAQUE", "SERVICE", "SEGMENT", "SÉVÉRITÉ", "STATUT", "CONTRE-MESURE"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "7px 10px",
                        color: C.dim,
                        textAlign: "left",
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {evList.map((e, i) => (
                <tr key={e.id} style={{ borderTop: `1px solid ${C.border}`, background: i === 0 ? C.accent + "08" : "transparent" }}>
                  <td style={{ padding: "6px 10px", color: C.dim, whiteSpace: "nowrap", fontFamily: "monospace" }}>{e.time}</td>
                  <td style={{ padding: "6px 10px", color: C.red, fontFamily: "monospace" }}>{e.src_ip}</td>
                  <td style={{ padding: "6px 10px", color: C.accent, fontFamily: "monospace" }}>{e.dst_ip}</td>
                  <td style={{ padding: "6px 10px", color: e.color, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {e.icon} {e.attack_type}
                  </td>
                  <td style={{ padding: "6px 10px", color: C.text }}>{e.service}</td>
                  <td style={{ padding: "6px 10px", color: C.dim }}>{e.segment}</td>
                  <td style={{ padding: "6px 10px" }}>
                    <Badge text={e.severity} colorMap={SeverityColor} />
                  </td>
                  <td style={{ padding: "6px 10px" }}>
                    <Badge text={e.status} colorMap={StatusColor} />
                  </td>
                  <td style={{ padding: "6px 10px", color: C.green, fontSize: 10 }}>{e.defense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

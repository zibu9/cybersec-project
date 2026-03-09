import { C } from "../constants/colors";
import Badge from "../components/Badge";
import Topology from "../components/Topology";

export default function TopologyTab({ evList }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 12, letterSpacing: 1 }}>
          TOPOLOGIE RÉSEAU ON-PREMISE (Docker)
        </div>
        <Topology events={evList} />
        <div style={{ marginTop: 10, fontSize: 11, color: C.dim, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span>
            <span style={{ color: C.green }}>■</span> Périmètre sécurisé
          </span>
          <span>
            <span style={{ color: C.accent }}>■</span> Zone DMZ
          </span>
          <span>
            <span style={{ color: C.yellow }}>■</span> Détection IDS
          </span>
          <span>
            <span style={{ color: C.purple }}>■</span> SIEM
          </span>
          <span>
            <span style={{ color: C.red }}>■</span> Attaquant simulé
          </span>
        </div>
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 12, letterSpacing: 1 }}>
          CONTENEURS DOCKER ACTIFS
        </div>
        {[
          { name: "nginx-proxy", role: "Firewall / Reverse Proxy", net: "172.16.10.2", status: "running", c: C.green },
          { name: "soc-dashboard", role: "Interface SOC (React)", net: "192.168.20.10", status: "running", c: C.green },
          { name: "api-backend", role: "Moteur de sécurité (Flask)", net: "192.168.30.10", status: "running", c: C.green },
          { name: "siem-engine", role: "SIEM — Corrélation événements", net: "192.168.40.20", status: "running", c: C.green },
          { name: "attack-simulator", role: "Lab simulation d'attaques", net: "172.16.10.100", status: "standby", c: C.orange },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 0",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div>
              <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>{c.name}</div>
              <div style={{ color: C.dim, fontSize: 12 }}>
                {c.role} · {c.net}
              </div>
            </div>
            <Badge text={c.status.toUpperCase()} colorMap={{ RUNNING: C.green, STANDBY: C.orange }} fallback={C.dim} />
          </div>
        ))}
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, gridColumn: "1/-1" }}>
        <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
          COMPOSANTS DE SÉCURITÉ DÉPLOYÉS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[
            { layer: "COUCHE PÉRIMÈTRE", icon: "🛡️", color: C.accent, items: ["Firewall Pfsense/OPNsense", "IDS/IPS Snort", "Reverse Proxy"] },
            { layer: "COUCHE RÉSEAU", icon: "🔀", color: C.green, items: ["VLAN Segmentation", "NAC (802.1X)", "VPN IPSec/OpenVPN"] },
            { layer: "COUCHE HÔTE", icon: "🖥️", color: C.yellow, items: ["Antivirus EDR", "HIDS (Wazuh)", "GPO Hardening"] },
            { layer: "COUCHE DONNÉES", icon: "🗄️", color: C.purple, items: ["Chiffrement AES-256", "DLP Solution", "Backup chiffré"] },
            { layer: "COUCHE SUPERVISION", icon: "📊", color: C.orange, items: ["SIEM (ELK/Wazuh)", "Nagios Monitoring", "SOC Alerting"] },
          ].map((col, i) => (
            <div
              key={i}
              style={{ background: C.bg, border: `1px solid ${col.color}33`, borderTop: "none", borderRadius: 8, padding: 12 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{col.icon}</span>
                <span style={{ color: col.color, fontWeight: 800, fontSize: 9, letterSpacing: 1, lineHeight: 1.3 }}>{col.layer}</span>
              </div>
              {col.items.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: col.color, fontSize: 10, fontWeight: 700 }}>✓</span>
                  <span style={{ color: C.text, fontSize: 10 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, gridColumn: "1/-1" }}>
        <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>
          FLUX DE TRAITEMENT DES INCIDENTS (NIST SP 800-61)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { step: "1. DÉTECTION", desc: "IDS/SIEM alerte", c: C.yellow },
            { step: "2. TRIAGE", desc: "Évaluation sévérité", c: C.orange },
            { step: "3. CONFINEMENT", desc: "Isolation segment", c: C.red },
            { step: "4. ÉRADICATION", desc: "Suppression menace", c: C.purple },
            { step: "5. REPRISE", desc: "Restauration service", c: C.accent },
            { step: "6. LEÇONS", desc: "Rapport & amélioration", c: C.green },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: s.c + "1a", border: `1px solid ${s.c}`, borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 88 }}>
                <div style={{ color: s.c, fontWeight: 700, fontSize: 10 }}>{s.step}</div>
                <div style={{ color: C.dim, fontSize: 9, marginTop: 2 }}>{s.desc}</div>
              </div>
              {i < arr.length - 1 && <div style={{ color: C.dim, fontSize: 16 }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

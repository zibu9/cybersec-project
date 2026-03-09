import { C } from "../constants/colors";
import NISTBar from "../components/NISTBar";

export default function NISTTab({ nistData }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
          CADRE NIST CSF — MATURITÉ SÉCURITÉ
        </div>
        <NISTBar label="IDENTIFIER" value={nistData.identify || 72} color="#9c27b0" desc="Inventaire actifs, analyse risques" />
        <NISTBar label="PROTÉGER" value={nistData.protect || 68} color={C.accent} desc="Contrôle accès, chiffrement, firewall" />
        <NISTBar label="DÉTECTER" value={nistData.detect || 81} color={C.yellow} desc="IDS/IPS, SIEM, monitoring 24/7" />
        <NISTBar label="RÉPONDRE" value={nistData.respond || 65} color={C.orange} desc="Plan d'incident, isolation réseau" />
        <NISTBar label="RÉCUPÉRER" value={nistData.recover || 59} color={C.green} desc="Backup 3-2-1, PCA, PRA" />
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ color: C.yellow, fontWeight: 700, fontSize: 12, marginBottom: 14, letterSpacing: 1 }}>
          ISO/IEC 27001 — ÉTAT DES CONTRÔLES
        </div>
        {[
          { ctrl: "A.8 — Gestion des actifs", status: "✓ Implémenté", c: C.green },
          { ctrl: "A.9 — Contrôle d'accès (RBAC+MFA)", status: "✓ Implémenté", c: C.green },
          { ctrl: "A.10 — Cryptographie AES-256", status: "⚠ Partiel", c: C.yellow },
          { ctrl: "A.12 — Sécurité opérationnelle", status: "✓ Implémenté", c: C.green },
          { ctrl: "A.13 — Sécurité communications", status: "✓ Implémenté", c: C.green },
          { ctrl: "A.16 — Gestion des incidents", status: "⚠ Partiel", c: C.yellow },
          { ctrl: "A.17 — Continuité activité (PCA)", status: "✗ En cours", c: C.orange },
          { ctrl: "A.18 — Conformité réglementaire", status: "⚠ Partiel", c: C.yellow },
        ].map((r, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11 }}
          >
            <span style={{ color: C.text }}>{r.ctrl}</span>
            <span style={{ color: r.c, fontWeight: 700 }}>{r.status}</span>
          </div>
        ))}
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, gridColumn: "1/-1" }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12, marginBottom: 12, letterSpacing: 1 }}>
          RECOMMANDATIONS PRIORITAIRES — CONTEXTE RDC
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            { p: "P1", title: "Déployer SIEM Wazuh", desc: "Logs centralisés, alertes temps réel, open-source", c: C.red },
            { p: "P1", title: "Segmentation VLANs", desc: "DMZ/LAN/Serveurs/Admin — isolation par zone", c: C.red },
            { p: "P2", title: "MFA obligatoire", desc: "Authentification forte pour tous les comptes admin", c: C.orange },
            { p: "P2", title: "Backup 3-2-1", desc: "3 copies, 2 supports, 1 hors-site. Tests mensuels", c: C.orange },
            { p: "P3", title: "Formation personnel", desc: "Anti-phishing trimestriel + charte informatique", c: C.yellow },
            { p: "P3", title: "PCA/PRA documenté", desc: "RTO < 4h, RPO < 24h, testé 2x/an", c: C.yellow },
          ].map((r, i) => (
            <div
              key={i}
              style={{ background: C.bg, border: `1px solid ${r.c}44`, borderLeft: `3px solid ${r.c}`, borderRadius: 6, padding: 10 }}
            >
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                <span style={{ background: r.c + "33", color: r.c, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>
                  {r.p}
                </span>
                <span style={{ color: r.c, fontWeight: 700, fontSize: 11 }}>{r.title}</span>
              </div>
              <div style={{ color: C.dim, fontSize: 10, lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

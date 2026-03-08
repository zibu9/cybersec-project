import { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  bg: "#070d1a", panel: "#0c1424", border: "#162340",
  accent: "#00c8ff", green: "#00ff9d", red: "#ff2d55",
  orange: "#ff8c00", yellow: "#ffc300", purple: "#bf5af2",
  text: "#c0d4f0", dim: "#3a5070",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const useFetch = (url, interval = 2000) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const fetch_ = useCallback(() => {
    fetch(url).then(r => r.json()).then(setData).catch(setError);
  }, [url]);
  useEffect(() => { fetch_(); const t = setInterval(fetch_, interval); return () => clearInterval(t); }, [fetch_, interval]);
  return { data, error, refetch: fetch_ };
};

const SeverityColor = { CRITIQUE: C.red, HAUTE: C.orange, MOYENNE: C.yellow, FAIBLE: C.green };
const StatusColor = { "BLOQUÉ": C.green, "EN COURS": C.orange, "ANALYSÉ": C.accent };

// ─── Components ────────────────────────────────────────────────────────────
const Badge = ({ text, colorMap, fallback = C.dim }) => {
  const c = colorMap[text] || fallback;
  return <span style={{ background: c+"22", color: c, border: `1px solid ${c}44`, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{text}</span>;
};

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: C.panel, border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "14px 16px", flex: 1, minWidth: 130, boxShadow: `0 0 18px ${color}0d` }}>
    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "monospace", letterSpacing: -1 }}>{value ?? "…"}</div>
    <div style={{ fontSize: 10, color: C.dim, marginTop: 2, letterSpacing: 0.5 }}>{label}</div>
    {sub && <div style={{ fontSize: 9, color: color+"88", marginTop: 2 }}>{sub}</div>}
  </div>
);

const Sparkline = ({ data = [], color }) => {
  const w = 130, h = 38;
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-(v/max)*h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color+"18"} />
    </svg>
  );
};

const NISTBar = ({ label, value, color, desc }) => (
  <div style={{ marginBottom: 13 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <div>
        <span style={{ color, fontWeight: 700, fontSize: 11, letterSpacing: 1 }}>{label}</span>
        <span style={{ color: C.dim, fontSize: 10, marginLeft: 8 }}>{desc}</span>
      </div>
      <span style={{ color, fontWeight: 800, fontSize: 12, fontFamily: "monospace" }}>{value}%</span>
    </div>
    <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg,${color}66,${color})`, borderRadius: 3, transition: "width 1.2s ease" }} />
    </div>
  </div>
);

// ─── Network Topology ──────────────────────────────────────────────────────
const Topology = ({ events }) => {
  const alert = events?.[0]?.status === "EN COURS";
  const nodes = [
    { id: "internet", label: "INTERNET", x: 50, y: 8, icon: "🌐", c: C.dim },
    { id: "firewall", label: "FIREWALL\nnginx-proxy", x: 50, y: 24, icon: "🛡️", c: alert ? C.red : C.green },
    { id: "dmz", label: "DMZ\n172.16.10.0/24", x: 18, y: 46, icon: "🔀", c: C.accent },
    { id: "ids", label: "IDS/IPS\nSnort", x: 50, y: 46, icon: "👁️", c: C.yellow },
    { id: "siem", label: "SIEM\nsiem-engine", x: 82, y: 46, icon: "📊", c: C.purple },
    { id: "attacker", label: "ATTACKER\n172.16.10.100", x: 18, y: 66, icon: "💀", c: C.red },
    { id: "lan", label: "LAN\n192.168.20.0/24", x: 50, y: 66, icon: "🖥️", c: C.text },
    { id: "servers", label: "SERVEURS\n192.168.30.0/24", x: 30, y: 86, icon: "🗄️", c: C.accent },
    { id: "soc", label: "SOC ADMIN\n192.168.40.0/24", x: 70, y: 86, icon: "👔", c: C.orange },
  ];
  const links = [
    ["internet","firewall",false], ["firewall","dmz",false], ["firewall","ids",false],
    ["ids","siem",false], ["ids","lan",false], ["dmz","attacker",alert],
    ["lan","servers",false], ["lan","soc",false],
  ];
  return (
    <div style={{ position: "relative", height: 260, background: C.bg, borderRadius: 8, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={C.dim} />
          </marker>
        </defs>
        {links.map(([a, b, hostile], i) => {
          const na = nodes.find(n=>n.id===a), nb = nodes.find(n=>n.id===b);
          return <line key={i} x1={`${na.x}%`} y1={`${na.y}%`} x2={`${nb.x}%`} y2={`${nb.y}%`}
            stroke={hostile ? C.red : C.border} strokeWidth={hostile ? 2 : 1}
            strokeDasharray={hostile ? "5,3" : "none"}
            style={hostile ? { animation: "dash 1s linear infinite" } : {}} />;
        })}
      </svg>
      {nodes.map(n => (
        <div key={n.id} style={{ position: "absolute", left:`calc(${n.x}% - 34px)`, top:`calc(${n.y}% - 18px)`, textAlign:"center", width:68 }}>
          <div style={{ fontSize:15, background: n.id==="attacker" && alert ? C.red+"33" : C.panel, border:`1px solid ${n.c}44`, borderRadius:6, padding:"3px 2px", boxShadow:`0 0 8px ${n.c}22` }}>{n.icon}</div>
          {n.label.split("\n").map((l,i) => <div key={i} style={{ fontSize: i===0?8:7, color: i===0?n.c:C.dim, fontWeight:i===0?700:400, lineHeight:1.3 }}>{l}</div>)}
        </div>
      ))}
      <style>{`@keyframes dash{to{stroke-dashoffset:-16}}`}</style>
    </div>
  );
};

// ─── Simulation Panel ──────────────────────────────────────────────────────
const SimPanel = () => {
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);

  const scenarios = [
    { id:"ransomware", name:"Ransomware", icon:"🔒", color:C.red,
      steps:["Email malveillant reçu","Macro Word exécutée","Payload téléchargé","Chiffrement AES des fichiers","Demande de rançon Bitcoin"],
      defense:["Filtrage email (SPF/DKIM/DMARC)","Macro désactivée via GPO","Antivirus/EDR bloque payload","Backup 3-2-1 restauré","IP blacklistée sur firewall"] },
    { id:"ddos", name:"DDoS", icon:"🌊", color:C.orange,
      steps:["Scan TCP SYN flood détecté","UDP amplification (DNS)","Bande passante saturée à 98%","Service HTTP indisponible"],
      defense:["Rate limiting firewall activé","Black hole routing","Null routing de l'IP source","Service rétabli en 4 min"] },
    { id:"phishing", name:"Phishing", icon:"🎣", color:C.yellow,
      steps:["Email de phishing envoyé","Lien cliqué par un agent","Faux formulaire de connexion","Credentials capturés"],
      defense:["Proxy filtre l'URL malveillante","Alerte SIEM déclenchée","Compte verrouillé automatiquement","Session MFA invalide = accès refusé"] },
    { id:"bruteforce", name:"Brute Force SSH", icon:"🔨", color:"#ff6b35",
      steps:["Scan Nmap du port 22 détecté","Hydra: 500 tentatives/min","Comptes ciblés: admin, root"],
      defense:["fail2ban: IP bannie après 5 échecs","Port SSH changé (2222)","Clé RSA obligatoire","Alerte admin envoyée par email"] },
  ];

  const simulate = async (scenario) => {
    setSelected(scenario);
    setRunning(true);
    setResult(null);
    setLog([]);

    try {
      const res = await fetch(`${API}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attack_type: scenario.id })
      });
      const data = await res.json();
      // Animate log lines
      const allLines = scenario.steps.map((s,i) => ({ type:"attack", text:s, delay: i*600 }))
        .concat(scenario.defense.map((d,i) => ({ type:"defense", text:d, delay: scenario.steps.length*600 + i*500 + 400 })));
      allLines.forEach(({ type, text, delay }) => {
        setTimeout(() => setLog(prev => [...prev, { type, text }]), delay);
      });
      setTimeout(() => { setResult(data); setRunning(false); }, allLines[allLines.length-1].delay + 700);
    } catch {
      // fallback offline mode
      const allLines = scenario.steps.map((s,i) => ({ type:"attack", text:s, delay: i*600 }))
        .concat(scenario.defense.map((d,i) => ({ type:"defense", text:d, delay: scenario.steps.length*600 + i*500 + 400 })));
      allLines.forEach(({ type, text, delay }) => {
        setTimeout(() => setLog(prev => [...prev, { type, text }]), delay);
      });
      setTimeout(() => { setResult({ status:"BLOQUÉ", nist_phase:"RÉPONDRE", iso_control:"A.16.1" }); setRunning(false); }, allLines[allLines.length-1].delay + 700);
    }
  };

  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {scenarios.map(s => (
          <button key={s.id} onClick={() => simulate(s)} disabled={running}
            style={{ background: selected?.id===s.id ? s.color+"22":"transparent", border:`1px solid ${selected?.id===s.id?s.color:C.border}`, color: selected?.id===s.id?s.color:C.dim, borderRadius:8, padding:"8px 14px", cursor:running?"not-allowed":"pointer", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6, transition:"all 0.2s", opacity:running&&selected?.id!==s.id?0.4:1 }}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {log.length > 0 && (
        <div style={{ background:C.bg, borderRadius:8, padding:14, fontFamily:"monospace", fontSize:12, border:`1px solid ${C.border}` }}>
          <div style={{ color:C.dim, fontSize:10, marginBottom:10, letterSpacing:1 }}>► TERMINAL DE SIMULATION</div>
          {log.map((l, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:6, animation:"fadeIn 0.4s ease" }}>
              <span style={{ color: l.type==="attack"?C.red:C.green, fontWeight:700, minWidth:8 }}>{l.type==="attack"?"⚠":"✓"}</span>
              <span style={{ color: l.type==="attack"?C.red+"cc":C.green }}>{l.text}</span>
            </div>
          ))}
          {result && (
            <div style={{ marginTop:12, padding:"8px 12px", background: C.green+"11", border:`1px solid ${C.green}44`, borderRadius:6 }}>
              <span style={{ color:C.green, fontWeight:800 }}>✅ RÉSULTAT : {result.status}</span>
              <span style={{ color:C.dim, fontSize:11, marginLeft:14 }}>Phase NIST : {result.nist_phase} | Contrôle ISO : {result.iso_control}</span>
            </div>
          )}
          {running && <div style={{ color:C.accent, fontSize:11, marginTop:8 }}>● Simulation en cours…</div>}
        </div>
      )}
      {!selected && <div style={{ color:C.dim, textAlign:"center", padding:"30px 0", fontSize:12 }}>Sélectionnez un type d'attaque ci-dessus pour lancer la simulation</div>}
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [paused, setPaused] = useState(false);

  const { data: events } = useFetch(`${API}/api/events`, paused ? null : 2500);
  const { data: stats } = useFetch(`${API}/api/stats`, paused ? null : 3000);
  const { data: nist } = useFetch(`${API}/api/nist`, 5000);
  const { data: traffic } = useFetch(`${API}/api/traffic`, paused ? null : 2000);

  const evList = events?.events || [];
  const statData = stats || {};
  const nistData = nist?.scores || {};
  const trafficData = traffic || {};

  const tabs = [
    { id:"dashboard", label:"🖥️ SOC Dashboard" },
    { id:"simulation", label:"⚔️ Lab Simulation" },
    { id:"nist", label:"📐 NIST / ISO27001" },
    { id:"topology", label:"🗺️ Topologie" },
  ];

  return (
    <div style={{ fontFamily:"'Courier New',monospace", background:C.bg, color:C.text, minHeight:"100vh", padding:16, fontSize:13 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}`, paddingBottom:12, marginBottom:14 }}>
        <div>
          <div style={{ fontSize:17, fontWeight:800, color:C.accent, letterSpacing:2 }}>
            🛡️ CYBERSÉCURITÉ SOC — ADMINISTRATION PUBLIQUE RDC
          </div>
          <div style={{ fontSize:9, color:C.dim, marginTop:3, letterSpacing:1 }}>
            NIST CSF · ISO/IEC 27001 · NIST SP 800-61 · TSHIMANGA MPOLESHA Excellence — DEA/DES 2025
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:paused?C.orange:C.green, boxShadow:`0 0 8px ${paused?C.orange:C.green}`, animation:paused?"none":"pulse 1.5s infinite" }} />
            <span style={{ color:paused?C.orange:C.green, fontSize:11, fontWeight:700 }}>{paused?"PAUSE":"LIVE"}</span>
          </div>
          <button onClick={()=>setPaused(p=>!p)} style={{ background:paused?C.green+"22":C.orange+"22", border:`1px solid ${paused?C.green:C.orange}`, color:paused?C.green:C.orange, borderRadius:6, padding:"4px 12px", cursor:"pointer", fontSize:11, fontWeight:700 }}>
            {paused?"▶ REPRENDRE":"⏸ PAUSE"}
          </button>
          <div style={{ fontSize:10, color:C.dim, fontFamily:"monospace" }}>{new Date().toLocaleTimeString("fr-FR")}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:14, borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?C.accent+"1a":"transparent", border:`1px solid ${tab===t.id?C.accent:C.border}`, color:tab===t.id?C.accent:C.dim, borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:tab===t.id?700:400, transition:"all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {tab==="dashboard" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <StatCard label="Événements total" value={statData.total_events} icon="📋" color={C.accent} sub="session courante" />
            <StatCard label="Attaques bloquées" value={statData.blocked} icon="🛡️" color={C.green} sub={`${statData.block_rate || 0}% taux blocage`} />
            <StatCard label="Alertes critiques" value={statData.critical} icon="🚨" color={C.red} sub="nécessite action" />
            <StatCard label="Services actifs" value={statData.active_services || 5} icon="⚡" color={C.yellow} sub="Firewall·SIEM·IDS·VPN·DNS" />
            <StatCard label="Score sécurité" value={`${statData.security_score || 0}%`} icon="📊" color={C.purple} sub="NIST composite" />
          </div>

          <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            {[
              { label:"TRAFIC RÉSEAU (paquets/s)", data:trafficData.packets, color:C.accent },
              { label:"ALERTES IDS/IPS", data:trafficData.alerts, color:C.red },
              { label:"CONNEXIONS BLOQUÉES", data:trafficData.blocked, color:C.orange },
            ].map(({ label, data, color }) => (
              <div key={label} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", flex:1 }}>
                <div style={{ fontSize:9, color:C.dim, marginBottom:6, letterSpacing:1 }}>{label}</div>
                <Sparkline data={data || []} color={color} />
              </div>
            ))}
          </div>

          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:C.accent, fontWeight:700, fontSize:12, letterSpacing:1 }}>📋 JOURNAL TEMPS RÉEL — ÉVÉNEMENTS DE SÉCURITÉ</span>
              <span style={{ color:C.dim, fontSize:10 }}>{evList.length} entrées · API : {API}</span>
            </div>
            <div style={{ overflowX:"auto", maxHeight:340, overflowY:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead style={{ position:"sticky", top:0, background:C.bg }}>
                  <tr>{["HEURE","IP SOURCE","DEST.","ATTAQUE","SERVICE","SEGMENT","SÉVÉRITÉ","STATUT","CONTRE-MESURE"].map(h=>(
                    <th key={h} style={{ padding:"7px 10px", color:C.dim, textAlign:"left", fontWeight:600, letterSpacing:0.5, whiteSpace:"nowrap", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {evList.map((e, i) => (
                    <tr key={e.id} style={{ borderTop:`1px solid ${C.border}`, background:i===0?C.accent+"08":"transparent" }}>
                      <td style={{ padding:"6px 10px", color:C.dim, whiteSpace:"nowrap", fontFamily:"monospace" }}>{e.time}</td>
                      <td style={{ padding:"6px 10px", color:C.red, fontFamily:"monospace" }}>{e.src_ip}</td>
                      <td style={{ padding:"6px 10px", color:C.accent, fontFamily:"monospace" }}>{e.dst_ip}</td>
                      <td style={{ padding:"6px 10px", color:e.color, fontWeight:700, whiteSpace:"nowrap" }}>{e.icon} {e.attack_type}</td>
                      <td style={{ padding:"6px 10px", color:C.text }}>{e.service}</td>
                      <td style={{ padding:"6px 10px", color:C.dim }}>{e.segment}</td>
                      <td style={{ padding:"6px 10px" }}><Badge text={e.severity} colorMap={SeverityColor} /></td>
                      <td style={{ padding:"6px 10px" }}><Badge text={e.status} colorMap={StatusColor} /></td>
                      <td style={{ padding:"6px 10px", color:C.green, fontSize:10 }}>{e.defense}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SIMULATION TAB ── */}
      {tab==="simulation" && (
        <div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ color:C.accent, fontWeight:700, fontSize:13, marginBottom:4, letterSpacing:1 }}>⚔️ LABORATOIRE DE SIMULATION D'ATTAQUES CONTRÔLÉES</div>
            <div style={{ color:C.dim, fontSize:11 }}>Démonstration interactive des scénarios d'attaques les plus fréquents sur les réseaux des administrations publiques (RDC) et des contre-mesures NIST CSF / ISO/IEC 27001 correspondantes.</div>
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <SimPanel />
          </div>
        </div>
      )}

      {/* ── NIST TAB ── */}
      {tab==="nist" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ color:C.accent, fontWeight:700, fontSize:12, marginBottom:14, letterSpacing:1 }}>📐 CADRE NIST CSF — MATURITÉ SÉCURITÉ</div>
            <NISTBar label="IDENTIFIER" value={nistData.identify||72} color="#9c27b0" desc="Inventaire actifs, analyse risques" />
            <NISTBar label="PROTÉGER" value={nistData.protect||68} color={C.accent} desc="Contrôle accès, chiffrement, firewall" />
            <NISTBar label="DÉTECTER" value={nistData.detect||81} color={C.yellow} desc="IDS/IPS, SIEM, monitoring 24/7" />
            <NISTBar label="RÉPONDRE" value={nistData.respond||65} color={C.orange} desc="Plan d'incident, isolation réseau" />
            <NISTBar label="RÉCUPÉRER" value={nistData.recover||59} color={C.green} desc="Backup 3-2-1, PCA, PRA" />
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ color:C.yellow, fontWeight:700, fontSize:12, marginBottom:14, letterSpacing:1 }}>📋 ISO/IEC 27001 — ÉTAT DES CONTRÔLES</div>
            {[
              { ctrl:"A.8 — Gestion des actifs", status:"✓ Implémenté", c:C.green },
              { ctrl:"A.9 — Contrôle d'accès (RBAC+MFA)", status:"✓ Implémenté", c:C.green },
              { ctrl:"A.10 — Cryptographie AES-256", status:"⚠ Partiel", c:C.yellow },
              { ctrl:"A.12 — Sécurité opérationnelle", status:"✓ Implémenté", c:C.green },
              { ctrl:"A.13 — Sécurité communications", status:"✓ Implémenté", c:C.green },
              { ctrl:"A.16 — Gestion des incidents", status:"⚠ Partiel", c:C.yellow },
              { ctrl:"A.17 — Continuité activité (PCA)", status:"✗ En cours", c:C.orange },
              { ctrl:"A.18 — Conformité réglementaire", status:"⚠ Partiel", c:C.yellow },
            ].map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:11 }}>
                <span style={{ color:C.text }}>{r.ctrl}</span>
                <span style={{ color:r.c, fontWeight:700 }}>{r.status}</span>
              </div>
            ))}
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16, gridColumn:"1/-1" }}>
            <div style={{ color:C.purple, fontWeight:700, fontSize:12, marginBottom:12, letterSpacing:1 }}>🎯 RECOMMANDATIONS PRIORITAIRES — CONTEXTE RDC</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { p:"P1", title:"Déployer SIEM Wazuh", desc:"Logs centralisés, alertes temps réel, open-source", c:C.red },
                { p:"P1", title:"Segmentation VLANs", desc:"DMZ/LAN/Serveurs/Admin — isolation par zone", c:C.red },
                { p:"P2", title:"MFA obligatoire", desc:"Authentification forte pour tous les comptes admin", c:C.orange },
                { p:"P2", title:"Backup 3-2-1", desc:"3 copies, 2 supports, 1 hors-site. Tests mensuels", c:C.orange },
                { p:"P3", title:"Formation personnel", desc:"Anti-phishing trimestriel + charte informatique", c:C.yellow },
                { p:"P3", title:"PCA/PRA documenté", desc:"RTO < 4h, RPO < 24h, testé 2x/an", c:C.yellow },
              ].map((r,i) => (
                <div key={i} style={{ background:C.bg, border:`1px solid ${r.c}44`, borderLeft:`3px solid ${r.c}`, borderRadius:6, padding:10 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5 }}>
                    <span style={{ background:r.c+"33", color:r.c, borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{r.p}</span>
                    <span style={{ color:r.c, fontWeight:700, fontSize:11 }}>{r.title}</span>
                  </div>
                  <div style={{ color:C.dim, fontSize:10, lineHeight:1.5 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOPOLOGY TAB ── */}
      {tab==="topology" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ color:C.accent, fontWeight:700, fontSize:12, marginBottom:12, letterSpacing:1 }}>🗺️ TOPOLOGIE RÉSEAU ON-PREMISE (Docker)</div>
            <Topology events={evList} />
            <div style={{ marginTop:10, fontSize:10, color:C.dim, display:"flex", gap:14, flexWrap:"wrap" }}>
              <span><span style={{color:C.green}}>■</span> Périmètre sécurisé</span>
              <span><span style={{color:C.accent}}>■</span> Zone DMZ</span>
              <span><span style={{color:C.yellow}}>■</span> Détection IDS</span>
              <span><span style={{color:C.purple}}>■</span> SIEM</span>
              <span><span style={{color:C.red}}>■</span> Attaquant simulé</span>
            </div>
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
            <div style={{ color:C.accent, fontWeight:700, fontSize:12, marginBottom:12, letterSpacing:1 }}>📦 CONTENEURS DOCKER ACTIFS</div>
            {[
              { name:"nginx-proxy", role:"Firewall / Reverse Proxy", net:"172.16.10.2", status:"running", c:C.green },
              { name:"soc-dashboard", role:"Interface SOC (React)", net:"192.168.20.10", status:"running", c:C.green },
              { name:"api-backend", role:"Moteur de sécurité (Flask)", net:"192.168.30.10", status:"running", c:C.green },
              { name:"siem-engine", role:"SIEM — Corrélation événements", net:"192.168.40.20", status:"running", c:C.green },
              { name:"attack-simulator", role:"Lab simulation d'attaques", net:"172.16.10.100", status:"standby", c:C.orange },
            ].map((c,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ color:C.accent, fontWeight:700, fontSize:11, fontFamily:"monospace" }}>{c.name}</div>
                  <div style={{ color:C.dim, fontSize:10 }}>{c.role} · {c.net}</div>
                </div>
                <Badge text={c.status.toUpperCase()} colorMap={{ RUNNING:C.green, STANDBY:C.orange }} fallback={C.dim} />
              </div>
            ))}
          </div>
          <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:16, gridColumn:"1/-1" }}>
            <div style={{ color:C.green, fontWeight:700, fontSize:12, marginBottom:10, letterSpacing:1 }}>📊 FLUX DE TRAITEMENT DES INCIDENTS (NIST SP 800-61)</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              {[
                { step:"1. DÉTECTION", desc:"IDS/SIEM alerte", c:C.yellow },
                { step:"2. TRIAGE", desc:"Évaluation sévérité", c:C.orange },
                { step:"3. CONFINEMENT", desc:"Isolation segment", c:C.red },
                { step:"4. ÉRADICATION", desc:"Suppression menace", c:C.purple },
                { step:"5. REPRISE", desc:"Restauration service", c:C.accent },
                { step:"6. LEÇONS", desc:"Rapport & amélioration", c:C.green },
              ].map((s,i,arr) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ background:s.c+"1a", border:`1px solid ${s.c}`, borderRadius:8, padding:"8px 12px", textAlign:"center", minWidth:88 }}>
                    <div style={{ color:s.c, fontWeight:700, fontSize:10 }}>{s.step}</div>
                    <div style={{ color:C.dim, fontSize:9, marginTop:2 }}>{s.desc}</div>
                  </div>
                  {i<arr.length-1 && <div style={{ color:C.dim, fontSize:16 }}>→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        button:hover{opacity:0.8}
      `}</style>
    </div>
  );
}

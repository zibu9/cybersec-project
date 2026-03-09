import { useState } from "react";
import { C } from "../constants/colors";

export default function SimPanel({ API }) {
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);

  const scenarios = [
    {
      id: "ransomware",
      name: "Ransomware",
      icon: "🔒",
      color: C.red,
      steps: [
        "Email malveillant reçu",
        "Macro Word exécutée",
        "Payload téléchargé",
        "Chiffrement AES des fichiers",
        "Demande de rançon Bitcoin",
      ],
      defense: [
        "Filtrage email (SPF/DKIM/DMARC)",
        "Macro désactivée via GPO",
        "Antivirus/EDR bloque payload",
        "Backup 3-2-1 restauré",
        "IP blacklistée sur firewall",
      ],
    },
    {
      id: "ddos",
      name: "DDoS",
      icon: "🌊",
      color: C.orange,
      steps: [
        "Scan TCP SYN flood détecté",
        "UDP amplification (DNS)",
        "Bande passante saturée à 98%",
        "Service HTTP indisponible",
      ],
      defense: [
        "Rate limiting firewall activé",
        "Black hole routing",
        "Null routing de l'IP source",
        "Service rétabli en 4 min",
      ],
    },
    {
      id: "phishing",
      name: "Phishing",
      icon: "🎣",
      color: C.yellow,
      steps: [
        "Email de phishing envoyé",
        "Lien cliqué par un agent",
        "Faux formulaire de connexion",
        "Credentials capturés",
      ],
      defense: [
        "Proxy filtre l'URL malveillante",
        "Alerte SIEM déclenchée",
        "Compte verrouillé automatiquement",
        "Session MFA invalide = accès refusé",
      ],
    },
    {
      id: "bruteforce",
      name: "Brute Force SSH",
      icon: "🔨",
      color: "#ff6b35",
      steps: ["Scan Nmap du port 22 détecté", "Hydra: 500 tentatives/min", "Comptes ciblés: admin, root"],
      defense: [
        "fail2ban: IP bannie après 5 échecs",
        "Port SSH changé (2222)",
        "Clé RSA obligatoire",
        "Alerte admin envoyée par email",
      ],
    },
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
        body: JSON.stringify({ attack_type: scenario.id }),
      });
      const data = await res.json();
      const allLines = scenario.steps
        .map((s, i) => ({ type: "attack", text: s, delay: i * 600 }))
        .concat(
          scenario.defense.map((d, i) => ({
            type: "defense",
            text: d,
            delay: scenario.steps.length * 600 + i * 500 + 400,
          }))
        );
      allLines.forEach(({ type, text, delay }) => {
        setTimeout(() => setLog((prev) => [...prev, { type, text }]), delay);
      });
      setTimeout(() => {
        setResult(data);
        setRunning(false);
      }, allLines[allLines.length - 1].delay + 700);
    } catch {
      const allLines = scenario.steps
        .map((s, i) => ({ type: "attack", text: s, delay: i * 600 }))
        .concat(
          scenario.defense.map((d, i) => ({
            type: "defense",
            text: d,
            delay: scenario.steps.length * 600 + i * 500 + 400,
          }))
        );
      allLines.forEach(({ type, text, delay }) => {
        setTimeout(() => setLog((prev) => [...prev, { type, text }]), delay);
      });
      setTimeout(() => {
        setResult({ status: "BLOQUÉ", nist_phase: "RÉPONDRE", iso_control: "A.16.1" });
        setRunning(false);
      }, allLines[allLines.length - 1].delay + 700);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => simulate(s)}
            disabled={running}
            style={{
              background: selected?.id === s.id ? s.color + "22" : "transparent",
              border: `1px solid ${selected?.id === s.id ? s.color : C.border}`,
              color: selected?.id === s.id ? s.color : C.dim,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: running ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
              opacity: running && selected?.id !== s.id ? 0.4 : 1,
            }}
          >
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {log.length > 0 && (
        <div
          style={{
            background: C.bg,
            borderRadius: 8,
            padding: 14,
            fontFamily: "monospace",
            fontSize: 12,
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ color: C.dim, fontSize: 10, marginBottom: 10, letterSpacing: 1 }}>
            TERMINAL DE SIMULATION
          </div>
          {log.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, animation: "fadeIn 0.4s ease" }}>
              <span style={{ color: l.type === "attack" ? C.red : C.green, fontWeight: 700, minWidth: 8 }}>
                {l.type === "attack" ? "⚠" : "✓"}
              </span>
              <span style={{ color: l.type === "attack" ? C.red + "cc" : C.green }}>{l.text}</span>
            </div>
          ))}
          {result && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: C.green + "11",
                border: `1px solid ${C.green}44`,
                borderRadius: 6,
              }}
            >
              <span style={{ color: C.green, fontWeight: 800 }}>✅ RÉSULTAT : {result.status}</span>
              <span style={{ color: C.dim, fontSize: 11, marginLeft: 14 }}>
                Phase NIST : {result.nist_phase} | Contrôle ISO : {result.iso_control}
              </span>
            </div>
          )}
          {running && <div style={{ color: C.accent, fontSize: 11, marginTop: 8 }}>● Simulation en cours…</div>}
        </div>
      )}
      {!selected && (
        <div style={{ color: C.dim, textAlign: "center", padding: "30px 0", fontSize: 12 }}>
          Sélectionnez un type d'attaque ci-dessus pour lancer la simulation
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { C } from "./constants/colors";
import useFetch from "./hooks/useFetch";
import DashboardTab from "./tabs/DashboardTab";
import SimulationTab from "./tabs/SimulationTab";
import NISTTab from "./tabs/NISTTab";
import TopologyTab from "./tabs/TopologyTab";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
    { id: "dashboard", label: "SOC Dashboard" },
    { id: "simulation", label: "Lab Simulation" },
    { id: "nist", label: "NIST / ISO27001" },
    { id: "topology", label: "Topologie" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Courier New',monospace",
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        padding: 20,
        fontSize: 13,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.accent, letterSpacing: 2 }}>
            CYBERSÉCURITÉ SOC — ADMINISTRATION PUBLIQUE RDC
          </div>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 3, letterSpacing: 1 }}>
            NIST CSF · ISO/IEC 27001 · NIST SP 800-61 · TSHIMANGA MPOLESHA Excellence — DEA/DES 2025
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: paused ? C.orange : C.green,
                boxShadow: `0 0 8px ${paused ? C.orange : C.green}`,
                animation: paused ? "none" : "pulse 1.5s infinite",
              }}
            />
            <span style={{ color: paused ? C.orange : C.green, fontSize: 11, fontWeight: 700 }}>
              {paused ? "PAUSE" : "LIVE"}
            </span>
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            style={{
              background: paused ? C.green + "22" : C.orange + "22",
              border: `1px solid ${paused ? C.green : C.orange}`,
              color: paused ? C.green : C.orange,
              borderRadius: 6,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {paused ? "REPRENDRE" : "PAUSE"}
          </button>
          <div style={{ fontSize: 10, color: C.dim, fontFamily: "monospace" }}>{new Date().toLocaleTimeString("fr-FR")}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? C.accent + "1a" : "transparent",
              border: `1px solid ${tab === t.id ? C.accent : C.border}`,
              color: tab === t.id ? C.accent : C.dim,
              borderRadius: 6,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: tab === t.id ? 700 : 400,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab statData={statData} trafficData={trafficData} evList={evList} API={API} />}
      {tab === "simulation" && <SimulationTab API={API} />}
      {tab === "nist" && <NISTTab nistData={nistData} />}
      {tab === "topology" && <TopologyTab evList={evList} />}

      <style>{`
        html,body,#root{margin:0;padding:0;min-height:100%;width:100%}
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

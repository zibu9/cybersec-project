import { C } from "../constants/colors";
import SimPanel from "../components/SimPanel";

export default function SimulationTab({ API }) {
  return (
    <div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 4, letterSpacing: 1 }}>
          LABORATOIRE DE SIMULATION D'ATTAQUES CONTRÔLÉES
        </div>
        <div style={{ color: C.dim, fontSize: 11 }}>
          Démonstration interactive des scénarios d'attaques les plus fréquents sur les réseaux des administrations
          publiques (RDC) et des contre-mesures NIST CSF / ISO/IEC 27001 correspondantes.
        </div>
      </div>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <SimPanel API={API} />
      </div>
    </div>
  );
}

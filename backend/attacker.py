"""
Attack Simulator — Nœud attaquant simulé (mode SAFE)
Envoie des scénarios d'attaques contrôlées à l'API backend
"""
import time, os, requests, random
from datetime import datetime

TARGET = os.getenv("TARGET_API", "http://api-backend:5000")
AUTO = os.getenv("AUTO_START", "false").lower() == "true"
ATTACKS = ["ransomware", "ddos", "phishing", "bruteforce"]

print(f"[ATTACKER] Simulateur initialisé → cible: {TARGET}")
print(f"[ATTACKER] Mode: {'AUTO' if AUTO else 'MANUEL (en attente)'}")

if AUTO:
    while True:
        try:
            atk = random.choice(ATTACKS)
            r = requests.post(f"{TARGET}/api/simulate", json={"attack_type": atk}, timeout=5)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Attaque {atk.upper()} → {r.json().get('status','?')}")
        except Exception as e:
            print(f"[ATTACKER] Erreur: {e}")
        time.sleep(random.randint(15, 45))
else:
    print("[ATTACKER] Prêt. Démarrez les simulations depuis le dashboard.")
    while True:
        time.sleep(60)

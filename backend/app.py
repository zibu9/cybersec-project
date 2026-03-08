"""
╔══════════════════════════════════════════════════════════════╗
║  MOTEUR DE CYBERSÉCURITÉ — API BACKEND                       ║
║  TSHIMANGA MPOLESHA Excellence — DEA/DES 2025                ║
║  Standards : NIST CSF · ISO/IEC 27001 · NIST SP 800-61       ║
╚══════════════════════════════════════════════════════════════╝
"""
import random
import time
import json
import os
import math
from datetime import datetime
from collections import deque
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─── State ────────────────────────────────────────────────────────────────
EVENT_BUFFER = deque(maxlen=50)
TRAFFIC_HISTORY = deque(maxlen=40)
ALERT_HISTORY = deque(maxlen=40)
BLOCKED_HISTORY = deque(maxlen=40)
TOTAL_EVENTS = 0
TOTAL_BLOCKED = 0
TOTAL_CRITICAL = 0
START_TIME = time.time()

# ─── Data Pools ───────────────────────────────────────────────────────────
ATTACK_TYPES = [
    {"type": "RANSOMWARE",    "icon": "🔒", "color": "#ff2d55", "weight": 15},
    {"type": "DDoS",          "icon": "🌊", "color": "#ff8c00", "weight": 20},
    {"type": "PHISHING",      "icon": "🎣", "color": "#ffc300", "weight": 25},
    {"type": "BRUTE FORCE",   "icon": "🔨", "color": "#ff6b35", "weight": 20},
    {"type": "SQL INJECTION", "icon": "💉", "color": "#bf5af2", "weight": 10},
    {"type": "MAN-IN-MIDDLE", "icon": "👤", "color": "#00c8ff", "weight": 10},
]
SEVERITIES = ["CRITIQUE", "HAUTE", "MOYENNE", "FAIBLE"]
SEV_WEIGHTS = [10, 25, 40, 25]
STATUSES = ["BLOQUÉ", "BLOQUÉ", "BLOQUÉ", "EN COURS", "ANALYSÉ"]
SERVICES = ["DNS", "HTTP", "SMTP", "RDP", "SSH", "FTP", "LDAP", "SMB", "HTTPS", "NTP"]
SEGMENTS = ["DMZ", "LAN Interne", "Serveurs", "Admin", "WiFi Public"]
DEFENSES = [
    "Firewall rule #42 bloqué ✓",
    "IDS Snort alerte déclenchée ✓",
    "IP bannie par fail2ban ✓",
    "Session RDP terminée ✓",
    "Patch CVE appliqué ✓",
    "Alerte SIEM corrélée ✓",
    "Rate limiting activé ✓",
    "Black hole routing ✓",
    "MFA invalide — accès refusé ✓",
    "Backup restauré — RTO < 4h ✓",
]

EXTERNAL_IPS = [
    "41.243.{}.{}",   # Kinshasa
    "196.200.{}.{}",  # Afrique
    "185.220.{}.{}",  # Tor exit
    "91.121.{}.{}",   # Europe
    "104.16.{}.{}",   # CDN/Attaque
]
INTERNAL_IPS = [
    "192.168.20.{}",  # LAN
    "192.168.30.{}",  # Serveurs
    "192.168.40.{}",  # Admin
]

def rand_ip(pool):
    tmpl = random.choice(pool)
    return tmpl.format(random.randint(1,254), random.randint(1,254)) if tmpl.count("{}") == 2 \
        else tmpl.format(random.randint(1,100))

def weighted_choice(items, key="weight"):
    total = sum(i[key] for i in items)
    r = random.uniform(0, total)
    upto = 0
    for item in items:
        upto += item[key]
        if r <= upto:
            return item
    return items[-1]

def generate_event():
    global TOTAL_EVENTS, TOTAL_BLOCKED, TOTAL_CRITICAL
    TOTAL_EVENTS += 1
    atk = weighted_choice(ATTACK_TYPES)
    severity = random.choices(SEVERITIES, weights=SEV_WEIGHTS)[0]
    status = random.choice(STATUSES)

    if status == "BLOQUÉ":
        TOTAL_BLOCKED += 1
    if severity == "CRITIQUE":
        TOTAL_CRITICAL += 1

    ev = {
        "id": TOTAL_EVENTS,
        "time": datetime.now().strftime("%H:%M:%S"),
        "timestamp": time.time(),
        "src_ip": rand_ip(EXTERNAL_IPS),
        "dst_ip": rand_ip(INTERNAL_IPS),
        "attack_type": atk["type"],
        "icon": atk["icon"],
        "color": atk["color"],
        "service": random.choice(SERVICES),
        "segment": random.choice(SEGMENTS),
        "severity": severity,
        "status": status,
        "defense": random.choice(DEFENSES),
        "nist_phase": random.choice(["IDENTIFIER","PROTÉGER","DÉTECTER","RÉPONDRE","RÉCUPÉRER"]),
        "iso_control": random.choice(["A.9","A.10","A.12","A.13","A.16","A.17"]),
    }
    EVENT_BUFFER.appendleft(ev)
    return ev

def update_traffic():
    base = 40 + 30 * math.sin(time.time() / 60)
    TRAFFIC_HISTORY.append(int(base + random.randint(-15, 25)))
    ALERT_HISTORY.append(random.randint(0, 18))
    BLOCKED_HISTORY.append(random.randint(0, 12))

# ─── Background Event Generator ───────────────────────────────────────────
_last_gen = 0

def maybe_generate():
    global _last_gen
    now = time.time()
    if now - _last_gen > 2.0:
        generate_event()
        update_traffic()
        _last_gen = now

# ─── Routes ───────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return jsonify({
        "service": "CyberSec API Backend",
        "version": "1.0.0",
        "author": "TSHIMANGA MPOLESHA Excellence",
        "standards": ["NIST CSF", "ISO/IEC 27001", "NIST SP 800-61"],
        "status": "running",
        "uptime_seconds": int(time.time() - START_TIME),
    })

@app.route("/api/events")
def get_events():
    maybe_generate()
    limit = min(int(request.args.get("limit", 20)), 50)
    return jsonify({
        "events": list(EVENT_BUFFER)[:limit],
        "total": TOTAL_EVENTS,
        "timestamp": datetime.now().isoformat(),
    })

@app.route("/api/stats")
def get_stats():
    maybe_generate()
    block_rate = round((TOTAL_BLOCKED / max(TOTAL_EVENTS, 1)) * 100)
    security_score = min(100, int(55 + block_rate * 0.4 + random.randint(-3, 3)))
    return jsonify({
        "total_events": TOTAL_EVENTS,
        "blocked": TOTAL_BLOCKED,
        "critical": TOTAL_CRITICAL,
        "block_rate": block_rate,
        "security_score": security_score,
        "active_services": 5,
        "uptime": int(time.time() - START_TIME),
        "timestamp": datetime.now().isoformat(),
    })

@app.route("/api/traffic")
def get_traffic():
    maybe_generate()
    return jsonify({
        "packets": list(TRAFFIC_HISTORY),
        "alerts": list(ALERT_HISTORY),
        "blocked": list(BLOCKED_HISTORY),
        "timestamp": datetime.now().isoformat(),
    })

@app.route("/api/nist")
def get_nist():
    t = time.time()
    scores = {
        "identify": int(72 + 6 * math.sin(t / 120)),
        "protect":  int(68 + 7 * math.sin(t / 90 + 1)),
        "detect":   int(81 + 5 * math.sin(t / 100 + 2)),
        "respond":  int(65 + 8 * math.sin(t / 80 + 3)),
        "recover":  int(59 + 6 * math.sin(t / 110 + 4)),
    }
    return jsonify({
        "scores": scores,
        "composite": int(sum(scores.values()) / len(scores)),
        "framework": "NIST CSF v1.1",
        "iso_standard": "ISO/IEC 27001:2022",
        "timestamp": datetime.now().isoformat(),
    })

@app.route("/api/simulate", methods=["POST"])
def simulate_attack():
    data = request.get_json() or {}
    attack_type = data.get("attack_type", "ransomware").lower()

    SCENARIOS = {
        "ransomware": {
            "steps": 5, "severity": "CRITIQUE",
            "nist_phase": "RÉPONDRE", "iso_control": "A.16.1.5",
            "defense_time_seconds": 47,
            "status": "BLOQUÉ",
        },
        "ddos": {
            "steps": 4, "severity": "HAUTE",
            "nist_phase": "DÉTECTER", "iso_control": "A.13.1.1",
            "defense_time_seconds": 12,
            "status": "BLOQUÉ",
        },
        "phishing": {
            "steps": 4, "severity": "HAUTE",
            "nist_phase": "PROTÉGER", "iso_control": "A.9.4.2",
            "defense_time_seconds": 8,
            "status": "BLOQUÉ",
        },
        "bruteforce": {
            "steps": 3, "severity": "HAUTE",
            "nist_phase": "DÉTECTER", "iso_control": "A.9.4.3",
            "defense_time_seconds": 6,
            "status": "BLOQUÉ",
        },
    }

    scenario = SCENARIOS.get(attack_type, SCENARIOS["ddos"])

    # Log the simulated attack
    generate_event()

    return jsonify({
        "attack_type": attack_type,
        "status": scenario["status"],
        "severity": scenario["severity"],
        "nist_phase": scenario["nist_phase"],
        "iso_control": scenario["iso_control"],
        "defense_time_seconds": scenario["defense_time_seconds"],
        "siem_alert": True,
        "firewall_rule_triggered": True,
        "timestamp": datetime.now().isoformat(),
        "message": f"Attaque {attack_type.upper()} simulée, contrée en {scenario['defense_time_seconds']}s",
    })

@app.route("/api/health")
def health():
    return jsonify({"status": "healthy", "uptime": int(time.time() - START_TIME)})

# ─── Pre-fill buffer ───────────────────────────────────────────────────────
for _ in range(15):
    generate_event()
    update_traffic()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

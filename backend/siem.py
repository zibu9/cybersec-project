"""
SIEM Engine — Moteur de corrélation d'événements
Simule Wazuh / ELK Stack pour la démonstration
"""
import time, random, json, os
from datetime import datetime
from collections import deque
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CORRELATED = deque(maxlen=200)
RULES_FIRED = 0
START = time.time()

RULES = [
    {"id":"R001","name":"Multiple failed logins","severity":"HAUTE","mitre":"T1110"},
    {"id":"R002","name":"Ransomware file extension change","severity":"CRITIQUE","mitre":"T1486"},
    {"id":"R003","name":"DNS tunneling detected","severity":"HAUTE","mitre":"T1071.004"},
    {"id":"R004","name":"Port scan from external IP","severity":"MOYENNE","mitre":"T1046"},
    {"id":"R005","name":"Lateral movement via SMB","severity":"CRITIQUE","mitre":"T1021.002"},
    {"id":"R006","name":"Outbound data exfiltration","severity":"CRITIQUE","mitre":"T1041"},
]

def correlate():
    global RULES_FIRED
    rule = random.choice(RULES)
    RULES_FIRED += 1
    alert = {
        "alert_id": RULES_FIRED,
        "rule_id": rule["id"],
        "rule_name": rule["name"],
        "severity": rule["severity"],
        "mitre_technique": rule["mitre"],
        "time": datetime.now().strftime("%H:%M:%S"),
        "agent": f"agent-{random.randint(1,10):02d}",
        "correlated": True,
    }
    CORRELATED.appendleft(alert)
    return alert

for _ in range(20):
    correlate()
    time.sleep(0.01)

@app.route("/")
def index():
    return jsonify({"service": "SIEM Engine", "status": "running", "rules_fired": RULES_FIRED})

@app.route("/api/alerts")
def alerts():
    correlate()
    return jsonify({"alerts": list(CORRELATED)[:30], "total": RULES_FIRED})

@app.route("/api/rules")
def rules():
    return jsonify({"rules": RULES, "active": len(RULES)})

@app.route("/api/health")
def health():
    return jsonify({"status": "healthy", "uptime": int(time.time() - START)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9200, debug=False)

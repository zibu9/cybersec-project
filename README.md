# 🛡️ PROTOTYPE CYBERSÉCURITÉ SOC — ADMINISTRATION PUBLIQUE RDC

**TSHIMANGA MPOLESHA Excellence — Mémoire DEA/DES 2025**  
*Étude portant sur le déploiement d'un système de cybersécurité contre les attaques dans un environnement hybride*

---

## 📋 Description du prototype

Ce projet Docker démontre de manière **applicative et pratique** les contributions du mémoire :

- **SOC Dashboard** en temps réel avec alertes de sécurité
- **Simulation d'attaques contrôlées** (Ransomware, DDoS, Phishing, Brute Force)
- **Contre-mesures NIST CSF / ISO 27001** appliquées automatiquement
- **Topologie réseau on-premise** avec segmentation VLANs
- **Moteur SIEM** de corrélation d'événements

---

## 🏗️ Architecture des conteneurs

```
┌─────────────────────────────────────────────────────────┐
│  INTERNET (simulé)                                       │
│         │                                                │
│  ┌──────▼──────┐  172.16.10.0/24 (DMZ)                  │
│  │ nginx-proxy │◄─── attack-simulator (172.16.10.100)   │
│  │  (Firewall) │                                         │
│  └──────┬──────┘                                         │
│         │ 192.168.20.0/24 (LAN Interne)                  │
│  ┌──────▼──────┐                                         │
│  │soc-dashboard│  (React — Interface SOC)                │
│  └──────┬──────┘                                         │
│         │ 192.168.30.0/24 (Serveurs)                     │
│  ┌──────▼──────┐     ┌──────────────┐                   │
│  │ api-backend │────►│ siem-engine  │                   │
│  │  (Flask)    │     │ (WAZUH-like) │                   │
│  └─────────────┘     └──────────────┘                   │
│                       192.168.40.0/24 (Admin SOC)        │
└─────────────────────────────────────────────────────────┘
```

| Conteneur | Rôle | IP | Port |
|---|---|---|---|
| `nginx-proxy` | Pare-feu / Reverse Proxy | 172.16.10.2 | 80 |
| `soc-dashboard` | Interface SOC (React) | 192.168.20.10 | 3000 |
| `api-backend` | Moteur sécurité (Flask API) | 192.168.30.10 | 5000 |
| `siem-engine` | Corrélation événements (SIEM) | 192.168.40.20 | 9200 |
| `attack-simulator` | Lab simulation attaques | 172.16.10.100 | — |

---

## 🚀 Démarrage rapide

### Prérequis
- **Docker Desktop** installé et démarré ([télécharger](https://www.docker.com/products/docker-desktop))
- Port 80 et 5000 disponibles

### Lancer le prototype

```bash
# 1. Cloner / copier le dossier du projet
cd cybersec-project

# 2. Rendre le script exécutable
chmod +x start.sh stop.sh

# 3. Démarrer (premier lancement : ~3-5 min pour construire les images)
./start.sh

# OU sur Windows :
docker compose up --build -d
```

### Accéder au dashboard

Ouvrir dans le navigateur : **http://localhost**

---

## 🎯 Guide de démonstration devant les jurés

### Étape 1 — Présenter le Dashboard SOC
- Onglet **"🖥️ SOC Dashboard"**
- Montrer les événements de sécurité générés en temps réel
- Expliquer : IDS/IPS, SIEM, segmentation réseau

### Étape 2 — Simuler une attaque Ransomware
- Onglet **"⚔️ Lab Simulation"**
- Cliquer sur **🔒 Ransomware**
- Décrire chaque étape : email malveillant → macro → payload → chiffrement
- Montrer les contre-mesures NIST appliquées automatiquement

### Étape 3 — Montrer le cadre NIST / ISO 27001
- Onglet **"📐 NIST / ISO27001"**
- Expliquer les 5 fonctions NIST : Identifier → Protéger → Détecter → Répondre → Récupérer
- Montrer le score de maturité sécurité

### Étape 4 — Expliquer la topologie réseau
- Onglet **"🗺️ Topologie"**
- Montrer la segmentation VLANs (DMZ / LAN / Serveurs / Admin)
- Expliquer le rôle de chaque conteneur Docker

---

## 📚 Standards implémentés

| Standard | Application dans le prototype |
|---|---|
| **NIST CSF v1.1** | 5 fonctions : Identifier, Protéger, Détecter, Répondre, Récupérer |
| **ISO/IEC 27001:2022** | Contrôles A.8, A.9, A.10, A.12, A.13, A.16, A.17 |
| **NIST SP 800-61** | Processus de réponse aux incidents (6 phases) |
| **MITRE ATT&CK** | Techniques T1110, T1486, T1071, T1046, T1021 |

---

## 🛠️ Commandes utiles

```bash
# Voir les logs en direct
docker compose logs -f api-backend

# État des conteneurs
docker compose ps

# Relancer uniquement l'API
docker compose restart api-backend

# Arrêter tout
./stop.sh
# ou : docker compose down

# Nettoyer les images (après soutenance)
docker compose down --rmi all
```

---

*© TSHIMANGA MPOLESHA Excellence — DEA/DES Cybersécurité — 2025*  
*République Démocratique du Congo*

#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  LANCEMENT DU PROTOTYPE — SOUTENANCE DEA/DES                     ║
# ║  TSHIMANGA MPOLESHA Excellence — Cybersécurité RDC               ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

banner() {
  echo -e "${CYAN}"
  echo "  ╔════════════════════════════════════════════════════════╗"
  echo "  ║        CYBERSÉCURITÉ SOC — ADMINISTRATION RDC          ║"
  echo "  ║     TSHIMANGA MPOLESHA Excellence — DEA/DES 2025       ║"
  echo "  ║     NIST CSF · ISO/IEC 27001 · NIST SP 800-61          ║"
  echo "  ╚════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
}

check_docker() {
  if ! command -v docker &>/dev/null; then
    echo -e "${RED}❌  Docker n'est pas installé.${RESET}"
    echo "    Installez Docker Desktop : https://www.docker.com/products/docker-desktop"
    exit 1
  fi
  if ! docker info &>/dev/null; then
    echo -e "${RED}❌  Docker daemon n'est pas démarré.${RESET}"
    echo "    Démarrez Docker Desktop et réessayez."
    exit 1
  fi
  echo -e "${GREEN}✓  Docker détecté : $(docker --version | cut -d' ' -f3 | tr -d ',')${RESET}"
}

build_images() {
  echo -e "\n${YELLOW}▶  Construction des images Docker...${RESET}"
  docker compose build --no-cache --parallel=false 2>&1 | while read line; do
    echo -e "   ${CYAN}│${RESET} $line"
  done
  echo -e "${GREEN}✓  Images construites${RESET}"
}

start_services() {
  echo -e "\n${YELLOW}▶  Démarrage des conteneurs...${RESET}"
  docker compose up -d
  echo -e "${GREEN}✓  Conteneurs démarrés${RESET}"
}

wait_ready() {
  echo -e "\n${YELLOW}▶  Attente de démarrage des services...${RESET}"
  local max=30; local count=0
  while ! curl -sf http://localhost:5000/api/health &>/dev/null; do
    sleep 1; count=$((count+1))
    if [ $count -ge $max ]; then
      echo -e "${RED}⚠  API backend lent à démarrer (normal au premier lancement)${RESET}"
      break
    fi
    printf "   Attente... %ds\r" "$count"
  done
  echo -e "${GREEN}✓  Services prêts${RESET}"
}

show_urls() {
  echo -e "\n${BOLD}${GREEN}╔══════════════════════════════════════════════════════╗${RESET}"
  echo -e "${BOLD}${GREEN}  ║  ✅  PROTOTYPE DÉMARRÉ — PRÊT POUR LA SOUTENANCE     ║${RESET}"
  echo -e "${BOLD}${GREEN}  ╚══════════════════════════════════════════════════════╝${RESET}\n"
  echo -e "  ${BOLD}🖥️  Dashboard SOC :${RESET}      ${CYAN}http://localhost${RESET}"
  echo -e "  ${BOLD}⚙️  API Backend :${RESET}         ${CYAN}http://localhost:5000${RESET}"
  echo -e "  ${BOLD}👁️  SIEM Engine :${RESET}         ${CYAN}http://localhost:9200${RESET} (interne)"
  echo -e ""
  echo -e "  ${BOLD}📋 Commandes utiles :${RESET}"
  echo -e "     ${YELLOW}docker compose logs -f api-backend${RESET}   # Voir les logs en direct"
  echo -e "     ${YELLOW}docker compose ps${RESET}                    # État des conteneurs"
  echo -e "     ${YELLOW}./stop.sh${RESET}                            # Arrêter le prototype"
  echo -e ""
  echo -e "  ${BOLD}🎯 Pour la démo devant les jurés :${RESET}"
  echo -e "     1. Ouvrez ${CYAN}http://localhost${RESET} dans votre navigateur"
  echo -e "     2. Onglet '⚔️ Lab Simulation' → lancez une attaque"
  echo -e "     3. Revenez sur '🖥️ SOC Dashboard' → observez les alertes"
  echo ""
}

show_containers() {
  echo -e "${BOLD}📦 Conteneurs actifs :${RESET}"
  docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || docker compose ps
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────
banner
check_docker

case "${1:-start}" in
  start|"")
    build_images
    start_services
    wait_ready
    show_urls
    show_containers
    ;;
  quick)
    echo -e "${YELLOW}▶  Démarrage rapide (sans rebuild)...${RESET}"
    docker compose up -d
    wait_ready
    show_urls
    ;;
  logs)
    docker compose logs -f --tail=50
    ;;
  status)
    show_containers
    ;;
  *)
    echo "Usage: $0 [start|quick|logs|status]"
    ;;
esac

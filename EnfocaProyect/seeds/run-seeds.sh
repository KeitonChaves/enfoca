#!/usr/bin/env bash
set -euo pipefail

SEEDS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_seed() {
  local container="$1"
  local user="$2"
  local db="$3"
  local file="$4"

  echo "  → $container / $db ..."
  docker exec -i "$container" psql -U "$user" -d "$db" < "$file"
  echo "    OK"
}

echo ""
echo "Ejecutando seeds de Enfoca..."
echo ""

run_seed "auth-db"          "postgres"  "enfoca_auth"         "$SEEDS_DIR/01_auth-service.sql"
run_seed "pomodoro-db"      "enfoca"    "enfoca"              "$SEEDS_DIR/02_pomodoro-service.sql"
run_seed "ai-db"            "postgres"  "enfoca_planes"       "$SEEDS_DIR/03_ai-service.sql"
run_seed "gamification-db"  "postgres"  "enfoca_gamification" "$SEEDS_DIR/04_gamification-service.sql"
run_seed "metrics-db"       "postgres"  "enfoca_metrics"      "$SEEDS_DIR/05_metrics-service.sql"

echo ""
echo "Seeds completados."
echo ""
echo "Usuarios de prueba:"
echo "  email: felipe@test.com  | contraseña: Enfoca2026!"
echo "  email: maria@test.com   | contraseña: Enfoca2026!"
echo "  email: carlos@test.com  | contraseña: Enfoca2026!"
echo ""

#!/bin/bash
SERVICES=(
  "emergency-plumber"
  "bathroom-installation"
  "boiler-repair"
  "boiler-installation"
  "blocked-drains"
  "leak-repair"
  "wet-room-installation"
  "underfloor-heating"
  "central-heating"
  "gas-engineer"
)

for SERVICE in "${SERVICES[@]}"; do
  COUNT=$(ls /var/www/plumbernearme247/src/data/content/$SERVICE/*.json 2>/dev/null | wc -l)
  if [ "$COUNT" -ge 555 ]; then
    echo "Skipping $SERVICE — already complete ($COUNT files)"
    continue
  fi
  echo "Starting $SERVICE..."
  node /var/www/plumbernearme247/scripts/generate-content.js $SERVICE >> /tmp/gen-all.log 2>&1
  echo "Completed $SERVICE"
done

echo "All services done!"

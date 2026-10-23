#!/bin/bash
cd "$(dirname "$0")"
echo "Запуск лендинга angrove..."
sleep 1 && open "http://localhost:4173/" &
node ./node_modules/vite/bin/vite.js preview --port 4173

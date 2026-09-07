#!/bin/bash
# Lumen Reader · abrir sin internet (Linux)
# En terminal:  chmod +x Abrir-Lumen.sh  y luego  ./Abrir-Lumen.sh
cd "$(dirname "$0")"

if command -v node >/dev/null 2>&1; then
  node servidor.js
elif command -v python3 >/dev/null 2>&1; then
  python3 servidor.py
else
  echo ""
  echo "  No se encontró Node.js ni Python. Son gratuitos:"
  echo "    Node.js : https://nodejs.org"
  echo "    Python  : https://www.python.org"
  echo ""
  read -r -p "Pulsa Enter para cerrar…"
fi

#!/bin/bash
# Lumen Reader · abrir sin internet (macOS)
# Doble clic para abrir la app en tu navegador.
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
  echo "  O sube esta carpeta a un hosting, o instala la app desde Safari/Chrome."
  echo ""
  read -r -p "Pulsa Enter para cerrar…"
fi

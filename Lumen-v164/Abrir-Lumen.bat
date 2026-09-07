@echo off
rem ============================================================
rem  Lumen Reader · abrir sin internet (Windows)
rem  Doble clic aqui para abrir la app en tu navegador.
rem  Usa Node.js o Python si los tienes; si no, te lo dice.
rem ============================================================
cd /d "%~dp0"
title Lumen Reader

where node >nul 2>nul
if %errorlevel%==0 (
  node servidor.js
  goto fin
)

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 servidor.py
  goto fin
)

where python >nul 2>nul
if %errorlevel%==0 (
  python servidor.py
  goto fin
)

echo.
echo  No se encontro Node.js ni Python en este equipo.
echo  Son gratuitos y se instalan en un minuto:
echo    Node.js : https://nodejs.org
echo    Python  : https://www.python.org
echo.
echo  Otra opcion: sube esta carpeta a un hosting (GitHub Pages,
echo  Netlify...) o instalala como app desde un navegador.
echo.
pause

:fin

@echo off
setlocal
title Servidor B2B Empresas

echo ==========================================
echo   INICIANDO SERVIDOR DE DESARROLLO...
echo ==========================================

:: Abrir el navegador automáticamente a localhost:3000
start "" "https://www.b2bempresas.com"
start "" "http://localhost:3000"

:: Ejecutar servidor de desarrollo
npm.cmd run dev
pause

@echo off
setlocal
title Servidor B2B Empresas

echo ==========================================
echo   INICIANDO SERVIDOR DE DESARROLLO...
echo ==========================================

:: Abrir el aplicativo automáticamente (con un pequeño retraso de 15 segundos)
start /min cmd /c "timeout /t 15 > nul && start \"\" \"C:\Program Files\Google\Chrome\Application\chrome_proxy.exe\" --profile-directory=\"Profile 8\" --app-id=ljlegbjchnncmcmdeidanohnblglbjil"

:: Usar npm.cmd explícitamente para evitar problemas de ejecución de scripts de PowerShell
npm.cmd run dev
pause

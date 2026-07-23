@echo off
setlocal

echo ================================================
echo VLUX OWNER - PUBLICAR API DEMO CON TAILSCALE FUNNEL
echo ================================================

echo Se publicara SOLO la ruta montada en /vlux-owner-api usando el puerto 8443.
echo El endpoint interno sigue protegido por un token secreto.
echo.

tailscale funnel --bg --https=8443 --set-path=/vlux-owner-api http://127.0.0.1:8069/vlux_owner/api/share/dashboard

if errorlevel 1 (
  echo.
  echo [ERROR] Tailscale Funnel no pudo iniciar.
  echo Revisa el mensaje anterior. Puede requerir autorizar Funnel en el panel de Tailscale.
  pause
  exit /b 1
)

echo.
echo [OK] API demo publicada.
echo URL esperada:
echo https://vlux.taile8f1bd.ts.net:8443/vlux-owner-api
pause
endlocal

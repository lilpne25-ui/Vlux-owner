@echo off
setlocal EnableExtensions EnableDelayedExpansion
call "%~dp000_CONFIG.bat"

echo ================================================
echo VLUX OWNER - CONFIGURAR TOKEN DEMO VERCEL
echo ================================================

for /f "usebackq delims=" %%T in (`"%ODOO_PY%" -c "import secrets; print(secrets.token_urlsafe(48))"`) do set "VLUX_TOKEN=%%T"

if not defined VLUX_TOKEN (
  echo [ERROR] No se pudo generar el token.
  pause
  exit /b 1
)

set "VLUX_OWNER_DEMO_TOKEN=%VLUX_TOKEN%"

(
  echo import os
  echo params = env['ir.config_parameter'].sudo()
  echo params.set_param('vlux_owner.demo_api_token', os.environ['VLUX_OWNER_DEMO_TOKEN'])
  echo params.set_param('vlux_owner.demo_user_id', '2')
  echo env.cr.commit()
  echo print('TOKEN_CONFIGURADO_OK')
) | "%ODOO_PY%" "%ODOO_BIN%" shell -c "%ODOO_CONF%" -d "%ODOO_DB%"

if errorlevel 1 (
  echo [ERROR] No se pudo guardar el token en Odoo.
  pause
  exit /b 1
)

echo.
echo [OK] Token configurado en Odoo.
echo.
echo GUARDA ESTE VALOR EN VERCEL COMO VLUX_OWNER_API_TOKEN:
echo --------------------------------------------------------
echo %VLUX_TOKEN%
echo --------------------------------------------------------
echo.
echo No lo publiques en GitHub ni lo compartas con el cliente.
pause
endlocal

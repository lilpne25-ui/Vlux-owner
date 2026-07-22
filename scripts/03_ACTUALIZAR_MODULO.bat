@echo off
setlocal
call "%~dp000_CONFIG.bat"
set "SOURCE=%~dp0..\odoo_addon\vlux_owner"
set "TARGET=%ODOO_ADDONS%\vlux_owner"

echo [1/2] Sincronizando modulo...
if exist "%TARGET%" rmdir /s /q "%TARGET%"
xcopy "%SOURCE%" "%TARGET%\" /E /I /Y >nul
if errorlevel 1 exit /b 1

echo [2/2] Actualizando modulo en %ODOO_DB%...
"%ODOO_PY%" "%ODOO_BIN%" -c "%ODOO_CONF%" -d "%ODOO_DB%" -u vlux_owner --stop-after-init
if errorlevel 1 exit /b 1

echo [OK] VLUX Owner actualizado.
endlocal

@echo off
setlocal
call "%~dp000_CONFIG.bat"
"%ODOO_PY%" "%ODOO_BIN%" -c "%ODOO_CONF%" -d "%ODOO_DB%"
endlocal

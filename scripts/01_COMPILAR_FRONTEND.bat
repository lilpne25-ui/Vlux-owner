@echo off
setlocal
set "SOURCE=%~dp0..\frontend\src"
set "TARGET=%~dp0..\odoo_addon\vlux_owner\static\dist\assets"
if not exist "%TARGET%" mkdir "%TARGET%"
copy /Y "%SOURCE%\app.js" "%TARGET%\app.js" >nul
copy /Y "%SOURCE%\styles.css" "%TARGET%\app.css" >nul
if errorlevel 1 exit /b 1
echo [OK] Frontend VLUX Owner sincronizado con el addon.
endlocal

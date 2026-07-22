# Instalación en el servidor actual

## 1. Copiar el paquete al servidor

Clona o descarga el repositorio.

## 2. Ejecutar

`scripts\02_INSTALAR_MODULO.bat`

El script copia `vlux_owner` a:

`C:\Odoo\custom_addons\vlux_owner`

Y ejecuta la instalación en:

`vlux_odoo_dev`

## 3. Dar acceso al propietario

Asigna al usuario de Odoo el grupo:

`VLUX Owner`

## 4. Iniciar Odoo

Ejecuta tu inicio normal de Odoo o `scripts\04_INICIAR_ODOO.bat`.

## 5. Abrir la app

`https://vlux.taile8f1bd.ts.net/vlux-owner/`

El usuario debe tener Tailscale mientras se mantenga este esquema de acceso privado.

## 6. Instalar como app

Desde el navegador móvil usa **Instalar aplicación** / **Agregar a pantalla de inicio**.

## Desarrollo del frontend

Para recompilar después de modificar el frontend:

`scripts\01_COMPILAR_FRONTEND.bat`

Después ejecuta:

`scripts\03_ACTUALIZAR_MODULO.bat`

# VLUX Owner V1.0.2 — Safe Area Fix

Aplicación móvil PWA conectada a Odoo 19 Community para que el propietario supervise su negocio desde el celular.

## Estado actual

La V1.0.2 fue validada en el servidor y en iPhone con datos reales de Odoo.

- Dashboard móvil negro + morado.
- Ventas confirmadas del día.
- Tickets.
- Productos vendidos.
- Ticket promedio.
- Comparación contra ayer a la misma hora.
- Ventas por caja.
- Tendencia de ventas.
- Productos más vendidos.
- Últimas ventas confirmadas.
- Inventario bajo.
- Actualización automática cada 30 segundos.
- PWA instalable en iPhone/Android.
- Safe areas de iOS corregidas.
- Autenticación con sesión Odoo.
- Acceso restringido mediante el grupo `VLUX Owner`.

## Arquitectura

- **Addon Odoo:** `vlux_owner`
- **Backend/API:** controladores y servicio agregado dentro de Odoo.
- **Frontend:** JavaScript + CSS compilado dentro del addon.
- **PWA:** manifest + Service Worker + iconos.
- **Autenticación:** sesión normal de Odoo, sin API keys en JavaScript.
- **Actualización:** polling cada 30 segundos.
- **Ruta:** `/vlux-owner/`

## Estados de POS considerados venta real

`paid`, `done`, `invoiced`.

## Estructura

- `odoo_addon/vlux_owner/`: módulo Odoo 19.
- `frontend/`: código fuente visual de la PWA.
- `scripts/`: scripts BAT para instalación, actualización y arranque.
- `ARQUITECTURA.md`: diseño técnico y roadmap.
- `API_CONTRACT.md`: contrato de datos.

## Instalación rápida

1. Ejecuta `scripts\01_COMPILAR_FRONTEND.bat` si modificaste el frontend.
2. Ejecuta `scripts\02_INSTALAR_MODULO.bat` para una instalación nueva.
3. Asigna al usuario el grupo `VLUX Owner`.
4. Inicia Odoo con `scripts\04_INICIAR_ODOO.bat` o tu proceso habitual.
5. Abre `/vlux-owner/` desde el dominio HTTPS del servidor.

## Actualización

Ejecuta `scripts\03_ACTUALIZAR_MODULO.bat` y reinicia Odoo.

## Versión

`19.0.1.0.2`

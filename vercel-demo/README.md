# VLUX Owner · Vercel Live Demo

Frontend público de demostración que muestra datos reales de Odoo sin exponer credenciales ni el token del backend en el navegador.

## Flujo

Cliente → Vercel → `/api/dashboard` → endpoint privado de VLUX Owner → Odoo 19.

## Variables de entorno en Vercel

Configura estas variables en Production, Preview y Development según corresponda:

- `VLUX_OWNER_API_URL`: URL pública del puente de lectura, por ejemplo `https://HOST.ts.net:8443/vlux-owner-api`.
- `VLUX_OWNER_API_TOKEN`: token secreto configurado en Odoo como `vlux_owner.demo_api_token`.
- `VLUX_DEMO_ACCESS_CODE`: código corto que VLUX comparte con el cliente para entrar a la demo.

Nunca guardes esos valores en GitHub.

## Configuración del proyecto Vercel

Al importar el repositorio selecciona:

- **Root Directory:** `vercel-demo`
- **Framework Preset:** Other
- **Build Command:** vacío
- **Output Directory:** vacío

Después agrega las variables de entorno y despliega.

## Actualización

El navegador consulta `/api/dashboard` cada 15 segundos. La Function de Vercel reenvía la solicitud al backend VLUX usando el token secreto almacenado en el entorno del proyecto.

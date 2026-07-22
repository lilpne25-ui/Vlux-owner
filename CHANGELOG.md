# VLUX Owner — Changelog

## 19.0.1.0.2

- Corrige la superposición del encabezado con la barra de estado de iOS al ejecutar la PWA instalada.
- Respeta `safe-area-inset-top`, `safe-area-inset-bottom`, `safe-area-inset-left` y `safe-area-inset-right` en modo standalone.
- Aumenta el espacio inferior del contenido para evitar que la navegación fija cubra gráficas o listas.
- Usa `100dvh` como altura dinámica cuando está disponible.
- Fuerza la carga de CSS/JS V1.0.2 mediante versionado de URL.
- Incrementa la versión del cache del Service Worker.
- No modifica la API, métricas, permisos ni consultas a Odoo.

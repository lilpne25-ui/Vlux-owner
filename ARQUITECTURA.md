# Arquitectura VLUX Owner V1

## Flujo

Odoo POS -> `pos.order` confirmado -> `vlux.owner.dashboard.service` -> JSON-RPC autenticado -> PWA -> celular del propietario.

## Seguridad

1. El usuario debe iniciar sesión en Odoo.
2. Debe pertenecer al grupo **VLUX Owner**.
3. Los endpoints usan `auth="user"`.
4. El navegador no contiene contraseñas ni API keys.
5. Las lecturas agregadas se ejecutan con `sudo()` únicamente después de validar el grupo.
6. HTTPS debe mantenerse en producción.

## Decisiones de V1

### Misma procedencia

La PWA se sirve desde el mismo Odoo. Beneficios:

- reutiliza cookie de sesión;
- no hay CORS;
- no hay un segundo servicio que desplegar;
- se puede instalar como PWA;
- encaja con el HTTPS actual de Tailscale Serve.

### Una llamada de dashboard

`/vlux_owner/api/dashboard` devuelve todo lo necesario para la pantalla principal. Reduce latencia móvil y simplifica sincronización.

### Comparación vs ayer

Cuando se consulta el día actual, compara contra ayer **hasta la misma hora actual**, no contra todo el día de ayer.

### Tiempo real

V1 refresca cada 30 segundos. V2 puede conectarse al bus/WebSocket de Odoo para push real.

## Roadmap

### V1.1

- Filtros por sucursal, caja y periodo.
- Umbral de stock por producto.
- Devoluciones separadas.
- Vista de detalle de venta.

### V1.2

- Bus/WebSocket.
- Alertas push.
- Multiempresa/multisucursal.
- Metas de venta.

### V2

- Login específico para propietarios sin exposición del backend de Odoo.
- Tokens rotatorios o gateway dedicado.
- Publicación como app empaquetada si comercialmente se requiere App Store/Play Store.

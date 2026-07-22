# Frontend VLUX Owner

La V1 usa JavaScript, CSS y Canvas sin dependencias externas para que el addon se pueda instalar directamente en Odoo sin Node.js en producción.

- `src/app.js`: aplicación móvil.
- `src/styles.css`: tema negro + morado.

El script `scripts/01_COMPILAR_FRONTEND.bat` copia estos archivos al `static/dist` del addon.

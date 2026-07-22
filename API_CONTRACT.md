# Contrato JSON - VLUX Owner V1

## Endpoint

`POST /vlux_owner/api/dashboard`

Tipo Odoo: `jsonrpc`

Autenticación: sesión de usuario Odoo con grupo `VLUX Owner`.

## Parámetros

```json
{
  "date": "2026-07-22"
}
```

`date` es opcional. Sin fecha se usa el día actual según la zona horaria del usuario.

## Respuesta simplificada

```json
{
  "generated_at": "2026-07-22 20:00:00Z",
  "date_label": "22/07/2026",
  "currency": { "symbol": "$", "position": "before", "decimals": 2 },
  "store": { "company_name": "Mi Tienda", "user_name": "Juan" },
  "summary": {
    "sales_today": 14580.0,
    "tickets": 84,
    "units_sold": 237,
    "average_ticket": 173.57,
    "comparison_vs_yesterday_pct": 18.2
  },
  "sales_trend": [],
  "sales_by_register": [],
  "top_products": [],
  "latest_sales": [],
  "low_stock": [],
  "meta": {
    "comparison_mode": "same_elapsed_time",
    "order_states": ["paid", "done", "invoiced"]
  }
}
```

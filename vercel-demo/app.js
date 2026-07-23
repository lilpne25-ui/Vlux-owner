const root = document.getElementById("root");

const state = {
  data: null,
  tab: "summary",
  error: null,
  loading: false,
  code: sessionStorage.getItem("vlux_demo_code") || "",
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
})[char]);

function money(value) {
  const currency = state.data?.currency || { symbol: "$", position: "before", decimals: 2 };
  const amount = Number(value || 0).toLocaleString("es-MX", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });
  return currency.position === "after" ? `${amount} ${currency.symbol}` : `${currency.symbol}${amount}`;
}

async function fetchDashboard() {
  if (!state.code) {
    render();
    return;
  }

  state.loading = !state.data;
  state.error = null;
  render();

  try {
    const response = await fetch("/api/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VLUX-Demo-Code": state.code,
      },
      body: JSON.stringify({}),
    });

    if (response.status === 401) {
      sessionStorage.removeItem("vlux_demo_code");
      state.code = "";
      state.data = null;
      state.error = "Código de acceso incorrecto.";
      state.loading = false;
      render();
      return;
    }

    if (!response.ok) {
      throw new Error(`No se pudo sincronizar (${response.status}).`);
    }

    state.data = await response.json();
    state.loading = false;
    state.error = null;
    render();
  } catch (error) {
    state.loading = false;
    state.error = error instanceof Error ? error.message : "No se pudo actualizar.";
    render();
  }
}

function renderGate() {
  root.innerHTML = `
    <main class="gate">
      <section class="gate-card">
        <p class="eyebrow">VLUX OWNER · LIVE DEMO</p>
        <h1>Tu negocio en la palma de tu mano.</h1>
        <p>Ingresa el código que te compartió VLUX para explorar información real del punto de venta.</p>
        <form id="gate-form">
          <input id="gate-code" type="password" autocomplete="one-time-code" placeholder="Código de acceso" required />
          <button type="submit">Entrar al dashboard</button>
        </form>
        ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ""}
      </section>
    </main>`;

  document.getElementById("gate-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const code = document.getElementById("gate-code").value.trim();
    if (!code) return;
    state.code = code;
    sessionStorage.setItem("vlux_demo_code", code);
    fetchDashboard();
  });
}

function kpi(label, value, icon) {
  return `<article class="card"><div class="card-icon">${icon}</div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function header() {
  const data = state.data;
  const updated = data?.generated_at
    ? new Date(data.generated_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return `
    <header class="top">
      <div>
        <p class="eyebrow">VLUX OWNER</p>
        <h1>¡Buenos días, ${escapeHtml(data.store.user_name)}!</h1>
        <p class="subtle">${escapeHtml(data.store.company_name)}</p>
      </div>
      <div class="status"><i></i> En vivo</div>
    </header>
    <div class="status" style="justify-content:space-between;margin-bottom:14px">
      <span>${escapeHtml(data.date_label)}</span>
      <span>Actualizado ${escapeHtml(updated)}</span>
    </div>
    ${state.error ? `<div class="error" style="margin-bottom:12px">${escapeHtml(state.error)} Mostrando la última lectura disponible.</div>` : ""}`;
}

function summaryView() {
  const data = state.data;
  const comparison = data.summary.comparison_vs_yesterday_pct;
  const comparisonHtml = comparison === null
    ? `<p class="subtle">Sin comparación disponible</p>`
    : `<p class="${comparison >= 0 ? "positive" : "negative"}">${comparison >= 0 ? "▲" : "▼"} ${Math.abs(comparison).toFixed(1)}% vs ayer a esta hora</p>`;

  const registers = data.sales_by_register.map((item) => `
    <div class="register">
      <div class="register-head"><strong>${escapeHtml(item.name)}</strong><span>${money(item.amount)} · ${Number(item.share_pct).toFixed(1)}%</span></div>
      <div class="progress"><i style="width:${Math.min(Number(item.share_pct), 100)}%"></i></div>
    </div>`).join("");

  return `
    <section class="hero">
      <div>
        <span>VENTAS TOTALES HOY</span>
        <strong>${money(data.summary.sales_today)}</strong>
        ${comparisonHtml}
      </div>
      <canvas class="mini-chart" id="mini-chart"></canvas>
    </section>
    <section class="grid">
      ${kpi("Tickets", data.summary.tickets, "T")}
      ${kpi("Productos vendidos", data.summary.units_sold, "P")}
      ${kpi("Ticket promedio", money(data.summary.average_ticket), "$")}
      ${kpi("Cajas con ventas", data.sales_by_register.length, "C")}
    </section>
    <section class="section">
      <div class="section-head"><div><span>VENTAS POR HORA</span><h2>Ritmo del día</h2></div></div>
      <div class="surface chart-wrap"><canvas class="chart" id="sales-chart"></canvas></div>
    </section>
    <section class="section">
      <div class="section-head"><div><span>OPERACIÓN</span><h2>Ventas por caja</h2></div></div>
      <div class="surface">${registers || '<div class="empty">Todavía no hay ventas confirmadas hoy.</div>'}</div>
    </section>`;
}

function salesView() {
  const rows = state.data.latest_sales.map((sale) => `
    <div class="row"><div class="grow"><strong>${escapeHtml(sale.reference)}</strong><small>${escapeHtml(sale.time)} · ${escapeHtml(sale.register)} · ${escapeHtml(sale.cashier)}</small></div><strong>${money(sale.amount)}</strong></div>`).join("");
  return `<section class="section"><div class="section-head"><div><span>VENTAS</span><h2>Últimas ventas confirmadas</h2></div></div><div class="surface">${rows || '<div class="empty">Sin ventas confirmadas.</div>'}</div></section>`;
}

function productsView() {
  const rows = state.data.top_products.map((product, index) => `
    <div class="row"><span class="rank">${index + 1}</span><div class="grow"><strong>${escapeHtml(product.name)}</strong><small>${Number(product.qty).toFixed(0)} unidades</small></div><strong>${money(product.amount)}</strong></div>`).join("");
  return `<section class="section"><div class="section-head"><div><span>PRODUCTOS</span><h2>Más vendidos hoy</h2></div></div><div class="surface">${rows || '<div class="empty">Aún no hay datos de productos.</div>'}</div></section>`;
}

function inventoryView() {
  const rows = state.data.low_stock.map((product) => `
    <div class="row"><span class="rank">!</span><div class="grow"><strong>${escapeHtml(product.name)}</strong><small>Mínimo: ${escapeHtml(product.threshold)}</small></div><strong>${Number(product.qty_available).toFixed(0)}</strong></div>`).join("");
  return `<section class="section"><div class="section-head"><div><span>INVENTARIO</span><h2>Stock bajo</h2></div></div><div class="surface">${rows || '<div class="empty">Todo el inventario está por encima del mínimo.</div>'}</div></section>`;
}

function nav() {
  const items = [
    ["summary", "⌂", "Resumen"],
    ["sales", "$", "Ventas"],
    ["products", "P", "Productos"],
    ["inventory", "I", "Inventario"],
  ];
  return `<nav class="nav">${items.map(([id, icon, label]) => `<button data-tab="${id}" class="${state.tab === id ? "active" : ""}"><b>${icon}</b><span>${label}</span></button>`).join("")}</nav>`;
}

function drawChart(id, data, compact = false) {
  const canvas = document.getElementById(id);
  if (!canvas || !data?.length) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const pad = compact ? 5 : 22;
  const values = data.map((point) => Number(point.amount || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => ({
    x: pad + (index / Math.max(values.length - 1, 1)) * (width - pad * 2),
    y: pad + (1 - (value - min) / range) * (height - pad * 2),
  }));

  if (!compact) {
    ctx.strokeStyle = "rgba(255,255,255,.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i += 1) {
      const y = pad + i * ((height - pad * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(width - pad, y);
      ctx.stroke();
    }
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(157,92,255,.45)");
  gradient.addColorStop(1, "rgba(157,92,255,0)");
  ctx.beginPath();
  ctx.moveTo(points[0].x, height - pad);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.lineTo(points[points.length - 1].x, height - pad);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.strokeStyle = "#a970ff";
  ctx.lineWidth = compact ? 3 : 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  if (!compact) {
    ctx.fillStyle = "#777286";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    data.forEach((point, index) => {
      if (index % 2 === 0) ctx.fillText(point.label, points[index].x, height - 4);
    });
  }
}

function render() {
  if (!state.code) {
    renderGate();
    return;
  }

  if (state.loading && !state.data) {
    root.innerHTML = `<main class="loading"><div><div class="spinner"></div><p>Conectando con el negocio…</p></div></main>`;
    return;
  }

  if (!state.data) {
    root.innerHTML = `<main class="gate"><section class="gate-card"><p class="eyebrow">VLUX OWNER</p><h1>No pudimos conectar</h1><p>${escapeHtml(state.error || "La demo no está disponible en este momento.")}</p><button id="retry">Reintentar</button></section></main>`;
    document.getElementById("retry").addEventListener("click", fetchDashboard);
    return;
  }

  const view = state.tab === "summary" ? summaryView() : state.tab === "sales" ? salesView() : state.tab === "products" ? productsView() : inventoryView();
  root.innerHTML = `<main class="app">${header()}${view}${nav()}</main>`;

  root.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      render();
    });
  });

  if (state.tab === "summary") {
    requestAnimationFrame(() => {
      drawChart("mini-chart", state.data.sales_trend, true);
      drawChart("sales-chart", state.data.sales_trend, false);
    });
  }
}

window.addEventListener("resize", () => {
  if (state.tab === "summary" && state.data) {
    drawChart("mini-chart", state.data.sales_trend, true);
    drawChart("sales-chart", state.data.sales_trend, false);
  }
});

render();
fetchDashboard();
setInterval(fetchDashboard, 15000);

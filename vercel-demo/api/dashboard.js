export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const upstreamUrl = process.env.VLUX_OWNER_API_URL;
  const upstreamToken = process.env.VLUX_OWNER_API_TOKEN;
  const accessCode = process.env.VLUX_DEMO_ACCESS_CODE || "";
  const providedCode = req.headers["x-vlux-demo-code"] || "";

  if (!upstreamUrl || !upstreamToken) {
    return res.status(503).json({ error: "demo_not_configured" });
  }

  if (accessCode && providedCode !== accessCode) {
    return res.status(401).json({ error: "invalid_access_code" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VLUX-Owner-Token": upstreamToken,
      },
      body: JSON.stringify({ date: req.body?.date || null }),
      signal: controller.signal,
    });

    const payload = await upstream.json().catch(() => null);

    if (!upstream.ok || !payload?.ok) {
      return res.status(upstream.status || 502).json({
        error: payload?.error || "upstream_unavailable",
      });
    }

    return res.status(200).json(payload.data);
  } catch (error) {
    return res.status(error?.name === "AbortError" ? 504 : 502).json({
      error: error?.name === "AbortError" ? "upstream_timeout" : "upstream_connection_failed",
    });
  } finally {
    clearTimeout(timeout);
  }
}

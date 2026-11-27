// API gateway with dynamic routing.
// Routes point at service NAMES (lb://order-service), never at IPs.
// The gateway asks the registry where the healthy instances are,
// caches the list (refreshed every 3 s), and round-robins between them.
// If an instance does not answer, it retries the next one.

const http = require("http");

const PORT = Number(process.env.GATEWAY_PORT) || 8080;
const REGISTRY = process.env.REGISTRY_URL || "http://localhost:8761";
const REFRESH_MS = 3000;
const INSTANCE_TIMEOUT_MS = 1500;
const MAX_ATTEMPTS = 3;

// Same idea as Spring Cloud Gateway:  uri: lb://order-service,  predicates: Path=/orders/**
const routes = [
  { id: "orders", path: "/orders", uri: "lb://order-service" },
  { id: "payments", path: "/payments", uri: "lb://payment-service" },
];

const cache = new Map();     // serviceName -> instances from the registry
const counters = new Map();  // serviceName -> round-robin counter

async function refresh(service) {
  try {
    const r = await fetch(`${REGISTRY}/eureka/apps/${encodeURIComponent(service)}`, {
      signal: AbortSignal.timeout(1000),
    });
    if (r.ok) cache.set(service, await r.json());
  } catch {
    // Registry unreachable: keep using the last known list (client-side cache).
  }
}

function refreshAll() {
  for (const route of routes) refresh(route.uri.replace("lb://", ""));
}
refreshAll();
setInterval(refreshAll, REFRESH_MS);

function send(res, code, body, headers = {}) {
  res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...headers });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/gateway/routes") return send(res, 200, routes);

  const route = routes.find((r) => req.url === r.path || req.url.startsWith(r.path + "/"));
  if (!route) return send(res, 404, { error: `no route for ${req.url}`, routes: routes.map((r) => r.path + "/**") });

  const service = route.uri.replace("lb://", "");
  let instances = cache.get(service) || [];
  if (instances.length === 0) {
    await refresh(service);
    instances = cache.get(service) || [];
  }
  if (instances.length === 0) {
    console.log(`[gateway] ${req.url} -> no instance of ${service} in the registry`);
    return send(res, 503, { error: `no healthy instance of ${service} is registered`, route: route.uri });
  }

  const start = counters.get(service) || 0;
  counters.set(service, start + 1);

  const attempts = [];
  const tries = Math.min(instances.length, MAX_ATTEMPTS);
  for (let i = 0; i < tries; i++) {
    const inst = instances[(start + i) % instances.length];
    const target = `http://${inst.host}:${inst.port}${req.url}`;
    try {
      const r = await fetch(target, { method: req.method, signal: AbortSignal.timeout(INSTANCE_TIMEOUT_MS) });
      const body = await r.json();
      attempts.push({ instanceId: inst.instanceId, result: "ok" });
      console.log(`[gateway] ${req.method} ${req.url} -> ${route.uri} -> ${inst.instanceId}${i > 0 ? ` (after ${i} failed attempt${i > 1 ? "s" : ""})` : ""}`);
      return send(
        res,
        r.status,
        { gateway: { route: route.uri, servedBy: inst.instanceId, attempts }, response: body },
        { "X-Served-By": inst.instanceId }
      );
    } catch (err) {
      attempts.push({ instanceId: inst.instanceId, result: "no answer" });
      console.log(`[gateway] ${inst.instanceId} did not answer, trying the next instance`);
    }
  }

  send(res, 502, { error: `every instance tried for ${service} failed`, route: route.uri, attempts });
});

server.listen(PORT, () => console.log(`[gateway] listening on http://localhost:${PORT}  routes: /orders/** -> lb://order-service, /payments/** -> lb://payment-service`));

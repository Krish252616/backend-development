// One command to run the whole demo:  node demo.js
// Starts the registry (8761), the gateway (8080), 3 order-service and
// 2 payment-service instances, and a dashboard on http://localhost:9000

const http = require("http");
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

const DASHBOARD_PORT = Number(process.env.DASHBOARD_PORT) || 9000;
const REGISTRY_PORT = Number(process.env.REGISTRY_PORT) || 8761;
const GATEWAY_PORT = Number(process.env.GATEWAY_PORT) || 8080;
const REGISTRY = `http://localhost:${REGISTRY_PORT}`;
const GATEWAY = `http://localhost:${GATEWAY_PORT}`;
// child processes inherit this, so the gateway and services find the registry
process.env.REGISTRY_URL = REGISTRY;

const children = [];
const instances = new Map(); // instanceId -> { child, service, port, startedAt }
let networkProblem = false;
const nextPort = { "order-service": 5001, "payment-service": 6001 };

function startCore(file) {
  const child = fork(path.join(__dirname, file), [], { stdio: "inherit" });
  children.push(child);
  return child;
}

function startInstance(service) {
  if (!(service in nextPort)) throw new Error(`unknown service ${service}`);
  const port = nextPort[service]++;
  const id = `${service}:${port}`;
  const child = fork(path.join(__dirname, "service.js"), [service, String(port)], { stdio: "inherit" });
  instances.set(id, { child, service, port, startedAt: Date.now() });
  child.on("exit", () => instances.delete(id));
  if (networkProblem) child.send("block-heartbeats");
  return id;
}

function send(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${DASHBOARD_PORT}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "dashboard.html")));
  }

  if (req.method === "GET" && url.pathname === "/api/state") {
    let registry = null;
    try {
      const r = await fetch(`${REGISTRY}/admin/state`, { signal: AbortSignal.timeout(1000) });
      registry = await r.json();
    } catch {}
    const processes = [...instances.entries()].map(([id, p]) => ({ instanceId: id, service: p.service, port: p.port, pid: p.child.pid }));
    return send(res, 200, { registry, processes, networkProblem, now: Date.now() });
  }

  if (req.method === "POST" && url.pathname === "/api/instances") {
    const body = await readBody(req);
    try { return send(res, 200, { started: startInstance(body.service) }); }
    catch (e) { return send(res, 400, { error: e.message }); }
  }

  const m = url.pathname.match(/^\/api\/instances\/([^/]+)\/(stop|crash)$/);
  if (req.method === "POST" && m) {
    const id = decodeURIComponent(m[1]);
    const p = instances.get(id);
    if (!p) return send(res, 404, { error: "no such running instance" });
    if (m[2] === "stop") p.child.send("shutdown");   // graceful: deregisters first
    else p.child.kill("SIGKILL");                    // crash: no goodbye, registry must notice
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/api/request") {
    const body = await readBody(req);
    const reqPath = typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/orders/42";
    const t0 = Date.now();
    try {
      const r = await fetch(GATEWAY + reqPath, { signal: AbortSignal.timeout(6000) });
      const data = await r.json();
      return send(res, 200, { status: r.status, ms: Date.now() - t0, path: reqPath, body: data });
    } catch (e) {
      return send(res, 200, { status: 0, ms: Date.now() - t0, path: reqPath, body: { error: "gateway not reachable" } });
    }
  }

  if (req.method === "POST" && url.pathname === "/api/network") {
    const body = await readBody(req);
    networkProblem = Boolean(body.problem);
    for (const p of instances.values()) {
      if (p.child.connected) p.child.send(networkProblem ? "block-heartbeats" : "unblock-heartbeats");
    }
    console.log(networkProblem ? "[demo] simulating a network problem: heartbeats are blocked, services still run" : "[demo] network restored");
    return send(res, 200, { networkProblem });
  }

  if (req.method === "POST" && url.pathname === "/api/self-preservation") {
    const body = await readBody(req);
    try {
      const r = await fetch(`${REGISTRY}/admin/self-preservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: Boolean(body.enabled) }),
      });
      return send(res, 200, await r.json());
    } catch { return send(res, 502, { error: "registry not reachable" }); }
  }

  send(res, 404, { error: "not found" });
});

function shutdownAll() {
  for (const p of instances.values()) p.child.kill("SIGKILL");
  for (const c of children) c.kill("SIGKILL");
  process.exit(0);
}
process.on("SIGINT", shutdownAll);
process.on("SIGTERM", shutdownAll);

server.on("error", (err) => {
  console.error(`Dashboard could not start on port ${DASHBOARD_PORT}: ${err.message}`);
  shutdownAll();
});

startCore("registry.js");
startCore("gateway.js");
setTimeout(() => {
  ["order-service", "order-service", "order-service", "payment-service", "payment-service"].forEach(startInstance);
}, 600);

server.listen(DASHBOARD_PORT, () => {
  console.log("");
  console.log(`  Dashboard:  http://localhost:${DASHBOARD_PORT}`);
  console.log(`  Gateway:    ${GATEWAY}/orders/42`);
  console.log(`  Registry:   ${REGISTRY}/eureka/apps`);
  console.log("  Press Ctrl+C to stop everything.");
  console.log("");
});

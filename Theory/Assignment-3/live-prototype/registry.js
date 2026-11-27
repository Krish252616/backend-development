// Service registry: a small Eureka-style registry.
// Services register, send heartbeats, and get evicted when heartbeats stop.
// Timings are 10x faster than Eureka's defaults so the demo is quick:
//   heartbeat every 3 s (Eureka: 30 s), lease expires after 9 s (Eureka: 90 s).

const http = require("http");

const PORT = Number(process.env.REGISTRY_PORT) || 8761;
const HEARTBEAT_MS = 3000;     // how often clients are expected to renew
const LEASE_MS = 9000;         // no heartbeat for this long -> evict
const EVICT_EVERY_MS = 2000;   // how often the eviction task runs
const WINDOW_MS = 15000;       // window used for the self-preservation check
const THRESHOLD = 0.85;        // Eureka's renewal-percent-threshold

const apps = new Map();        // serviceName -> Map(instanceId -> instance)
const renewals = [];           // timestamps of recent heartbeats
const events = [];             // event log shown on the dashboard
let selfPreservationEnabled = false;
let selfPreservationActive = false;
let stats = { expected: 0, threshold: 0, actual: 0 };

function log(type, message) {
  events.push({ time: Date.now(), type, message });
  if (events.length > 200) events.shift();
  console.log(`[registry] ${type.padEnd(17)} ${message}`);
}

function send(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve(null); }
    });
  });
}

function publicInstance(inst, now) {
  return {
    instanceId: inst.instanceId,
    service: inst.service,
    host: inst.host,
    port: inst.port,
    registeredAgoMs: now - inst.registeredAt,
    lastHeartbeatAgoMs: now - inst.lastRenewal,
  };
}

function allInstances() {
  const list = [];
  for (const instances of apps.values()) for (const inst of instances.values()) list.push(inst);
  return list;
}

function snapshot() {
  const now = Date.now();
  const out = {};
  for (const [name, instances] of apps) {
    out[name] = [...instances.values()].map((i) => publicInstance(i, now));
  }
  return out;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const now = Date.now();

  // ---- Eureka-style API: /eureka/apps/... ----
  if (parts[0] === "eureka" && parts[1] === "apps") {
    const name = parts[2];
    const id = parts[3];

    // GET /eureka/apps -> every service and instance
    if (req.method === "GET" && !name) return send(res, 200, snapshot());

    // GET /eureka/apps/:name -> instances of one service (what callers use to look up)
    if (req.method === "GET" && name && !id) {
      const instances = apps.get(name);
      return send(res, 200, instances ? [...instances.values()].map((i) => publicInstance(i, now)) : []);
    }

    // POST /eureka/apps/:name -> register an instance
    if (req.method === "POST" && name && !id) {
      const body = await readBody(req);
      if (!body || !body.instanceId || !body.port) return send(res, 400, { error: "instanceId and port are required" });
      if (!apps.has(name)) apps.set(name, new Map());
      apps.get(name).set(body.instanceId, {
        instanceId: body.instanceId,
        service: name,
        host: body.host || "localhost",
        port: Number(body.port),
        registeredAt: now,
        lastRenewal: now,
      });
      log("REGISTER", `${body.instanceId} is UP`);
      return send(res, 204);
    }

    // PUT /eureka/apps/:name/:id -> heartbeat (renew the lease)
    if (req.method === "PUT" && name && id) {
      const inst = apps.get(name)?.get(id);
      if (!inst) return send(res, 404, { error: "unknown instance, please register again" });
      inst.lastRenewal = now;
      renewals.push(now);
      return send(res, 200, { ok: true });
    }

    // DELETE /eureka/apps/:name/:id -> graceful shutdown
    if (req.method === "DELETE" && name && id) {
      const instances = apps.get(name);
      if (instances && instances.delete(id)) {
        if (instances.size === 0) apps.delete(name);
        log("CANCEL", `${id} shut down cleanly and left the registry`);
      }
      return send(res, 204);
    }
  }

  // ---- Admin API used by the dashboard ----
  if (req.method === "GET" && url.pathname === "/admin/state") {
    return send(res, 200, {
      apps: snapshot(),
      events: events.slice(-60),
      selfPreservation: { enabled: selfPreservationEnabled, active: selfPreservationActive, ...stats },
      config: { heartbeatMs: HEARTBEAT_MS, leaseMs: LEASE_MS, windowMs: WINDOW_MS, threshold: THRESHOLD },
    });
  }

  if (req.method === "POST" && url.pathname === "/admin/self-preservation") {
    const body = await readBody(req);
    selfPreservationEnabled = Boolean(body && body.enabled);
    log("CONFIG", `self-preservation ${selfPreservationEnabled ? "enabled" : "disabled"}`);
    return send(res, 200, { enabled: selfPreservationEnabled });
  }

  send(res, 404, { error: "not found" });
});

// Eviction task: runs every 2 s, like Eureka's EvictionTask.
setInterval(() => {
  const now = Date.now();
  while (renewals.length && renewals[0] < now - WINDOW_MS) renewals.shift();

  // How many heartbeats should we have seen in the window?
  let expected = 0;
  for (const inst of allInstances()) {
    expected += Math.min(WINDOW_MS / HEARTBEAT_MS, Math.floor((now - inst.registeredAt) / HEARTBEAT_MS));
  }
  const threshold = Math.floor(expected * THRESHOLD);
  const actual = renewals.length;
  stats = { expected, threshold, actual };

  const active = selfPreservationEnabled && expected > 0 && actual < threshold;
  if (active !== selfPreservationActive) {
    selfPreservationActive = active;
    log(
      "SELF-PRESERVATION",
      active
        ? `ON: only ${actual} of ${expected} expected heartbeats arrived. Assuming a network problem, evictions paused`
        : "OFF: heartbeats are back to normal, evictions resume"
    );
  }
  if (selfPreservationActive) return;

  for (const [name, instances] of apps) {
    for (const [id, inst] of instances) {
      if (now - inst.lastRenewal > LEASE_MS) {
        instances.delete(id);
        log("EVICT", `${id} missed heartbeats for ${Math.round((now - inst.lastRenewal) / 1000)} s and was removed`);
      }
    }
    if (instances.size === 0) apps.delete(name);
  }
}, EVICT_EVERY_MS);

server.listen(PORT, () => log("START", `registry listening on http://localhost:${PORT}`));

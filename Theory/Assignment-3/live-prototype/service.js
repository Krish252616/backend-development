// One instance of a microservice.
// Usage: node service.js <service-name> <port>
// Example: node service.js order-service 5001
//
// On startup it registers itself with the registry (self-registration),
// then sends a heartbeat every 3 s. On a clean shutdown it deregisters.
// If it crashes, it simply stops sending heartbeats and the registry evicts it.

const http = require("http");

const SERVICE = process.argv[2] || "order-service";
const PORT = Number(process.argv[3]) || 5001;
const REGISTRY = process.env.REGISTRY_URL || "http://localhost:8761";
const HEARTBEAT_MS = 3000;
const INSTANCE_ID = `${SERVICE}:${PORT}`;

let servedCount = 0;
let registered = false;
let stopping = false;
let heartbeatsBlocked = false; // simulates a network problem between this instance and the registry

const server = http.createServer((req, res) => {
  servedCount += 1;
  const lastSegment = req.url.split("?")[0].split("/").filter(Boolean).pop() || "";
  let data;
  if (SERVICE.startsWith("order")) data = { orderId: lastSegment, status: "CONFIRMED" };
  else if (SERVICE.startsWith("payment")) data = { paymentId: lastSegment, status: "PAID" };
  else data = { path: req.url };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ service: SERVICE, instanceId: INSTANCE_ID, port: PORT, pid: process.pid, servedCount, data }));
});

async function register() {
  try {
    const r = await fetch(`${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instanceId: INSTANCE_ID, host: "localhost", port: PORT }),
    });
    if (!r.ok) throw new Error(`status ${r.status}`);
    registered = true;
    console.log(`[${INSTANCE_ID}] registered with ${REGISTRY}`);
  } catch (err) {
    console.log(`[${INSTANCE_ID}] registry not reachable (${err.message}), retrying in 2 s`);
    setTimeout(register, 2000);
  }
}

async function heartbeat() {
  if (!registered || stopping || heartbeatsBlocked) return;
  try {
    const r = await fetch(
      `${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}/${encodeURIComponent(INSTANCE_ID)}`,
      { method: "PUT" }
    );
    if (r.status === 404) {
      // The registry forgot us (for example it was evicted or restarted): register again.
      registered = false;
      register();
    }
  } catch {
    // Registry is down. Keep serving traffic and keep trying.
  }
}

async function shutdown() {
  if (stopping) return;
  stopping = true;
  console.log(`[${INSTANCE_ID}] shutting down cleanly, deregistering`);
  try {
    await fetch(`${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}/${encodeURIComponent(INSTANCE_ID)}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(1500),
    });
  } catch {}
  server.close();
  process.exit(0);
}

server.on("error", (err) => {
  console.error(`[${INSTANCE_ID}] cannot start: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`[${INSTANCE_ID}] listening on http://localhost:${PORT}`);
  register();
  setInterval(heartbeat, HEARTBEAT_MS);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("message", (msg) => {
  if (msg === "shutdown") shutdown();
  if (msg === "block-heartbeats") { heartbeatsBlocked = true; console.log(`[${INSTANCE_ID}] network problem: heartbeats cannot reach the registry`); }
  if (msg === "unblock-heartbeats") { heartbeatsBlocked = false; console.log(`[${INSTANCE_ID}] network restored`); heartbeat(); }
});
// If started by demo.js and the launcher goes away, exit too.
process.on("disconnect", () => process.exit(0));

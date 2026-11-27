# Service Discovery: working prototype

A small but real microservice system that runs on your laptop:

| Part | File | Port | What it does |
|---|---|---|---|
| Service registry | `registry.js` | 8761 | Eureka-style registry: register, heartbeat, evict, self-preservation |
| Service instances | `service.js` | 5001+ (orders), 6001+ (payments) | Each instance registers itself and sends a heartbeat every 3 s |
| API gateway | `gateway.js` | 8080 | Routes `/orders/**` to `lb://order-service`, round-robin, retries on failure |
| Launcher + dashboard | `demo.js`, `dashboard.html` | 9000 | Starts everything and gives you buttons to add, stop and crash instances |

No libraries, no database. Every service is a separate Node.js process talking over HTTP.

Timings are 10x faster than Eureka so the demo is quick: heartbeat every **3 s** (Eureka: 30 s), evicted after **9 s** without a heartbeat (Eureka: 90 s).

## Run it

You need **Node.js 18 or newer** (`node --version`).

```
node demo.js
```

Then open **http://localhost:9000**. Press **Ctrl+C** in the terminal to stop everything.

To run the parts by hand in separate terminals instead:

```
node registry.js
node gateway.js
node service.js order-service 5001
node service.js order-service 5002
curl http://localhost:8080/orders/42
```

## Demo script for class (about 2 minutes)

1. **Discovery.** Point at the registry panel: 3 order-service and 2 payment-service instances registered themselves on startup. Nobody typed an IP anywhere.
2. **Load balancing.** Press **Send 10 to /orders**. The bars show the gateway spreading requests across the 3 instances, using only the name `lb://order-service`.
3. **Scaling.** Press **Add instance** on order-service. In about 3 s it shows as UP, and the next batch of requests starts reaching it. No config change and no restart.
4. **Crash.** Press **Crash** on one instance. It stops sending heartbeats: the status turns to NO HEARTBEAT and the lease bar runs out. Send a request right away: the gateway tries the dead instance, gets no answer and **retries** another one (shown in orange). After 9 s the event log shows **EVICT**.
5. **Graceful stop.** Press **Stop** on another instance. It deregisters itself straight away (**CANCEL** in the log), with no waiting.
6. **Self-preservation (optional).** Press **Simulate network problem**. The services keep running, but their heartbeats can't reach the registry.
   - With self-preservation **OFF**, the registry evicts every instance after 9 s and requests fail with 503, even though the services are healthy.
   - Press **Restore network**, wait about 15 s, turn self-preservation **ON** and try again. This time the registry notices that most heartbeats vanished at once, assumes a network problem, and keeps the instances. Requests keep working.

## Where each slide concept lives in the code

| Concept from the slides | Code |
|---|---|
| Self-registration | `register()` in `service.js` |
| Heartbeat / lease renewal | `heartbeat()` in `service.js`, `PUT /eureka/apps/:name/:id` in `registry.js` |
| Eviction after the lease expires | `setInterval` eviction task in `registry.js` |
| Self-preservation (85% threshold) | same eviction task in `registry.js` |
| Graceful deregistration | `shutdown()` in `service.js`, `DELETE` route in `registry.js` |
| Dynamic routing with `lb://` | `routes` in `gateway.js` |
| Client-side cache of the registry | `cache` and `refresh()` in `gateway.js` |
| Retries when a listed instance is dead | the loop over `attempts` in `gateway.js` |

## Registry API

```
GET    /eureka/apps                  all services and instances
GET    /eureka/apps/:name            instances of one service
POST   /eureka/apps/:name            register   { instanceId, host, port }
PUT    /eureka/apps/:name/:id        heartbeat
DELETE /eureka/apps/:name/:id        deregister
```

## If something goes wrong

- **Port already in use:** another program is using 8761, 8080 or 9000. Close it, or start with different ports, for example `REGISTRY_PORT=8762 GATEWAY_PORT=8081 DASHBOARD_PORT=9001 node demo.js` (on Windows PowerShell: `$env:REGISTRY_PORT=8762; $env:GATEWAY_PORT=8081; $env:DASHBOARD_PORT=9001; node demo.js`).
- **Dashboard shows "Cannot reach the registry":** the terminal running `node demo.js` was closed. Start it again.

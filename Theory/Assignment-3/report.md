---
title: "Assignment 3: Service Discovery in Microservices"
layout: default
---

# Assignment 3: Service Discovery in Microservices

**Course:** Backend Development, Unit V, Topic 4
**Student:** Krish Pawar, SAP ID 590017543, B.Tech CSE (Batch 5), UPES Dehradun
**Date:** 27 November 2026

**Deliverables:** [Presentation (PDF)](./presentation/Service_Discovery_Krish_590017543.pdf) · [Demo video](./presentation/demo-video.mp4) · [Live prototype source](./live-prototype/)

---

## 1. Aim

To study how microservices find each other when instance addresses keep changing, compare the main service discovery tools (Netflix Eureka, HashiCorp Consul and Kubernetes DNS), and build a working prototype of a Eureka-style service registry with self-registering services and an API gateway that routes by service name.

## 2. Objectives

After completing this assignment, I am able to:

1. Explain why fixed IP addresses do not work in a microservice system.
2. Describe the parts of service discovery: registry, provider and consumer.
3. Compare client-side and server-side discovery.
4. Explain the life of an instance in a registry: register, renew, fetch and evict.
5. Compare Eureka, Consul and Kubernetes DNS, including their CAP trade-off.
6. Build and demonstrate a registry, self-registering services and a gateway with `lb://` routing.

## 3. Tools and environment

| Item | Detail |
|---|---|
| Runtime | Node.js 18 or newer |
| Libraries | None. Only the built-in `http`, `fs`, `path` and `child_process` modules |
| Communication | HTTP between separate Node.js processes |
| Presentation | 12 slides, exported as PDF |
| Editor | Visual Studio Code |
| OS | macOS |

---

## 4. Theory

### 4.1 The problem

In a monolith, one module calls another inside the same process. In microservices, that call goes over the network to an IP and port that may not exist a minute later:

- **Autoscaling:** at peak hours a service grows from 3 to 12 instances, and the new instances have addresses nobody configured.
- **Failures:** a crashed container comes back on another machine with a different IP.
- **Deployments:** a rolling deploy replaces every instance one by one, so old addresses disappear.

Service discovery answers one question: **where is a healthy instance of this service right now?**

### 4.2 The three parts

| Part | Role |
|---|---|
| Service registry | A live phone book that maps a service name to a list of healthy `IP:port` entries |
| Service provider | Registers itself on startup and keeps sending heartbeats |
| Service consumer | Asks the registry where the provider is, then calls one of the returned instances |

Registration is either **self-registration** (the service calls the registry itself, as in this prototype) or **third-party registration** (a platform such as Kubernetes registers it).

### 4.3 Client-side and server-side discovery

| | Client-side | Server-side |
|---|---|---|
| Who looks up | The calling service | A router, load balancer or gateway |
| Example | Eureka with Spring Cloud LoadBalancer | AWS ELB, Kubernetes Service |
| Network hops | Fewer: direct call | One extra hop through the router |
| Client code | Discovery logic in every language | Simple: call one address |
| Main cost | The client is tied to the registry | The router must be highly available |

### 4.4 Life of an instance in the registry

| Step | What happens | Eureka default |
|---|---|---|
| Register | On startup the instance sends its name, IP, port and metadata | Once, at startup |
| Renew | A heartbeat says "I am still alive" | Every 30 s |
| Fetch | Callers cache the list and refresh it | Every 30 s |
| Evict | An instance with no heartbeat is removed | After 90 s |

**Self-preservation mode.** If heartbeats suddenly fall below 85% of what Eureka expects, it assumes the network is broken rather than the services, and stops evicting. The registry survives a network split, but callers may receive a dead address, so callers still need timeouts and retries.

### 4.5 Eureka, Consul and Kubernetes DNS

| | Eureka | Consul | Kubernetes DNS |
|---|---|---|---|
| Made by | Netflix (Java) | HashiCorp (Go) | Built into Kubernetes |
| CAP choice | AP: always up, data may be stale | CP: servers agree using Raft | CP: state stored in etcd |
| Health | Client heartbeats | Agent runs HTTP, TCP, gRPC, TTL or script checks | Readiness probes |
| Lookup | REST API and a client-side cache | DNS (port 8600) or HTTP API (port 8500) | A DNS name per Service |
| Discovery style | Client-side | Both | Server-side |
| Best fit | Spring Boot on VMs | Mixed languages | Apps on Kubernetes |

### 4.6 Dynamic routing through a gateway

An API gateway such as Spring Cloud Gateway routes to a service **name**, not an address:

```yaml
- id: orders
  uri: lb://order-service
  predicates:
    - Path=/orders/**
```

`lb://` means "resolve this name through the registry at request time and load-balance across the healthy instances". The service can scale from 3 to 12 instances and this configuration never changes.

---

## 5. Presentation

The 12-slide presentation covers the problem, the architecture, discovery patterns, the instance lifecycle, Eureka, Consul, the comparison, dynamic routing, real-world use and design notes.

<iframe src="./presentation/Service_Discovery_Krish_590017543.pdf" title="Service Discovery in Microservices, presentation by Krish Pawar" width="100%" height="560" style="border: 1px solid #d0d7de;"></iframe>

[Open the presentation (PDF)](./presentation/Service_Discovery_Krish_590017543.pdf)

---

## 6. The prototype

A small but real microservice system that runs on one laptop. Every part is a separate Node.js process talking over HTTP.

| Part | File | Port | What it does |
|---|---|---|---|
| Service registry | `registry.js` | 8761 | Eureka-style registry: register, heartbeat, evict, self-preservation |
| Service instances | `service.js` | 5001+ (orders), 6001+ (payments) | Each instance registers itself and sends a heartbeat every 3 s |
| API gateway | `gateway.js` | 8080 | Routes `/orders/**` to `lb://order-service` with round-robin and retries |
| Launcher and dashboard | `demo.js`, `dashboard.html` | 9000 | Starts everything, with buttons to add, stop and crash instances |

```
Browser ──> Dashboard :9000 ──> Gateway :8080 ──(lookup by name)──> Registry :8761
                                     │                                   ▲
                                     └──(forward)──> order-service :5001+ ┘ register + heartbeat
                                                     payment-service :6001+
```

### 6.1 Timings

Timings are 10 times faster than Eureka's defaults so that a classroom demo is quick. The ratios between them are the same.

| Setting | Prototype | Eureka default |
|---|---|---|
| Heartbeat interval | 3 s | 30 s |
| Lease expiry (evict after) | 9 s | 90 s |
| Eviction task runs every | 2 s | 60 s |
| Self-preservation threshold | 85% | 85% |
| Gateway refreshes its cache every | 3 s | 30 s |

### 6.2 How to run

```bash
cd live-prototype
node demo.js
```

Open `http://localhost:9000`. Press **Ctrl+C** in the terminal to stop everything.

### 6.3 Registry API

| Method | Route | Purpose |
|---|---|---|
| GET | `/eureka/apps` | All services and their instances |
| GET | `/eureka/apps/:name` | Instances of one service (used by the gateway) |
| POST | `/eureka/apps/:name` | Register an instance |
| PUT | `/eureka/apps/:name/:id` | Heartbeat (renew the lease) |
| DELETE | `/eureka/apps/:name/:id` | Deregister on a clean shutdown |

---

## 7. Code walkthrough

### 7.1 Self-registration (`service.js`)

```javascript
const r = await fetch(`${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ instanceId: INSTANCE_ID, host: "localhost", port: PORT }),
});
```

Each instance announces itself as soon as it starts listening. If the registry is not reachable yet, it retries every 2 s. Nobody types an IP address anywhere.

### 7.2 Heartbeat (`service.js`)

```javascript
const r = await fetch(
  `${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}/${encodeURIComponent(INSTANCE_ID)}`,
  { method: "PUT" }
);
if (r.status === 404) {
  // The registry forgot us (for example it was evicted or restarted): register again.
  registered = false;
  register();
}
```

Every 3 s the instance renews its lease. A `404` means the registry has forgotten it (for example after an eviction or a registry restart), so the instance registers again on its own.

### 7.3 Eviction and self-preservation (`registry.js`)

The eviction task runs every 2 s. It first counts how many heartbeats it should have received in the last 15 s and how many actually arrived:

```javascript
const threshold = Math.floor(expected * THRESHOLD);
const actual = renewals.length;
stats = { expected, threshold, actual };

const active = selfPreservationEnabled && expected > 0 && actual < threshold;
// ... logs when self-preservation switches on or off ...
if (selfPreservationActive) return;
```

If too few heartbeats arrived at once, it assumes a network problem and skips eviction. Otherwise it removes every instance whose last heartbeat is older than 9 s.

### 7.4 Graceful deregistration (`service.js`)

```javascript
await fetch(`${REGISTRY}/eureka/apps/${encodeURIComponent(SERVICE)}/${encodeURIComponent(INSTANCE_ID)}`, {
  method: "DELETE",
  signal: AbortSignal.timeout(1500),
});
```

On `SIGINT` or `SIGTERM` the instance tells the registry it is leaving, so it disappears at once instead of after the 9 s lease.

### 7.5 Dynamic routing with `lb://` (`gateway.js`)

```javascript
const routes = [
  { id: "orders", path: "/orders", uri: "lb://order-service" },
  { id: "payments", path: "/payments", uri: "lb://payment-service" },
];
```

The gateway keeps a **client-side cache** of each service's instances and refreshes it every 3 s. If the registry is down, it keeps using the last known list. Each request starts at the next instance in round-robin order. If an instance does not answer within 1.5 s, the gateway tries the next one, up to 3 attempts, and records every attempt in the response.

---

## 8. Output

The prototype was started with `node demo.js` and each behaviour was tested through the gateway and the dashboard.

| Test | Action | Result |
|---|---|---|
| Discovery | Start the demo | 3 `order-service` and 2 `payment-service` instances registered themselves |
| Load balancing | 6 requests to `/orders` | Served in turn by 5002, 5003, 5001, 5002, 5003, 5001 |
| Second route | `GET /payments/7` | Served by `payment-service:6002`, response `{ paymentId: "7", status: "PAID" }` |
| Crash | Kill `order-service:5001`, then send requests | Gateway got no answer from 5001 and retried on 5002: `[5001: no answer, 5002: ok]` |
| Eviction | Wait after the crash | Registry removed 5001 after about 10 s without a heartbeat |
| Graceful stop | Stop `order-service:5002` | Removed from the registry at once (CANCEL) |
| Scaling | Add an instance | `order-service:5004` registered within 2 s with no config change |
| Self-preservation | Turn it on, then simulate a network problem | Only 4 of 20 expected heartbeats arrived, evictions paused, `/orders` still returned 200 |

Registry log from the run:

```
[registry] REGISTER          order-service:5001 is UP
[registry] REGISTER          payment-service:6001 is UP
[registry] EVICT             order-service:5001 missed heartbeats for 10 s and was removed
[registry] CANCEL            order-service:5002 shut down cleanly and left the registry
[registry] REGISTER          order-service:5004 is UP
[registry] SELF-PRESERVATION ON: only 15 of 19 expected heartbeats arrived. Assuming a network problem, evictions paused
```

### 8.1 Demo video

The recording shows the dashboard running live: the registry panel with three `order-service` and two `payment-service` instances, their lease bars renewing with each heartbeat, and the gateway panel showing which instance served each of the last 20 requests.

<video controls muted playsinline preload="metadata" width="100%" style="border: 1px solid #d0d7de;">
  <source src="./presentation/demo-video.mp4" type="video/mp4">
  Your browser cannot play this video.
</video>

[Open the demo video](./presentation/demo-video.mp4)

---

## 9. Observations

1. **No address was ever typed.** The gateway only knows the names `order-service` and `payment-service`. Every address came from the registry at request time.
2. **A crash is noticed in two places.** The gateway notices first, because the dead instance does not answer and it retries another. The registry notices later, after the lease runs out. Until then, the dead instance is still listed, which is why the retry matters.
3. **A clean stop is faster than a crash.** Deregistration removes the instance at once. A crash leaves it listed for up to the lease time.
4. **Self-preservation trades accuracy for availability.** During the simulated network problem, the registry kept every instance and requests kept working. The cost is that a truly dead instance would also be kept, so timeouts and retries are still needed.
5. **Self-preservation does not switch off immediately.** After the network was restored, it stayed on until enough heartbeats had arrived in the 15 s window to pass the 85% threshold again.
6. **The client-side cache keeps the gateway working without the registry.** If the registry stops, the gateway keeps routing to the last known list.
7. **This registry is a single node.** It keeps everything in memory, so a restart loses the list until instances re-register, and it has no authentication. Production registries run 3 to 5 nodes and use ACLs or mTLS.

---

## 10. Viva questions

**Q1. Why can't microservices use fixed IP addresses?**
Instances are created by autoscaling, moved after failures and replaced during deployments, so their addresses keep changing.

**Q2. What is a service registry?**
A database of available service instances. It maps each service name to the list of healthy `IP:port` entries.

**Q3. Difference between client-side and server-side discovery?**
In client-side discovery the caller asks the registry and picks an instance itself. In server-side discovery the caller sends the request to a router or load balancer, which looks up the instance and forwards it.

**Q4. What is a heartbeat?**
A periodic message from an instance to the registry saying it is still alive. Eureka's default is every 30 s. If heartbeats stop for 90 s, the instance is evicted.

**Q5. What is Eureka's self-preservation mode?**
When renewals drop below 85% of the expected number, Eureka assumes a network problem and stops evicting instances, so a network split does not empty the registry.

**Q6. Why is Eureka AP and Consul CP?**
Eureka servers copy data to each other without a leader and prefer to answer with possibly stale data. Consul servers use Raft and agree on every change before answering, preferring consistency.

**Q7. What does `lb://order-service` mean in a gateway route?**
Resolve the name `order-service` through the registry when the request arrives, and load-balance across its healthy instances.

**Q8. Self-registration or third-party registration: which does the prototype use?**
Self-registration. Each `service.js` instance calls the registry itself on startup.

**Q9. Why does the gateway still need retries if it uses a registry?**
The registry can list an instance that has just crashed, until its lease expires. A timeout and retry let the request succeed on another instance.

**Q10. What happens if the registry goes down?**
Clients keep using their cached list, so existing services can still call each other. New instances cannot register until it comes back. Production systems run several registry nodes to avoid this.

---

## 11. Conclusion

Service discovery replaces fixed addresses with a live registry that services join, renew and leave on their own. The presentation compared the main tools and their trade-offs, and the prototype showed the same ideas working with real processes: self-registration, heartbeats, eviction, graceful deregistration, self-preservation, and a gateway that routes by name with round-robin load balancing and retries. All six objectives were met.

---

## 12. References

1. Netflix, *Eureka wiki*. <https://github.com/Netflix/eureka/wiki>
2. Spring, *Spring Cloud Netflix reference*. <https://docs.spring.io/spring-cloud-netflix/reference/>
3. Spring, *Spring Cloud Gateway reference*. <https://docs.spring.io/spring-cloud-gateway/reference/>
4. HashiCorp, *Consul documentation*. <https://developer.hashicorp.com/consul/docs>
5. Kubernetes, *DNS for Services and Pods*. <https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/>

---

[Back to repository index](../../)

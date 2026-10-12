# Architecture Design

## Requirements
- **Functional:** Users can create, read, update, delete notes; users can tag notes.
- **Non-functional:** High availability (99.9%), low latency (<200ms), scalable to 1M users.

## Load Estimates (1 Million Users)
Assuming 10% daily active users (100k), making 20 reads and 5 writes a day.
- **Reads per second:** ~23 req/sec (100,000 * 20 / 86400)
- **Writes per second:** ~6 req/sec (100,000 * 5 / 86400)
- **Storage per year:** Assuming average note is 2KB. 1M users * 50 notes/year * 2KB = ~100 GB/year.

## Architecture Diagram & Components
```text
[Client] -> [DNS] -> [CDN] -> [Load Balancer]
                                    |
                       +------------+------------+
                       |                         |
               [App Server 1]            [App Server 2]
                       |                         |
                       +----------[Cache]--------+
                                    |
                           [Primary Database] -> [Read Replica]
                                    |
                                 [Queue]
                                    |
                                 [Worker]
Client: The front-end browser application.

DNS: Resolves the domain name to the load balancer's IP.

CDN: Serves static assets (HTML, CSS, JS) from edge nodes globally.

Load Balancer: Distributes incoming API traffic evenly across multiple application servers.

App Servers: Stateless backend servers handling API requests.

Cache (Redis): Stores frequently accessed data (like recent notes) to reduce DB load.

Primary DB (PostgreSQL): Handles all write operations to ensure data consistency.

Read Replica: Handles read-heavy queries to offload the primary DB.

Queue (RabbitMQ): Buffers background tasks (like sending welcome emails or heavy data exports).

Worker: Processes background tasks from the queue asynchronously.

Request Flows
GET /notes: Client requests LB -> LB routes to App Server -> App Server checks Cache. If miss, queries Read Replica DB -> returns JSON to client.

POST /notes: Client sends JSON to LB -> LB routes to App Server -> App Server validates input -> App Server writes to Primary DB -> clears relevant Cache -> returns 201 Created to client.

Trade-offs & SPOF Mitigation
Trade-off 1: Eventual consistency vs strict consistency. By reading from the Read Replica, users might momentarily see stale data after a write. We trade strict consistency for higher read throughput.

Trade-off 2: Complexity vs Performance. Adding Redis caching adds infrastructure complexity and cache-invalidation bugs, but significantly improves read latency.

SPOF Avoidance: The Load Balancer and App Servers are deployed in multi-AZ (Availability Zones). The Primary DB has an automated failover to the Read Replica if it crashes.
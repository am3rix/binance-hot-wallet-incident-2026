# Optional aggregate analytics service

This backend is **not** included in GitHub Pages hosting. It is an optional Cloudflare Worker built with Hono and D1. It has no secret-dependent feature in the public Vite bundle.

## Privacy model

The frontend does not send an analytics event until a visitor explicitly selects **Allow analytics**. Declining does not call the API. The service records a random session UUID, a two-character country code supplied by Cloudflare, and a UTC day. It does not store visitor IP addresses, user agents, full URL paths or cookies. The session ID is kept only for daily deduplication. Data older than 30 days is removed by the scheduled task.

Cloudflare and GitHub may independently process ordinary connection information; consult their privacy policies before launch.

## Deploy (optional)

1. Create a Cloudflare account, Workers project and D1 database.
2. Apply `schema.sql` to the D1 database.
3. Fill in the D1 binding in `wrangler.toml`.
4. Configure a long, random `ADMIN_TOKEN` using `wrangler secret put ADMIN_TOKEN`; never commit it.
5. Deploy with `npm install && npm run deploy`.
6. Set GitHub repository variable `ANALYTICS_API_URL` to your Worker origin and re-run the Pages workflow. Until then, the frontend has no analytics endpoint and sends no analytics data.
7. Obtain aggregated daily country totals using authenticated `GET /v1/summary`; the admin key must never appear in the site source.

This is intentionally not an IP lookup or covert visitor-tracking service. When consent is denied, no optional analytics are stored. Aggregate counts will undercount declined visits and users with network blockers.

## Threat model

The endpoint is public; Origin checks only limit browser callers and are not authentication. A malicious client can forge events. Put Cloudflare WAF rate limits in front of it and do not interpret event totals as fraud-resistant measurements. Retain only data you genuinely need.

# Research room architecture and privacy

## Presentation model

The new reading interface uses seven structured sections, each with a source-linked figure, a narrow research narrative, a read-only evidence desk and one assessment question. Correct answers, rather than opening a page, determine completion. Progress and consent choice stay in local browser storage.

It is modeled on the task-by-task reading and practice pattern described in the [TryHackMe Rooms documentation](https://help.tryhackme.com/en/articles/6611837-rooms), without copying TryHackMe assets, branding or page layout.

## Technology and hosting

- **Frontend:** Vite, React, TypeScript, Radix UI Dialog and Lucide icons.
- **Static deployment:** GitHub Pages serves the production files built by GitHub Actions, not the Vite development server.
- **Evidence:** stable links to Ethereum public transactions and to cited reports. No sensitive transaction signing functionality exists.
- **Optional backend:** A separately hosted, private service may collect opt-in aggregate statistics. Its implementation and credentials are not included in this public repository.
- **Research indexing:** static long-form articles remain at `/research/` and `sitemap.xml` preserves canonical URLs.

## Consent

Declining analytics prevents optional event collection. A third-party infrastructure provider may still process network connection logs for service delivery or abuse prevention. Those are not controlled by this repository. The public app does not send optional analytics on refusal. Infrastructure providers may nevertheless retain connection logs independently.

## Security and build limits

- Production deploys include only static compiled output and public research assets.
- Development servers bind to 127.0.0.1 and are never deployed publicly.
- GitHub Action permissions are limited to repository read and Pages publishing.
- Source maps are disabled. Browser code is minified, but **obfuscation is not a security boundary**.
- Never put secrets, tokens, signing keys or admin credentials in `VITE_*` variables.
- Third-party package vulnerabilities can change; periodically review `npm audit` results and Vite advisories.
- Use browser security headers and CSP at a capable CDN or Cloudflare layer if stronger controls are required; GitHub Pages alone does not offer per-project arbitrary response-header control.

## Publication

1. In GitHub Settings → Pages, choose **GitHub Actions** as the source.
2. Inspect the `Build and publish research room` workflow result.
3. Test the main page and the retained `/research/` URLs.
4. Confirm that the Search Console HTML token remains reachable at its original path.

## Public source and backend separation

The web UI is client-side code, so its bundled JavaScript is visible to every visitor. Backend implementation, database migrations, internal routes, credentials and administrator controls should be maintained in a **separate private repository**. A frontend API endpoint may be visible in browser network requests; server-side authentication and authorization must never depend on hiding that endpoint. The optional analytics service is not enabled by default. Files previously committed to public Git history may remain recoverable from historical revisions even after removal from the current branch.

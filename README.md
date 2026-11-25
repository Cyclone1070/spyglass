# Spyglass

Your one-stop search engine for safe and reliable free media on the internet. No more confusing megathreads! Search for free books, movies, tv shows, games and more!

Built with React, React Router, TypeScript, Vite, Tailwind CSS and Motion. Uses React Compiler for optimised performance.

Visit [Spyglass Backend](https://github.com/Cyclone1070/spyglass-backend) to checkout the backend code.

**Live:** [spyglass.hoangmai.dev](https://spyglass.hoangmai.dev)

<img width="1680" height="936" alt="Screenshot 2025-09-26 at 18 31 45" src="https://github.com/user-attachments/assets/3a312a87-5c85-432f-841b-8447570a6ef7" />
<img width="1680" height="938" alt="Screenshot 2025-09-26 at 18 33 48" src="https://github.com/user-attachments/assets/6c9c8ed1-1765-46dd-9690-6e43f1b30899" />

## Self-maintenance

The backend scrapes on Sunday at 00:00 UTC. One hour later, an automated
maintenance run checks the scrape, updates dependencies, and runs the local
gate before touching production.

The workflow is:

1. Verify the latest production scrape from read-only logs.
2. Update frontend and backend dependencies within supported major versions.
3. Run the local gate: frontend install/lint/tests/build, backend
   restore/build/tests.
4. Diagnose and repair gate failures locally. If the failure cannot be resolved,
   stop and report instead of releasing.
5. Commit and push only after the gate is green.
6. Deploy, then run read-only canaries against the frontend, API, and favicon.

The gate never writes production data, never calls `POST /api/link`, and never
deploys. Major dependency upgrades are only taken when the gate passes without
code changes; skipped majors are recorded in the report.

The full procedure and gate live in the backend repository:
[MAINTENANCE.md](https://github.com/Cyclone1070/spyglass-backend/blob/main/MAINTENANCE.md)
and
[maintenance-gate.sh](https://github.com/Cyclone1070/spyglass-backend/blob/main/scripts/maintenance-gate.sh).

## Deployment

Production runs on **Cloudflare Workers (Static Assets)**, not Pages.

- Frontend: `https://spyglass.hoangmai.dev` (Worker `spyglass-web`)
- API: `https://api-spyglass.hoangmai.dev`
- Worker config: `wrangler.jsonc` — assets from `dist`, SPA fallback, custom domain

```bash
VITE_API_URL=https://api-spyglass.hoangmai.dev pnpm build
pnpm run deploy
```

`VITE_API_URL` is baked in at build time. `wrangler deploy` needs a `CLOUDFLARE_API_TOKEN` with Workers Scripts/Routes edit; the Worker name in the dashboard must match `spyglass-web`.

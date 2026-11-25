# Spyglass

Your one-stop search engine for safe and reliable free media on the internet. No more confusing megathreads! Search for free books, movies, tv shows, games and more!

Built with React, React Router, TypeScript, Tailwind CSS, Framer Motion and Embla Carousel. Utilised React Compiler for optimised performance.

Visit [Spyglass Backend](https://github.com/Cyclone1070/spyglass-backend) to checkout the backend code.

**Live:** [spyglass.hoangmai.dev](https://spyglass.hoangmai.dev)

<img width="1680" height="936" alt="Screenshot 2025-09-26 at 18 31 45" src="https://github.com/user-attachments/assets/3a312a87-5c85-432f-841b-8447570a6ef7" />
<img width="1680" height="938" alt="Screenshot 2025-09-26 at 18 33 48" src="https://github.com/user-attachments/assets/6c9c8ed1-1765-46dd-9690-6e43f1b30899" />

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

## Credits

Favicon: ["Spyglass"](https://game-icons.net/1x1/lorc/spyglass.html) by Lorc, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Recolored for the tab icon.

# Netlify deployment notes

- Publish directory: `dist` (the `netlify.toml` sets `base = "frontend"` and `publish = "dist"`, so Netlify will publish `frontend/dist`).
- Build command: `npm run build --prefix frontend` (runs the build script in `frontend/package.json`).

## Enabling Claude Haiku 4.5

This repo includes environment variables in `netlify.toml` that enable a runtime flag for "Claude Haiku 4.5" across contexts:

- `ENABLE_CLAUDE_HAIKU=true`
- `CLAUDE_MODEL=claude-haiku-4.5`

If you prefer to manage secrets or flags in the Netlify UI instead of in `netlify.toml`, do the following:

1. Go to your site in the Netlify dashboard.
2. Site settings -> Build & deploy -> Environment -> Environment variables.
3. Add `ENABLE_CLAUDE_HAIKU` = `true` and `CLAUDE_MODEL` = `claude-haiku-4.5` for the contexts you want.

Note: This repository does not contain any upstream integration code for Anthropic/Claude. These flags are simple environment toggles — your application code must read `process.env.ENABLE_CLAUDE_HAIKU` and `process.env.CLAUDE_MODEL` (or the platform-specific equivalent) to actually enable model usage.
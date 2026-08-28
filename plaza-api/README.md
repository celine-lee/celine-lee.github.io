# Plaza postbox

One Vercel function. The Mii studio POSTs a Mii to it; it opens a pull request
adding `_data/plaza/<nickname>.json` to this repo. Merging the pull request is
what puts somebody in the Plaza — nothing here writes to the live site.

Visitors need no GitHub account, which is the whole reason this exists.

## Deploy

1. **Make a token.** GitHub → Settings → Developer settings → Personal access
   tokens → *Fine-grained tokens*. Scope it to `celine-lee/celine-lee.github.io`
   only, with **Contents: Read and write** and **Pull requests: Read and write**.
   Nothing else.

2. **Make the Vercel project.** Import this repo, then set **Root Directory** to
   `plaza-api`. Framework preset: *Other*. There is no build step — Vercel picks
   up `api/submit.js` on its own.

3. **Set the environment variables** (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `GITHUB_TOKEN` | the token from step 1 |
   | `GITHUB_REPO` | `celine-lee/celine-lee.github.io` |
   | `GITHUB_BASE` | `main` |
   | `ALLOWED_ORIGIN` | `https://celine-lee.github.io` |

4. **Point the studio at it.** In `mii_channel_knockoff/mii.js`, set

   ```js
   const PLAZA_API = 'https://your-project.vercel.app/api/submit';
   ```

   Leave it empty and the studio quietly falls back to the copy-and-paste panel,
   so the site is never broken by this being down or undeployed.

## What stops abuse

The endpoint is public, so it assumes bad input and bounds the damage four ways:

- **Size cap** — `content-length` and the parsed body are both checked against
  `MAX_BYTES` (8 KB; one Mii is about 900 bytes) before anything else runs.
- **Schema rebuild** — the Mii is reconstructed field by field from `SPEC`.
  Unknown keys are dropped, numbers are clamped to the studio's own slider
  ranges, and a colour must be an index or a `#rrggbb`. The nickname is the only
  free text that survives, and the Plaza renders it as text.
- **Per-IP rate limit** — `RATE_MAX` sends per `RATE_WINDOW` (3 per hour).
  In-memory by default, which is per-instance and best-effort.
- **Open-PR cap** — refuses to open more than `MAX_OPEN_PRS` (25) pull requests
  that are still waiting. This is the one that holds when somebody rotates IPs.

### Making the rate limit durable (optional)

The in-memory limiter resets whenever Vercel starts a fresh instance. For a
limit that actually holds, create an [Upstash](https://upstash.com) Redis
database (the free tier is far more than this needs) and add:

| Variable | Value |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | from the Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | from the Upstash console |

The function switches to Redis on its own when both are present. This is the
only place a datastore earns a slot in this design — everything else is already
stored in git.

## Local

```bash
npx vercel dev
```

Then POST to `http://localhost:3000/api/submit` with
`{"name": "...", "mii": { ... }}` — the shape `submissionCode()` already builds.

## Turning it off

Delete `GITHUB_TOKEN` from the Vercel project. The endpoint starts answering
`503 unconfigured`, and the studio falls back to copy-and-paste.

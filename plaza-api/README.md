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
  In-memory by default, which is per-instance and best-effort; durable with
  Redis, below. Every response carries `x-plaza-ratelimit` saying which one
  answered: `redis`, `memory`, or `memory-fallback` when Redis was configured
  but would not answer.
- **Open-PR cap** — refuses to open more than `MAX_OPEN_PRS` (25) pull requests
  that are still waiting. This is the one that holds when somebody rotates IPs.

### Making the rate limit durable

The in-memory limiter resets whenever Vercel starts a fresh instance, so a
determined sender only has to wait for a cold start. Redis gives a limit that
actually holds. This is the only place a datastore earns a slot in this design
— everything else is already stored in git.

The easiest route is Vercel's own marketplace: **Storage → Create Database →
Upstash for Redis**. Attaching it to the project sets the environment variables
for you, and the function reads either spelling:

| Variable | Also accepted as |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | `KV_REST_API_URL` |
| `UPSTASH_REDIS_REST_TOKEN` | `KV_REST_API_TOKEN` |

Provisioning at [upstash.com](https://upstash.com) directly and pasting the two
values in by hand works the same way. Either way the free tier is far more than
this needs — a send is two Redis commands.

Redis takes over on its own once both are present. **Vercel only picks up new
environment variables on a redeploy**, so attaching the database is not enough
on its own — redeploy afterwards, or the function goes on running without it.

To confirm:

```bash
curl -si -X POST https://<your-project>.vercel.app/api/submit \
  -H 'content-type: application/json' -d '{"name":"","mii":{}}' | grep -i x-plaza-ratelimit
```

That payload is refused for having no nickname, so nothing is created and no
send is counted, but the header still reports which limiter is configured.
`redis` means it is wired up.

A request that gets far enough to actually be counted reports what *answered*,
which can differ: `memory-fallback` means the variables are set but Redis would
not answer, and the count fell back to the in-memory bucket rather than letting
everyone through — so the endpoint stays limited either way.

#### How the counter works

`SET key 0 EX <window> NX` then `INCR key`, pipelined. `SET..NX` leaves an
existing counter alone, so the window is fixed from the first request in it, and
no path can leave a key without a TTL — which would block that address forever.

## Local

```bash
npx vercel dev
```

Then POST to `http://localhost:3000/api/submit` with
`{"name": "...", "mii": { ... }}` — the shape `submissionCode()` already builds.

## Turning it off

Delete `GITHUB_TOKEN` from the Vercel project. The endpoint starts answering
`503 unconfigured`, and the studio falls back to copy-and-paste.

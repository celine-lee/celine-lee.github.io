/* ============================================================
   PLAZA SUBMISSIONS  →  A PULL REQUEST

   The studio POSTs one Mii here.  This writes _data/plaza/<slug>.json on a
   fresh branch of the site repo and opens a pull request.  Merging that pull
   request is what actually puts somebody in the Plaza, so nothing reaches the
   live site without a human saying yes.

   Environment (set in the Vercel project):
     GITHUB_TOKEN    fine-grained PAT scoped to the site repo, with
                     Contents: read/write and Pull requests: read/write.
     GITHUB_REPO     "owner/name".   default celine-lee/celine-lee.github.io
     GITHUB_BASE     branch to open against.  default main
     ALLOWED_ORIGIN  comma-separated origins allowed to call this.
     UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
                     optional.  With them the per-IP limit is durable and
                     shared across instances; without them it is a per-instance
                     best effort, backed up by the open-pull-request cap below.
     MAX_BYTES / RATE_MAX / RATE_WINDOW / MAX_OPEN_PRS   optional overrides.
   ============================================================ */

import { randomBytes } from 'node:crypto';

const REPO  = process.env.GITHUB_REPO  || 'celine-lee/celine-lee.github.io';
const BASE  = process.env.GITHUB_BASE  || 'main';
const TOKEN = process.env.GITHUB_TOKEN || '';
const DIR   = '_data/plaza';

const MAX_BYTES    = int(process.env.MAX_BYTES,    8 * 1024); // one Mii is ~900 bytes
const RATE_MAX     = int(process.env.RATE_MAX,     3);        // sends per IP per window
const RATE_WINDOW  = int(process.env.RATE_WINDOW,  3600);     // seconds
const MAX_OPEN_PRS = int(process.env.MAX_OPEN_PRS, 25);       // global backstop

const ORIGINS = (process.env.ALLOWED_ORIGIN ||
  'https://celine-lee.github.io,http://localhost:4000').split(',').map(s => s.trim());

function int(v, d){ const n = parseInt(v, 10); return Number.isFinite(n) ? n : d; }

/* ============================================================
   VALIDATION

   Every field is rebuilt from scratch against this spec, so anything the
   payload carries that is not named here is dropped rather than sanitised.
   Numbers are clamped to the studio's own slider ranges; a colour is either an
   index into a palette or a #rrggbb from the colour wheel.  No other string
   from the payload is ever written to the file.
   ============================================================ */
const num  = (min, max) => ({k:'num', min, max});
const bool = {k:'bool'};
const idx  = {k:'idx'};                 // 0..63, a style index
const col  = {k:'col'};                 // 0..63 or "#rrggbb"

const SPEC = {
  favorite: bool,
  mingle:   bool,
  birthday: {m: num(1, 12), d: num(1, 31)},
  skin:     col,
  face:     {shape: idx, size: num(.86, 1.14), width: num(.86, 1.16), jaw: num(.82, 1.2)},
  hair:     {style: idx, color: col, y: num(-16, 16), size: num(.9, 1.12), flip: bool},
  brows:    {style: idx, color: col, y: num(-24, 26), spacing: num(-14, 24),
             size: num(.7, 1.35), rot: num(-25, 25)},
  eyes:     {style: idx, color: col, y: num(-26, 28), spacing: num(-12, 26),
             size: num(.72, 1.3), stretch: num(.7, 1.35), rot: num(-22, 22)},
  nose:     {style: idx, x: num(-32, 32), y: num(-26, 30), size: num(.7, 1.45),
             width: num(.68, 1.45)},
  mouth:    {style: idx, color: col, x: num(-34, 34), y: num(-28, 32),
             size: num(.7, 1.35), stretch: num(.7, 1.4)},
  beard:    {must: idx, style: idx, color: col, size: num(.7, 1.35), y: num(-18, 18)},
  glasses:  {style: idx, color: col, y: num(-22, 24), size: num(.75, 1.25)},
  hat:      {style: idx, color: col},
  jewel:    {color: col, cartL: bool, cartR: bool, studL: bool, studR: bool,
             dropL: bool, dropR: bool, necklace: bool, choker: bool},
  mole:     {on: bool, color: col, x: num(-130, 52), y: num(-70, 60), size: num(.6, 1.8)},
  body:     {color: col, pants: col, shoes: col, dress: bool,
             build: num(.78, 1.28), height: num(.8, 1.2)}
};

const HEX = /^#[0-9a-f]{6}$/i;
const clamp = (n, lo, hi) => n < lo ? lo : n > hi ? hi : n;
const round = n => Math.round(n * 1000) / 1000;

/* A missing field falls back rather than failing outright: an older studio
   build should still be able to send somebody over. */
function coerce(spec, v){
  if(spec.k === 'bool') return v === true;
  if(spec.k === 'idx')  return Number.isFinite(+v) ? clamp(Math.round(+v), 0, 63) : 0;
  if(spec.k === 'col'){
    if(typeof v === 'string') return HEX.test(v) ? v.toLowerCase() : 0;
    return Number.isFinite(+v) ? clamp(Math.round(+v), 0, 63) : 0;
  }
  if(spec.k === 'num'){
    /* A slider that scales something runs across 1; one that offsets it runs
       across 0.  Either way the neutral value is the one to fall back on — the
       range's own minimum would arrive as a squashed face. */
    if(!Number.isFinite(+v)) return spec.min > 0 ? clamp(1, spec.min, spec.max) : 0;
    return round(clamp(+v, spec.min, spec.max));
  }
  return null;
}

function build(spec, src){
  const out = {};
  for(const key in spec){
    const s = spec[key], v = src && typeof src === 'object' ? src[key] : undefined;
    out[key] = s.k ? coerce(s, v) : build(s, v);
  }
  return out;
}

/* A nickname is the one piece of free text, and the plaza only ever renders it
   as text.  Drop control characters, collapse whitespace, and hold it to the
   studio's own 16-character limit. */
function cleanName(v){
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);
}

const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '').slice(0, 40);

/* ============================================================
   RATE LIMITING
   ============================================================ */
const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL   || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';

/* Per-instance fallback.  Vercel keeps a warm instance around for a while, so
   this catches the obvious hammering; the open-pull-request cap below catches
   what slips past it. */
const buckets = new Map();

async function overRateLimit(ip){
  if(UPSTASH_URL && UPSTASH_TOKEN) return upstashOver(ip);

  const now = Date.now(), b = buckets.get(ip);
  if(!b || now > b.reset){
    buckets.set(ip, {n: 1, reset: now + RATE_WINDOW * 1000});
    if(buckets.size > 5000) buckets.clear();          // never grow without bound
    return false;
  }
  b.n += 1;
  return b.n > RATE_MAX;
}

/* INCR the counter, and put an expiry on it the first time we see it. */
async function upstashOver(ip){
  const key = `plaza:rate:${ip}`;
  try{
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {authorization: `Bearer ${UPSTASH_TOKEN}`, 'content-type': 'application/json'},
      body: JSON.stringify([['INCR', key], ['EXPIRE', key, String(RATE_WINDOW), 'NX']])
    });
    if(!res.ok) return false;                         // never lock people out over an outage
    const out = await res.json();
    return Number(out && out[0] && out[0].result) > RATE_MAX;
  }catch{
    return false;
  }
}

/* ============================================================
   GITHUB
   ============================================================ */
async function gh(path, init = {}){
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'mii-plaza-submit',
      ...(init.body ? {'content-type': 'application/json'} : {}),
      ...init.headers
    }
  });
  const text = await res.text();
  let json = null;
  try{ json = text ? JSON.parse(text) : null; }catch{}
  return {ok: res.ok, status: res.status, json};
}

/* Every plaza submission still waiting on Celine.  Two things read this: the
   cap that stops the queue growing without bound — the limit that still holds
   when the per-IP one is walked around with fresh addresses — and the check for
   a nickname that is already in the queue, which is what stops a double click
   turning into two pull requests for the same Mii. */
async function openPlazaPRs(){
  const r = await gh(`/repos/${REPO}/pulls?state=open&per_page=100&base=${encodeURIComponent(BASE)}`);
  if(!r.ok || !Array.isArray(r.json)) return [];
  return r.json.filter(p => p.head && typeof p.head.ref === 'string'
                            && p.head.ref.startsWith('plaza/'));
}

/* ============================================================
   HANDLER
   ============================================================ */
export default async function handler(req, res){
  const origin  = req.headers.origin || '';
  const allowed = ORIGINS.includes(origin) ? origin : ORIGINS[0];
  res.setHeader('access-control-allow-origin', allowed);
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-max-age', '86400');
  res.setHeader('vary', 'origin');

  if(req.method === 'OPTIONS') return res.status(204).end();
  if(req.method !== 'POST')    return fail(res, 405, 'method', 'POST only.');
  if(origin && !ORIGINS.includes(origin))
    return fail(res, 403, 'origin', 'This studio is not allowed to send here.');
  if(!TOKEN)
    return fail(res, 503, 'unconfigured', 'The Plaza postbox is not set up yet.');

  /* --- size cap, before anything else touches the payload --- */
  if(Number(req.headers['content-length'] || 0) > MAX_BYTES)
    return fail(res, 413, 'too-big', 'That Mii is far too large to send.');

  let body = req.body;
  if(typeof body === 'string'){
    if(Buffer.byteLength(body) > MAX_BYTES)
      return fail(res, 413, 'too-big', 'That Mii is far too large to send.');
    try{ body = JSON.parse(body); }catch{ return fail(res, 400, 'json', 'Unreadable Mii.'); }
  }
  if(!body || typeof body !== 'object')
    return fail(res, 400, 'json', 'Unreadable Mii.');
  if(Buffer.byteLength(JSON.stringify(body)) > MAX_BYTES)
    return fail(res, 413, 'too-big', 'That Mii is far too large to send.');

  /* --- the nickname decides the filename, so it has to survive slugging --- */
  const name = cleanName(body.name || (body.mii && body.mii.name));
  const slug = slugify(name);
  if(!name || !slug)
    return fail(res, 400, 'noname', 'Give this Mii a nickname first.');

  /* --- rate limits --- */
  const ip = String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '')
               .split(',')[0].trim() || 'unknown';
  if(await overRateLimit(ip))
    return fail(res, 429, 'rate', 'That is a lot of Miis. Try again in a little while.');
  /* --- the queue: how long it is, and whether this nickname is already in it --- */
  const waiting = await openPlazaPRs();
  if(waiting.length >= MAX_OPEN_PRS)
    return fail(res, 429, 'queue', 'The Plaza queue is full right now. Try again later.');
  if(waiting.some(p => p.head.ref.startsWith(`plaza/${slug}-`)))
    return fail(res, 409, 'pending',
      `“${name}” is already waiting to join the Plaza.`);

  /* --- rebuild the Mii from the spec --- */
  const mii = build(SPEC, body.mii || {});
  mii.name  = name;
  const entry = {id: name.toLowerCase(), name, mii};
  const file  = `${DIR}/${slug}.json`;

  /* --- is the nickname already taken? --- */
  const existing = await gh(`/repos/${REPO}/contents/${file}?ref=${encodeURIComponent(BASE)}`);
  if(existing.ok)
    return fail(res, 409, 'taken',
      `“${name}” is taken — somebody in the Plaza already goes by it. Try another nickname.`);
  if(existing.status !== 404)
    return fail(res, 502, 'github', 'Could not reach the Plaza just now.');

  /* --- branch off the base --- */
  const ref = await gh(`/repos/${REPO}/git/ref/heads/${encodeURIComponent(BASE)}`);
  if(!ref.ok || !ref.json || !ref.json.object)
    return fail(res, 502, 'github', 'Could not reach the Plaza just now.');

  const branch = `plaza/${slug}-${randomBytes(4).toString('hex')}`;
  const made = await gh(`/repos/${REPO}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ref: `refs/heads/${branch}`, sha: ref.json.object.sha})
  });
  if(!made.ok) return fail(res, 502, 'github', 'Could not start a Plaza entry.');

  /* --- write the file --- */
  const put = await gh(`/repos/${REPO}/contents/${file}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Add ${name} to the Plaza`,
      content: Buffer.from(JSON.stringify(entry, null, 2) + '\n').toString('base64'),
      branch
    })
  });
  if(!put.ok) return fail(res, 502, 'github', 'Could not write the Plaza entry.');

  /* --- open the pull request --- */
  const pr = await gh(`/repos/${REPO}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `Plaza: ${name}`,
      head: branch,
      base: BASE,
      body: `${name} sent themselves over from the Mii studio.\n\n`
          + `Merging this adds \`${file}\` and puts them in the Plaza.\n`
          + `Delete the file later to send them home.\n`
    })
  });
  if(!pr.ok || !pr.json) return fail(res, 502, 'github', 'Could not open the Plaza entry.');

  return res.status(201).json({ok: true, name, url: pr.json.html_url, number: pr.json.number});
}

function fail(res, status, reason, message){
  return res.status(status).json({ok: false, reason, message});
}

/* ============================================================
   MII ENGINE  —  everything is SVG, everything is parametric.
   Shared by the studio (index.html) and the plaza (plaza.html).
   ============================================================ */


const CX = 256;              // horizontal centre of the head
let LINE = '#3a3129';        // universal outline colour (swapped for mono tiles)
const INK_BASE = '#3a3129';

/* ---------------- palettes ---------------- */
const SKINS = ['#ffcfd6','#ffe2c8','#f8caa4','#edad7c','#dd9159','#c47540','#a45c2d','#7f451f','#582d13'];
const HAIRC = ['#241d17','#3d2a1c','#5b3a22','#7a4a24','#9c6b3d',
               '#c08b4a','#dcae5f','#eed08a','#e6e8ea'];
const EYEC  = ['#2c2a28','#5b3a22','#8a6a34','#3f7a4a','#2f6ea8','#6a6f75'];
const MOUTHC= ['#c9553f','#d96a5a','#e07d7d','#b8404a','#8e3550','#d4788e','#a94c6b','#6d3a3a'];
const SHIRTC= ['#d0243c','#ff6600','#ffd400','#a4d820','#009a3d','#00a0e9',
               '#003cb4','#ff87b0','#7a26a0','#8c5a2b','#f2f4f6','#333a3f'];
const GLASSC= ['#2c2a28','#5b3a22','#8a6a34','#2f6ea8','#a83030','#b0b6bc','#d4a017','#c46aa0'];
const PANTSC= ['#3f5f92','#26304a','#2b3138','#5d6873','#8f7f61','#6b4a2f','#4a5c3a','#c9cdd2','#8c3a3a','#5a3d6b'];
const SHOEC = ['#f2f4f6','#2b3138','#c0392b','#2f6ea8','#6b4423','#8c959e','#2e7d5b','#d0699a'];
const FAV_PANTS = '#c25a24';   // the rust orange worn in the reference photo
const HATC  = ['#d0243c','#ff6600','#ffd400','#2e7d5b','#00a0e9','#2f4f8f',
               '#7a26a0','#d0699a','#8c5a2b','#f2f4f6','#8c959e','#2b3138'];   // the rust orange worn in the reference photo

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
/* Colour slots hold either a palette index or a literal hex from the wheel. */
const pick = (list, v) => typeof v === 'string' ? v : list[clamp(Math.round(+v)||0, 0, list.length-1)];

/* ============================================================
   FACE — generated from parameters so every shape stays smooth
   ============================================================ */
const FACES = [
  {n:'Oval',    tY:120, tW:88,  cW:106, cY:236, jW:92,  jY:318, chW:34, chY:388},
  {n:'Round',   tY:118, tW:98,  cW:113, cY:246, jW:105, jY:322, chW:50, chY:384},
  {n:'Square',  tY:122, tW:95,  cW:108, cY:228, jW:105, jY:338, chW:68, chY:382},
  {n:'Pointed', tY:120, tW:88,  cW:104, cY:228, jW:82,  jY:312, chW:16, chY:394},
  {n:'Broad',   tY:126, tW:92,  cW:113, cY:252, jW:109, jY:330, chW:54, chY:380},
  {n:'Narrow',  tY:118, tW:78,  cW:94,  cY:238, jW:80,  jY:318, chW:30, chY:390},
  {n:'Heart',   tY:118, tW:99,  cW:111, cY:222, jW:80,  jY:314, chW:22, chY:390},
  {n:'Long',    tY:110, tW:84,  cW:100, cY:242, jW:88,  jY:340, chW:38, chY:408},
  {n:'Bread',   tY:120, tW:97,  cW:111, cY:250, jW:103, jY:332, chW:58, chY:386},
  {n:'Diamond', tY:126, tW:74,  cW:113, cY:250, jW:84,  jY:322, chW:24, chY:390},
  {n:'Chubby',  tY:124, tW:100, cW:117, cY:256, jW:112, jY:328, chW:62, chY:378},
  {n:'Chiseled',tY:118, tW:90,  cW:105, cY:232, jW:99,  jY:334, chW:44, chY:392}
];

function faceGeom(m){
  const f = FACES[m.face.shape];
  const w = m.face.width, j = m.face.jaw;
  return {
    tY:f.tY, tW:f.tW*w, cW:f.cW*w, cY:f.cY,
    jW:f.jW*w*j, jY:f.jY, chW:f.chW*w*j, chY:f.chY
  };
}
function facePath(g){
  const L=w=>CX-w, R=w=>CX+w;
  const a=(g.cY-g.tY), b=(g.jY-g.cY), c=(g.chY-g.jY);
  return [
    `M ${CX} ${g.tY}`,
    `C ${L(g.tW)} ${g.tY}, ${L(g.cW)} ${g.tY+a*0.34}, ${L(g.cW)} ${g.cY}`,
    `C ${L(g.cW)} ${g.cY+b*0.44}, ${L(g.jW)} ${g.jY-b*0.32}, ${L(g.jW)} ${g.jY}`,
    `C ${L(g.jW)} ${g.jY+c*0.5}, ${L(g.chW)} ${g.chY}, ${CX} ${g.chY}`,
    `C ${R(g.chW)} ${g.chY}, ${R(g.jW)} ${g.jY+c*0.5}, ${R(g.jW)} ${g.jY}`,
    `C ${R(g.jW)} ${g.jY-b*0.32}, ${R(g.cW)} ${g.cY+b*0.44}, ${R(g.cW)} ${g.cY}`,
    `C ${R(g.cW)} ${g.tY+a*0.34}, ${R(g.tW)} ${g.tY}, ${CX} ${g.tY}`,
    'Z'
  ].join(' ');
}

/* ============================================================
   HAIR — each entry returns an SVG fragment.
   back()  draws behind the head, front() draws over it.
   ============================================================ */
const CAP = 'M 148 264 C 141 168, 190 110, 256 110 C 322 110, 371 168, 364 264 '
          + 'C 357 214, 336 180, 256 180 C 176 180, 155 214, 148 264 Z';

/* The whole skull, used as the short tapered underlayer of a fade. */
const FADE = 'M 147 266 C 140 170, 190 112, 256 112 C 322 112, 372 170, 365 266 '
           + 'C 357 218, 334 188, 256 188 C 178 188, 155 218, 147 266 Z';
/* The longer hair that sits on top of a fade, cut off by a flat line-up. */
const LINEUP = 'M 162 226 C 154 172, 196 116, 256 116 C 316 116, 358 172, 350 226 '
             + 'C 348 206, 344 194, 338 190 L 174 190 C 168 194, 164 206, 162 226 Z';

function shade(hex, amt){                    // lighten (+) / darken (-) a hex colour
  const n = parseInt(hex.slice(1),16);
  const f = v => clamp(Math.round(v + 255*amt), 0, 255);
  return '#' + [f(n>>16&255), f(n>>8&255), f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* The beauty spot comes in two: a dark mole, or a shade just under the wearer's
   own skin, which reads as a dimple.  The second has to be worked out from the
   skin tone, so this is a function where the other palettes are flat lists. */
const MOLE_DARK = '#5a4030';
const moleColors = m => [MOLE_DARK, shade(pick(SKINS, m.skin), -.085)];

const HAIRS = [
  {n:'Bald', front:c=>``},

  {n:'Buzz', front:c=>`<path d="M 147 266 C 140 170, 190 112, 256 112 C 322 112, 372 170, 365 266
     C 357 218, 334 188, 256 188 C 178 188, 155 218, 147 266 Z" fill="${c}"/>`},

  {n:'Crew', front:c=>`<path d="${CAP}" fill="${c}"/>
     <path d="M 176 186 C 200 168, 312 168, 336 186 C 312 176, 200 176, 176 186 Z" fill="${shade(c,.07)}"/>`},

  {n:'Spiky', front:c=>`<path d="M 148 268 C 141 190, 168 136, 200 126 L 196 92 L 226 120 L 232 84
     L 258 118 L 272 86 L 292 122 L 320 100 L 320 132 C 352 152, 371 196, 364 268
     C 357 216, 336 182, 256 182 C 176 182, 155 216, 148 268 Z" fill="${c}"/>`},

  {n:'Side Part', front:c=>`<path d="M 148 268 C 141 168, 190 108, 256 108 C 326 108, 372 168, 364 268
     C 358 218, 340 186, 300 180 C 268 176, 214 206, 186 224 C 168 236, 156 252, 148 268 Z" fill="${c}"/>
     <path d="M 300 180 C 268 176, 214 206, 186 224 C 226 200, 268 188, 302 190 Z" fill="${shade(c,.08)}"/>`},

  {n:'Bowl', front:c=>`<path d="M 144 250 C 138 156, 190 104, 256 104 C 322 104, 374 156, 368 250
     L 368 214 C 340 196, 172 196, 144 214 Z" fill="${c}"/>
     <path d="M 144 214 C 172 196, 340 196, 368 214 L 368 250 C 366 226, 356 214, 256 214
     C 156 214, 146 226, 144 250 Z" fill="${c}"/>`},

  {n:'Messy', front:c=>`<path d="M 146 270 C 138 176, 186 106, 256 106 C 328 106, 374 176, 366 270
     C 360 234, 348 206, 330 198 Q 314 220 300 196 Q 284 220 266 194 Q 248 218 230 194
     Q 212 218 194 198 C 170 210, 152 236, 146 270 Z" fill="${c}"/>`},

  {n:'Slick', front:c=>`<path d="M 148 266 C 136 154, 186 96, 250 94 C 292 92, 318 108, 322 96
     C 340 108, 372 158, 364 266 C 356 208, 336 180, 256 180 C 184 180, 158 210, 148 266 Z" fill="${c}"/>
     <path d="M 172 176 C 196 138, 268 116, 330 122" fill="none" stroke="${shade(c,.15)}"
       stroke-width="8" stroke-linecap="round"/>
     <path d="M 176 202 C 202 164, 272 142, 340 150" fill="none" stroke="${shade(c,.1)}"
       stroke-width="7" stroke-linecap="round"/>
     <path d="M 186 224 C 212 190, 282 170, 348 180" fill="none" stroke="${shade(c,.07)}"
       stroke-width="6" stroke-linecap="round"/>`},

  {n:'Afro', front:c=>`<path d="M 256 76 C 172 76, 116 134, 116 208 C 116 258, 140 292, 172 300
     C 168 264, 176 214, 256 214 C 336 214, 344 264, 340 300 C 372 292, 396 258, 396 208
     C 396 134, 340 76, 256 76 Z" fill="${c}"/>
     <circle cx="168" cy="150" r="34" fill="${c}"/><circle cx="344" cy="150" r="34" fill="${c}"/>
     <circle cx="212" cy="104" r="34" fill="${c}"/><circle cx="300" cy="104" r="34" fill="${c}"/>
     <circle cx="256" cy="92"  r="34" fill="${c}"/>
     <circle cx="140" cy="214" r="30" fill="${c}"/><circle cx="372" cy="214" r="30" fill="${c}"/>`},

  {n:'Curly', front:c=>`<path d="${CAP}" fill="${c}"/>
     <circle cx="168" cy="176" r="26" fill="${c}"/><circle cx="214" cy="140" r="30" fill="${c}"/>
     <circle cx="256" cy="124" r="30" fill="${c}"/><circle cx="298" cy="140" r="30" fill="${c}"/>
     <circle cx="344" cy="176" r="26" fill="${c}"/><circle cx="150" cy="222" r="22" fill="${c}"/>
     <circle cx="362" cy="222" r="22" fill="${c}"/>`},

  {n:'Long', back:c=>`<path d="M 152 200 C 136 300, 138 420, 154 486 L 208 486 C 194 416, 192 300, 196 232 Z
     M 360 200 C 376 300, 374 420, 358 486 L 304 486 C 318 416, 320 300, 316 232 Z" fill="${c}"/>
     <path d="M 150 210 C 140 320, 146 420, 158 486 L 354 486 C 366 420, 372 320, 362 210 Z" fill="${shade(c,-.05)}"/>`,
   front:c=>`<path d="M 146 274 C 138 166, 190 104, 256 104 C 322 104, 374 166, 366 274
     C 360 216, 340 182, 306 178 C 286 200, 236 210, 196 200 C 172 210, 154 234, 146 274 Z" fill="${c}"/>`},

  {n:'Bob', back:c=>`<path d="M 148 220 C 130 300, 132 372, 146 404 L 366 404 C 380 372, 382 300, 364 220 Z" fill="${shade(c,-.05)}"/>`,
   front:c=>`<path d="M 144 300 C 134 170, 190 102, 256 102 C 322 102, 378 170, 368 300
     C 360 222, 342 182, 256 182 C 170 182, 152 222, 144 300 Z" fill="${c}"/>`},

  {n:'Ponytail', back:c=>`<path d="M 352 200 C 400 214, 418 268, 406 330 C 398 372, 372 396, 350 386
     C 372 350, 376 268, 344 230 Z" fill="${c}"/>`,
   front:c=>`<path d="M 148 264 C 140 158, 192 104, 256 104 C 322 104, 372 158, 364 264
     C 356 206, 336 178, 256 178 C 178 178, 156 206, 148 264 Z" fill="${c}"/>
     <path d="M 200 152 C 236 130, 288 132, 320 156 C 284 142, 236 140, 200 152 Z" fill="${shade(c,.08)}"/>`},

  {n:'Pigtails', back:c=>`<ellipse cx="128" cy="294" rx="38" ry="56" fill="${c}"/>
     <ellipse cx="384" cy="294" rx="38" ry="56" fill="${c}"/>`,
   front:c=>`<path d="${CAP}" fill="${c}"/>
     <path d="M 154 202 C 126 210, 110 238, 112 264 C 132 234, 152 220, 172 214 Z" fill="${c}"/>
     <path d="M 358 202 C 386 210, 402 238, 400 264 C 380 234, 360 220, 340 214 Z" fill="${c}"/>
     <rect x="96" y="238" width="34" height="15" rx="7.5" fill="${shade(c,-.14)}"/>
     <rect x="382" y="238" width="34" height="15" rx="7.5" fill="${shade(c,-.14)}"/>`},

  {n:'Mohawk', front:c=>`<path d="M 216 198 C 206 130, 228 80, 256 58 C 284 80, 306 130, 296 198 Z" fill="${c}"/>
     <path d="M 216 198 C 212 152, 230 106, 256 78 C 244 122, 236 160, 236 198 Z" fill="${shade(c,.09)}"/>
     <path d="M 150 262 C 148 226, 164 198, 200 188 L 204 214 C 176 222, 158 240, 150 262 Z"
       fill="${c}" opacity=".42"/>
     <path d="M 362 262 C 364 226, 348 198, 312 188 L 308 214 C 336 222, 354 240, 362 262 Z"
       fill="${c}" opacity=".42"/>`},

  {n:'Wavy Long', back:c=>`<path d="M 148 210 C 122 300, 128 420, 148 492 L 194 492
     C 176 428, 172 320, 186 240 Z M 364 210 C 390 300, 384 420, 364 492 L 318 492
     C 336 428, 340 320, 326 240 Z" fill="${c}"/>
     <path d="M 152 220 C 134 330, 140 428, 156 492 L 356 492 C 374 428, 378 330, 360 220 Z" fill="${shade(c,-.05)}"/>`,
   front:c=>`<path d="M 146 276 C 136 162, 190 100, 256 100 C 322 100, 376 162, 366 276
     C 358 216, 344 184, 316 178 C 292 202, 268 196, 250 182 C 224 194, 190 196, 168 214
     C 156 228, 149 250, 146 276 Z" fill="${c}"/>`},

  {n:'Top Bun', front:c=>`<circle cx="256" cy="86" r="34" fill="${c}"/>
     <path d="M 150 262 C 143 168, 192 108, 256 108 C 320 108, 369 168, 362 262
     C 356 212, 334 180, 256 180 C 178 180, 156 212, 150 262 Z" fill="${c}"/>
     <path d="M 232 118 C 244 108, 268 108, 280 118 C 268 112, 244 112, 232 118 Z" fill="${shade(c,.1)}"/>`},

  {n:'Fringe', front:c=>`<path d="M 146 268 C 138 164, 190 102, 256 102 C 322 102, 374 164, 366 268
     C 360 224, 344 194, 320 188 Q 304 226 288 192 Q 270 230 252 192 Q 234 226 216 192
     C 180 200, 152 226, 146 268 Z" fill="${c}"/>`},

  {n:'Receding', hl:172, front:c=>`<path d="M 148 274 C 140 172, 190 108, 256 108 C 322 108, 372 172, 364 274
     C 358 226, 344 190, 304 176 C 286 178, 274 202, 256 202
     C 238 202, 226 178, 208 176 C 168 190, 154 226, 148 274 Z" fill="${c}"/>`},

  /* --- long, straight, with a blunt fringe and side curtains --- */
  {n:'Blunt Long',
   back:c=>`<path d="M 150 206 C 132 302, 138 424, 156 490 L 356 490 C 374 424, 380 302, 362 206 Z" fill="${shade(c,-.06)}"/>
     <path d="M 152 202 C 138 300, 142 420, 158 486 L 206 486 C 192 414, 190 300, 196 234 Z
              M 360 202 C 374 300, 370 420, 354 486 L 306 486 C 320 414, 322 300, 316 234 Z" fill="${c}"/>`,
   front:c=>`<path d="M 142 348 C 134 166, 190 98, 256 98 C 322 98, 378 166, 370 348
     L 342 336 C 348 258, 346 214, 344 206 L 168 206 C 166 214, 164 258, 170 336 Z" fill="${c}"/>`},

  /* --- two textured afro puffs --- */
  {n:'Afro Puffs',
   back:c=>`<g fill="${c}">
     <circle cx="150" cy="178" r="54"/><circle cx="120" cy="216" r="32"/><circle cx="124" cy="140" r="32"/>
     <circle cx="184" cy="132" r="34"/><circle cx="180" cy="224" r="32"/><circle cx="204" cy="180" r="30"/>
     <circle cx="362" cy="178" r="54"/><circle cx="392" cy="216" r="32"/><circle cx="388" cy="140" r="32"/>
     <circle cx="328" cy="132" r="34"/><circle cx="332" cy="224" r="32"/><circle cx="308" cy="180" r="30"/></g>`,
   front:c=>`<path d="M 152 262 C 146 178, 192 122, 256 122 C 320 122, 366 178, 360 262
     C 354 212, 334 184, 256 184 C 178 184, 158 212, 152 262 Z" fill="${c}"/>
     <g fill="${c}"><circle cx="206" cy="146" r="24"/><circle cx="256" cy="132" r="26"/>
     <circle cx="306" cy="146" r="24"/></g>`},

  /* --- voluminous loose ringlets --- */
  {n:'Loose Curls',
   front:c=>`<path d="M 144 268 C 134 168, 188 104, 256 104 C 324 104, 378 168, 368 268
     C 360 216, 338 182, 256 182 C 174 182, 152 216, 144 268 Z" fill="${c}"/>
     <g fill="${c}"><circle cx="178" cy="152" r="30"/><circle cx="218" cy="120" r="34"/>
     <circle cx="262" cy="110" r="36"/><circle cx="306" cy="124" r="33"/><circle cx="342" cy="158" r="29"/>
     <circle cx="156" cy="200" r="26"/><circle cx="358" cy="200" r="26"/>
     <circle cx="194" cy="188" r="24"/><circle cx="320" cy="188" r="24"/></g>
`},

  /* --- short, neat, swept, high at the temples --- */
  {n:'Tapered', hl:176,
   front:c=>`<path d="M 150 262 C 144 172, 190 112, 256 112 C 322 112, 368 172, 362 262
     C 356 212, 338 184, 292 178 C 260 173, 216 192, 188 202
     C 168 210, 156 232, 150 262 Z" fill="${c}"/>
     <path d="M 292 178 C 260 173, 216 192, 188 202 C 222 187, 262 180, 294 185 Z" fill="${shade(c,.09)}"/>`},

  /* --- short textured crop, small irregular spikes --- */
  {n:'Textured',
   front:c=>`<path d="M 148 264 C 142 186, 174 132, 210 122
     L 214 104 L 228 122 L 238 102 L 252 120 L 264 100 L 278 120 L 290 104 L 302 122 L 314 108 L 316 128
     C 344 144, 368 192, 364 264 C 356 212, 334 180, 256 180 C 178 180, 156 212, 148 264 Z" fill="${c}"/>`},

  /* ============================================================
     TEXTURED / COILY STYLES
     A fade is two shapes: the whole skull in a lightened shade (the short,
     tapered sides), then the longer hair on top in the full colour, cut off
     by a flat line-up.  `hl` sits at the line-up so the scalp fill underneath
     never peeks past it.
     ============================================================ */

  /* --- brushed 360 waves over a taper --- */
  {n:'Waves', hl:186,
   front:c=>`<path d="${FADE}" fill="${shade(c,.22)}"/>
     <path d="${LINEUP}" fill="${c}"/>
     <g fill="none" stroke="${shade(c,.15)}" stroke-width="4.4" stroke-linecap="round">
       <path d="M 178 184 Q 256 152 334 184"/>
       <path d="M 174 166 Q 256 132 338 166"/>
       <path d="M 182 148 Q 256 118 330 148"/>
       <path d="M 202 132 Q 256 110 310 132"/>
     </g>`},

  /* --- two-strand twists fanning out of the crown --- */
  /* --- short locs, cropped just past the skull --- */
  {n:'Short Locs', hl:184,
   front:c=>{
     let s = '';
     const cx = 256, cy = 206, N = 16;
     for(let i=0;i<N;i++){
       const a  = Math.PI*1.03 + i * (Math.PI*0.94/(N-1));
       const r1 = 104 + ((i*7) % 3) * 7;
       s += `<path d="M ${(cx+Math.cos(a)*44).toFixed(1)} ${(cy+Math.sin(a)*44).toFixed(1)}
         L ${(cx+Math.cos(a)*r1).toFixed(1)} ${(cy+Math.sin(a)*r1).toFixed(1)}"
         stroke="${i%2 ? shade(c,-.07) : c}" stroke-width="17" stroke-linecap="round" fill="none"/>`;
     }
     return `<path d="${CAP}" fill="${c}"/>${s}`;
   }},

  /* --- locs grown out past the shoulders --- */
  {n:'Long Locs', hl:184,
   back:c=>{
     let s = '';
     for(let i=0;i<9;i++){
       const x = 154 + i*26, len = 400 + ((i*11) % 4) * 26;
       const sway = ((i % 2) ? 10 : -10) + (x - 256) * 0.10;
       s += `<path d="M ${x} 200 C ${x+sway} 300, ${x-sway} 380, ${(x+sway*1.4).toFixed(1)} ${len}"
         stroke="${i%2 ? shade(c,-.06) : c}" stroke-width="21" stroke-linecap="round" fill="none"/>`;
     }
     return s;
   },
   front:c=>{
     let s = '';
     const cx = 256, cy = 208, N = 13;
     for(let i=0;i<N;i++){
       const a  = Math.PI*1.06 + i * (Math.PI*0.88/(N-1));
       const r1 = 100 + ((i*5) % 3) * 6;
       s += `<path d="M ${(cx+Math.cos(a)*42).toFixed(1)} ${(cy+Math.sin(a)*42).toFixed(1)}
         L ${(cx+Math.cos(a)*r1).toFixed(1)} ${(cy+Math.sin(a)*r1).toFixed(1)}"
         stroke="${i%2 ? shade(c,-.06) : c}" stroke-width="18" stroke-linecap="round" fill="none"/>`;
     }
     /* two locs falling in front of the shoulders, framing the face */
     s += `<path d="M 168 238 C 152 300, 152 360, 162 418" stroke="${c}" stroke-width="20"
         stroke-linecap="round" fill="none"/>
       <path d="M 344 238 C 360 300, 360 360, 350 418" stroke="${shade(c,-.06)}" stroke-width="20"
         stroke-linecap="round" fill="none"/>`;
     return `<path d="${CAP}" fill="${c}"/>${s}`;
   }},

  /* --- dense coils cropped close, a rounded natural silhouette --- */
  {n:'Coily Crop', hl:190,
   front:c=>{
     /* The outline is a ring of coils rather than a curve, and the inside is
        packed with more of them in a lighter shade so the crop reads as
        texture instead of a helmet.  Both rings are laid out arithmetically
        so the same Mii draws the same way every time. */
     const ring = (n, rad, squash, cy, sizes, step) => {
       let out = '';
       for(let i=0;i<n;i++){
         const a = Math.PI*1.02 + i * (Math.PI*0.96/(n-1));
         const r = rad + ((i*step) % 4) * 3;
         out += `<circle cx="${(256+Math.cos(a)*r).toFixed(1)}"
           cy="${(cy+Math.sin(a)*r*squash).toFixed(1)}" r="${sizes[i % sizes.length]}"/>`;
       }
       return out;
     };
     return `<path d="M 142 272 C 134 178, 186 110, 256 110 C 326 110, 378 178, 370 272
       C 362 216, 338 188, 256 188 C 174 188, 150 216, 142 272 Z" fill="${c}"/>
       <g fill="${c}">${ring(26, 114, .86, 200, [14,17,15], 7)}</g>
       <g fill="${shade(c,.08)}">${ring(19, 76, .84, 198, [11,14,12], 5)}</g>
       <g fill="${shade(c,.05)}">${ring(13, 42, .8, 196, [10,12], 3)}</g>`;
   }},

  /* --- a bob grown out to the collarbone, waved --- */
  {n:'Wavy Bob',
   back:c=>`<path d="M 146 216 C 122 300, 124 380, 140 434
       Q 169 458 198 436 Q 227 458 256 438 Q 285 458 314 436 Q 343 458 372 434
       C 388 380, 390 300, 366 216 Z" fill="${shade(c,-.06)}"/>`,
   /* The cap, then a waved strand down each side.  Front hair is drawn over the
      body, so these fall in front of the shoulders — which is the only place
      the wave is actually visible; a hem alone sits behind the shirt. */
   front:c=>{
     /* Tapered to a point up under the cap so the lock falls out of the hair
        rather than starting at a flat edge partway down the cheek. */
     const strand = (x, dir) => `<path d="M ${x + dir*12} 190
       Q ${x - dir*17} 296 ${x + dir*5} 342 Q ${x + dir*23} 388 ${x} 432
       L ${x + dir*48} 436
       Q ${x + dir*63} 388 ${x + dir*47} 342 Q ${x + dir*33} 288 ${x + dir*40} 236
       C ${x + dir*34} 212, ${x + dir*26} 194, ${x + dir*12} 190 Z"
       fill="${c}"/>`;
     return `<path d="M 140 302 C 130 168, 190 98, 256 98 C 322 98, 382 168, 372 302
         C 364 220, 344 180, 256 180 C 168 180, 148 220, 140 302 Z" fill="${c}"/>
       ${strand(140, 1)}${strand(372, -1)}
       <path d="M 166 190 C 202 162, 300 158, 344 184 C 300 170, 210 174, 166 190 Z"
         fill="${shade(c,.09)}"/>`;
   }},

  /* --- big ringlets, falling well past the shoulders --- */
  {n:'Big Curls', hl:188,
   back:c=>{
     /* A filled mass so no floor shows through the gaps, then ringlets down
        both edges to break the silhouette.  Everything is laid out from the
        index so the same Mii draws the same way every time. */
     let curls = '';
     for(let i = 0; i < 10; i++){
       const y = 222 + i*32;
       const w = 112 + Math.sin(i*0.62) * 20;          // the mass bells out at the chest
       const r = 27 + ((i*5) % 3) * 6;
       curls += `<circle cx="${(256-w).toFixed(1)}" cy="${y}" r="${r}"/>`
             +  `<circle cx="${(256+w).toFixed(1)}" cy="${y}" r="${r}"/>`
             +  `<circle cx="${(256-w+40).toFixed(1)}" cy="${y+15}" r="${r*0.78}"/>`
             +  `<circle cx="${(256+w-40).toFixed(1)}" cy="${y+15}" r="${r*0.78}"/>`;
     }
     return `<path d="M 152 208 C 116 300, 118 424, 148 502 L 364 502
         C 394 424, 396 300, 360 208 Z" fill="${shade(c,-.09)}"/>
       <g fill="${shade(c,-.04)}">${curls}</g>`;
   },
   /* Front hair draws over the body, so a curl put here falls in front of the
      shoulder where it can be seen; one left in the back panel is behind the
      shirt. */
   front:c=>{
     let crown = '', side = '';
     /* The crown is deliberately the calmest part: shallower ringlets sitting
        closer in, so the volume is there but the top reads round rather than
        knobbly, and the curl proper belongs to the fall. */
     for(let i = 0; i < 11; i++){                      // ringlets around the hairline
       const a = Math.PI*1.04 + i * (Math.PI*0.92/10);
       const r = 116 + ((i*7) % 3) * 4;
       crown += `<circle cx="${(256+Math.cos(a)*r).toFixed(1)}"
         cy="${(230+Math.sin(a)*r*0.86).toFixed(1)}" r="${20 + ((i*5)%3)*3}"/>`;
     }
     for(let i = 0; i < 5; i++){                       // and a fall down each side
       const y = 268 + i*40;
       const x = 150 - Math.sin(i*0.8)*12;
       const r = 26 + ((i*3) % 2) * 5;
       side += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${r}"/>`
            +  `<circle cx="${(512-x).toFixed(1)}" cy="${y}" r="${r}"/>`;
     }
     return `<path d="M 146 268 C 136 168, 190 104, 256 104 C 322 104, 376 168, 366 268
         C 358 214, 336 184, 256 184 C 176 184, 154 214, 146 268 Z" fill="${c}"/>
       <g fill="${c}">${crown}${side}</g>`;
   }}
,

  /* --- long and centre parted, one soft layer breaking across each side --- */
  {n:'Layered', hl:158,
   back:c=>`<path d="M 150 206 C 132 310, 138 434, 156 500 L 356 500
     C 374 434, 380 310, 362 206 Z" fill="${shade(c,-.07)}"/>
     <path d="M 152 202 C 134 306, 138 428, 156 496 L 212 496 C 196 424, 192 304, 198 232 Z
              M 360 202 C 378 306, 374 428, 356 496 L 300 496 C 316 424, 320 304, 314 232 Z" fill="${c}"/>`,
   front:c=>{
     /* Tapered to a point up inside the cap, so the lock falls out of the hair
        instead of starting at a flat edge halfway down the cheek. */
     const side = `<path d="M 170 188 C 154 224, 149 302, 156 378
       C 160 406, 166 420, 172 428 C 180 394, 186 318, 184 250
       C 181 214, 176 196, 170 188 Z" fill="${shade(c,.1)}"/>`;
     const mirror = d => `<g transform="translate(512,0) scale(-1,1)">${d}</g>`;
     return `<path d="M 142 330 C 132 164, 190 98, 256 98 C 322 98, 380 164, 370 330
       C 362 252, 350 210, 326 196 C 302 184, 280 190, 256 190
       C 232 190, 210 184, 186 196 C 162 210, 150 252, 142 330 Z" fill="${c}"/>
       <path d="M 256 100 L 256 190" stroke="${shade(c,-.16)}" stroke-width="5"
         stroke-linecap="round" fill="none"/>` + side + mirror(side);
   }},

  /* --- two long tight plaits either side of a hard centre parting --- */
  {n:'Braids', hl:164,
   mid:c=>{
     const plait = (bx, dir) => {
       /* Both ties overlap the strands they hold, or they read as floating. */
       let s = `<rect x="${bx-19}" y="296" width="38" height="22" rx="9" fill="${shade(c,-.2)}"/>`;
       for(let i=0;i<12;i++){
         const y  = 326 + i*17;
         const rx = 19 - i*0.4;                      // barely tapers: a tight, even plait
         const t  = (i % 2 ? 1 : -1) * dir;
         const cx = bx + t*4;
         s += `<ellipse cx="${cx.toFixed(1)}" cy="${y}" rx="${rx.toFixed(1)}" ry="10.5"
                 transform="rotate(${t*19} ${cx.toFixed(1)} ${y})"
                 fill="${i % 2 ? shade(c,-.13) : c}"/>`;
       }
       return s + `<rect x="${bx-12}" y="516" width="24" height="13" rx="6.5" fill="${shade(c,-.2)}"/>`;
     };
     return plait(150, 1) + plait(362, -1);
   },
   front:c=>`<path d="M 140 320 C 130 160, 190 96, 256 96 C 322 96, 382 160, 372 320
     C 366 250, 354 206, 330 192 C 304 178, 280 186, 256 186
     C 232 186, 208 178, 182 192 C 158 206, 146 250, 140 320 Z" fill="${c}"/>
     <path d="M 256 98 L 256 186" stroke="${shade(c,-.2)}" stroke-width="5.5"
       stroke-linecap="round" fill="none"/>`}
];

/* ============================================================
   FEATURES
   Local space convention for paired parts:  +x = inner (nose side)
   The right-hand copy is drawn with scale(-1,1) so asymmetric
   styles mirror correctly, exactly like the real editor.
   ============================================================ */

/* Full-colour render, or one of the flat picker tiles?  The tiles knock #fff
   back out to nothing, so anything tinted has to give way to white in them. */
const tint = hex => LINE === INK_BASE ? hex : '#fff';

const EYES = [
  {n:'Default', d:c=>`<ellipse rx="21" ry="15.5" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="1" r="9.6" fill="${c}"/><circle cy="1" r="4.6" fill="#221c17"/>
    <circle cx="-4.6" cy="-4.6" r="3.4" fill="#fff" opacity=".92"/>`},

  {n:'Round', d:c=>`<circle r="18" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="1" r="10.5" fill="${c}"/><circle cy="1" r="5" fill="#221c17"/>
    <circle cx="-5" cy="-5" r="3.8" fill="#fff" opacity=".92"/>`},

  {n:'Narrow', d:c=>`<ellipse rx="23" ry="10" fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle r="8.2" fill="${c}"/><circle r="4" fill="#221c17"/>
    <circle cx="-3.6" cy="-3" r="2.6" fill="#fff" opacity=".9"/>`},

  {n:'Tall', d:c=>`<ellipse rx="16" ry="19" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="1" r="10" fill="${c}"/><circle cy="1" r="4.8" fill="#221c17"/>
    <circle cx="-4" cy="-5.5" r="3.4" fill="#fff" opacity=".92"/>`},

  {n:'Sleepy', d:c=>`<ellipse rx="21" ry="15" fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle cy="3" r="9" fill="${c}"/><circle cy="3" r="4.4" fill="#221c17"/>
    <path d="M -22 -16 L 22 -16 L 22 -2 C 8 -6, -8 -6, -22 -2 Z" fill="${LINE}"/>`},

  {n:'Angry', d:c=>`<ellipse rx="21" ry="15" fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle cy="2" r="9" fill="${c}"/><circle cy="2" r="4.4" fill="#221c17"/>
    <path d="M -23 -18 L 23 -18 L 23 7 C 6 -3, -10 -12, -23 -12 Z" fill="${LINE}"/>`},

  {n:'Sad', d:c=>`<ellipse rx="21" ry="15" fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle cy="2" r="9" fill="${c}"/><circle cy="2" r="4.4" fill="#221c17"/>
    <path d="M -23 -18 L 23 -18 L 23 -12 C 10 -12, -6 -3, -23 7 Z" fill="${LINE}"/>`},

  {n:'Happy', d:c=>`<path d="M -21 5 Q 0 -17 21 5" fill="none" stroke="${LINE}"
    stroke-width="5.4" stroke-linecap="round"/>`},

  {n:'Closed', d:c=>`<path d="M -21 0 L 21 0" fill="none" stroke="${LINE}"
    stroke-width="5.4" stroke-linecap="round"/>`},

  {n:'Beady', d:c=>`<circle r="11.5" fill="${LINE}"/><circle cy="-1" r="6.2" fill="${c}"/>
    <circle cx="-3.6" cy="-4" r="2.9" fill="#fff" opacity=".9"/>`},

  {n:'Almond', d:c=>`<path d="M -24 0 C -16 -13, 16 -13, 24 0 C 16 13, -16 13, -24 0 Z"
    fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle r="9" fill="${c}"/><circle r="4.4" fill="#221c17"/>
    <circle cx="-4" cy="-4" r="3" fill="#fff" opacity=".9"/>`},

  {n:'Sharp', d:c=>`<path d="M -25 2 C -18 -14, 14 -16, 24 -3 C 18 12, -14 14, -25 2 Z"
    fill="#fff" stroke="${LINE}" stroke-width="3.2"/>
    <circle cx="-2" cy="-1" r="9.2" fill="${c}"/><circle cx="-2" cy="-1" r="4.4" fill="#221c17"/>
    <circle cx="-6" cy="-5" r="3" fill="#fff" opacity=".9"/>`},

  {n:'Sparkle', d:c=>`<ellipse rx="20" ry="17" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="1" r="11" fill="${c}"/><circle cy="1" r="5" fill="#221c17"/>
    <circle cx="-5" cy="-5.5" r="4.2" fill="#fff"/><circle cx="5" cy="6" r="2.4" fill="#fff" opacity=".85"/>`},

  {n:'Lashes', d:c=>`<ellipse rx="21" ry="15.5" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="1" r="9.6" fill="${c}"/><circle cy="1" r="4.6" fill="#221c17"/>
    <circle cx="-4.6" cy="-4.6" r="3.2" fill="#fff" opacity=".92"/>
    <path d="M -21 -10 L -30 -18 M -14 -14 L -19 -24 M -5 -16 L -7 -26"
      stroke="${LINE}" stroke-width="3.4" stroke-linecap="round" fill="none"/>`},

  /* --- a closed upper arch over a bare dot: no sclera at all --- */
  {n:'Arch', d:c=>`<path d="M -19 -3 Q 0 -23 19 -3" fill="none" stroke="${LINE}"
    stroke-width="5" stroke-linecap="round"/>
    <circle cy="10" r="6" fill="${LINE}"/><circle cy="10" r="3.1" fill="${c}"/>`},

  /* --- brimming with tears, one about to run down the outer cheek --- */
  {n:'Teary', d:c=>`<ellipse rx="20" ry="18.5" fill="#fff" stroke="${LINE}" stroke-width="3.4"/>
    <circle cy="2" r="13.5" fill="${c}"/><circle cy="2" r="6.6" fill="#221c17"/>
    <path d="M -13 2 C -8 11, 8 11, 13 2 C 12 13, -12 13, -13 2 Z" fill="${tint('#bfe6f7')}" opacity=".92"/>
    <ellipse cx="-6.5" cy="-7" rx="6" ry="5" fill="#fff"/>
    <circle cx="6.5" cy="7.5" r="3.2" fill="#fff" opacity=".9"/>
    <path d="M -13 21 L -7.5 32 A 5.5 5.5 0 1 1 -18.5 32 Z"
      fill="${tint('#a5dcf3')}" stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round"/>`}
];

const BROWS = [
  {n:'Straight',  d:c=>`<rect x="-26" y="-5.5" width="52" height="11.5" rx="5.8" fill="${c}"/>`},
  {n:'Thin',      d:c=>`<rect x="-28" y="-3.5" width="56" height="7.5" rx="3.8" fill="${c}"/>`},
  {n:'Bushy',     d:c=>`<path d="M -29 -9 Q 0 -15 29 -8 L 29 8 Q 14 3, 0 8 Q -14 13, -29 9 Z" fill="${c}"/>`},
  {n:'Angry',     d:c=>`<path d="M -29 -8 L 29 3 L 29 15 L -29 5 Z" fill="${c}"/>`},
  {n:'Worried',   d:c=>`<path d="M -29 4 L 29 -8 L 29 3 L -29 15 Z" fill="${c}"/>`},
  {n:'Arched',    d:c=>`<path d="M -28 8 Q 0 -15 28 7 L 28 16 Q 0 -4, -28 17 Z" fill="${c}"/>`},
  {n:'High Arch', d:c=>`<path d="M -27 10 Q 0 -14 27 9 L 27 15 Q 0 -6, -27 16 Z" fill="${c}"/>`},
  {n:'Tapered',   d:c=>`<path d="M -30 2 Q -6 -10 27 -5 L 29 5 Q -4 0, -30 10 Z" fill="${c}"/>`},
  {n:'Short',     d:c=>`<rect x="-19" y="-6" width="38" height="12.5" rx="6" fill="${c}"/>`},
  {n:'Blob',      d:c=>`<ellipse rx="20" ry="9" fill="${c}"/>`},
  {n:'Sharp',     d:c=>`<path d="M -30 6 L 22 -9 L 29 -2 L -28 14 Z" fill="${c}"/>`},
  {n:'Wavy',      d:c=>`<path d="M -29 0 Q -15 -12 0 -3 Q 15 6 29 -5 L 29 6 Q 15 16 0 8 Q -15 0 -29 11 Z" fill="${c}"/>`}
];

const NOSES = [
  {n:'Rounded',  d:w=>`<path d="M -13 10 C -13 0, -5 -10, 0 -16 C 5 -10, 13 0, 13 10
    C 13 17, 6 19, 0 19 C -6 19, -13 17, -13 10 Z" fill="none" stroke="${LINE}"
    stroke-width="${w}" stroke-linejoin="round"/>`},
  {n:'Arc',      d:w=>`<path d="M -16 -2 C -14 10, 14 10, 16 -2" fill="none" stroke="${LINE}"
    stroke-width="${w*1.1}" stroke-linecap="round"/>`},
  {n:'Upturned', d:w=>`<path d="M -14 12 C -14 2, -6 -8, 0 -12 C 6 -8, 14 2, 14 12"
    fill="none" stroke="${LINE}" stroke-width="${w}" stroke-linecap="round"/>
    <ellipse cx="-7" cy="13" rx="4" ry="3" fill="${LINE}"/><ellipse cx="7" cy="13" rx="4" ry="3" fill="${LINE}"/>`},
  {n:'Hook',     d:w=>`<path d="M -10 14 C -12 0, -6 -14, 2 -20 C 10 -12, 13 2, 12 12
    C 11 19, 4 21, -1 20 C -6 19, -9 18, -10 14 Z" fill="none" stroke="${LINE}"
    stroke-width="${w}" stroke-linejoin="round"/>`},
  {n:'Nostrils', d:w=>`<ellipse cx="-8" cy="6" rx="4.6" ry="3.6" fill="${LINE}"/>
    <ellipse cx="8" cy="6" rx="4.6" ry="3.6" fill="${LINE}"/>`},
  {n:'Triangle', d:w=>`<path d="M 0 -14 L 14 14 L -14 14 Z" fill="none" stroke="${LINE}"
    stroke-width="${w}" stroke-linejoin="round"/>`}
];

const MOUTHS = [
  {n:'Smile',   d:c=>`<path d="M -27 -5 Q 0 17 27 -5" fill="none" stroke="${LINE}"
    stroke-width="5.2" stroke-linecap="round"/>`},
  {n:'Neutral', d:c=>`<path d="M -24 0 L 24 0" fill="none" stroke="${LINE}"
    stroke-width="5.2" stroke-linecap="round"/>`},
  {n:'Frown',   d:c=>`<path d="M -25 6 Q 0 -14 25 6" fill="none" stroke="${LINE}"
    stroke-width="5.2" stroke-linecap="round"/>`},
  {n:'Grin',    d:c=>`<path d="M -31 -7 L 31 -7 Q 27 20 0 22 Q -27 20 -31 -7 Z" fill="${LINE}"/>
    <path d="M -27 -4 L 27 -4 L 25 5 L -25 5 Z" fill="#fff"/>`},
  {n:'Small O',  d:c=>`<ellipse rx="10" ry="12" fill="${LINE}"/><ellipse rx="6" ry="7.5" cy="2" fill="${c}"/>`},
  {n:'Smirk',   d:c=>`<path d="M -24 2 Q 2 12 26 -8" fill="none" stroke="${LINE}"
    stroke-width="5.2" stroke-linecap="round"/>`},
  {n:'Wavy',    d:c=>`<path d="M -26 2 Q -13 -10 0 2 Q 13 14 26 2" fill="none" stroke="${LINE}"
    stroke-width="5" stroke-linecap="round"/>`},
  {n:'Laugh',   d:c=>`<path d="M -26 -12 Q 0 -20 26 -12 Q 30 24, 0 26 Q -30 24, -26 -12 Z" fill="${LINE}"/>
    <path d="M -21 -10 Q 0 -16 21 -10 L 19 -3 Q 0 0 -19 -3 Z" fill="#fff"/>
    <path d="M -14 13 Q 0 26 14 13 Q 0 7 -14 13 Z" fill="${c}"/>`},
  {n:'Lips',    d:c=>`<path d="M -25 -1 Q -14 -12 -6 -4 Q 0 -9 6 -4 Q 14 -12 25 -1
    Q 12 15 0 15 Q -12 15 -25 -1 Z" fill="${c}" stroke="${LINE}" stroke-width="2.4"/>
    <path d="M -25 -1 Q 0 6 25 -1" fill="none" stroke="${LINE}" stroke-width="2" opacity=".55"/>`},
  {n:'Pout',    d:c=>`<path d="M -14 -4 Q 0 -12 14 -4 Q 18 10 0 13 Q -18 10 -14 -4 Z"
    fill="${c}" stroke="${LINE}" stroke-width="2.6"/>`},
  {n:'Cat',     d:c=>`<path d="M -24 -4 Q -12 10 0 -2 Q 12 10 24 -4" fill="none" stroke="${LINE}"
    stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`},
  {n:'Teeth',   d:c=>`<path d="M -26 -8 L 26 -8 Q 28 16, 0 18 Q -28 16, -26 -8 Z" fill="${LINE}"/>
    <rect x="-22" y="-6" width="44" height="10" fill="#fff"/>
    <path d="M -8 -6 L -8 4 M 8 -6 L 8 4" stroke="${LINE}" stroke-width="1.6"/>`},
  {n:'Tongue',  d:c=>`<path d="M -24 -6 Q 0 -12 24 -6 Q 26 12, 0 14 Q -26 12, -24 -6 Z" fill="${LINE}"/>
    <path d="M -13 6 Q 0 30 13 6 Q 0 0 -13 6 Z" fill="${c}"/>`}
];

const MUSTACHES = [
  {n:'None',      d:c=>``},
  {n:'Pencil',    d:c=>`<path d="M -28 -2 Q 0 -12 28 -2 Q 0 5 -28 -2 Z" fill="${c}"/>`},
  {n:'Chevron',   d:c=>`<path d="M 0 -8 Q 20 -7 33 6 Q 17 4 0 11 Q -17 4 -33 6 Q -20 -7 0 -8 Z" fill="${c}"/>`},
  {n:'Handlebar', d:c=>`<path d="M 0 -5 Q 17 -9 29 -5 Q 43 0 41 12 Q 37 2 27 3 Q 13 4 0 11
    Q -13 4 -27 3 Q -37 2 -41 12 Q -43 0 -29 -5 Q -17 -9 0 -5 Z" fill="${c}"/>`},
  {n:'Walrus',    d:c=>`<path d="M -35 -5 Q 0 -14 35 -5 Q 35 19 17 24 Q 0 11 -17 24 Q -35 19 -35 -5 Z" fill="${c}"/>`},
  {n:'Toothbrush',d:c=>`<rect x="-13" y="-6" width="26" height="17" rx="4.5" fill="${c}"/>`},
  {n:'Horseshoe', d:c=>`<path d="M -33 -10 Q 0 -17 33 -10 L 33 4 Q 0 0 -33 4 Z" fill="${c}"/>
    <path d="M -34 0 L -23 1 Q -21 19 -24 35 L -35 34 Q -36 17 -34 0 Z" fill="${c}"/>
    <path d="M 34 0 L 23 1 Q 21 19 24 35 L 35 34 Q 36 17 34 0 Z" fill="${c}"/>`},
  {n:'Curled',    d:c=>`<path d="M 0 -4 Q 16 -9 27 -4 Q 40 3 33 13 Q 36 4 26 4 Q 12 5 0 11
    Q -12 5 -26 4 Q -36 4 -33 13 Q -40 3 -27 -4 Q -16 -9 0 -4 Z" fill="${c}"/>`},
  {n:'Brush',     d:c=>`<path d="M -24 -6 Q 0 -12 24 -6 Q 26 10 0 13 Q -26 10 -24 -6 Z" fill="${c}"/>`}
];

/* Beards are drawn INSIDE a clip-path of the live face outline, so they
   follow whatever jaw shape is selected.  `clip` = inside the face,
   `free` = allowed to hang past the chin. */
const BEARDS = [
  {n:'None'},

  {n:'Stubble', clip:(c,g,s)=>`<path d="M 104 ${g.chY+90} L 104 ${g.cY+34}
    Q ${CX} ${g.cY+140} 408 ${g.cY+34} L 408 ${g.chY+90} Z" fill="${c}" opacity=".3"/>`},

  {n:'Soul Patch', clip:(c,g,s)=>`<ellipse cx="${CX}" cy="${g.mouthY+24}" rx="10" ry="13" fill="${c}"/>`},

  {n:'Goatee', clip:(c,g,s)=>`<path d="M ${CX-34} ${g.mouthY-26} Q ${CX} ${g.mouthY-12} ${CX+34} ${g.mouthY-26}
    Q ${CX+40} ${g.chY+16} ${CX} ${g.chY+22} Q ${CX-40} ${g.chY+16} ${CX-34} ${g.mouthY-26} Z" fill="${c}"/>
    <ellipse cx="${g.mouthX}" cy="${g.mouthY}" rx="30" ry="17" fill="${s}"/>`},

  {n:'Anchor', clip:(c,g,s)=>`<path d="M ${CX-25} ${g.mouthY+8} Q ${CX} ${g.mouthY+20} ${CX+25} ${g.mouthY+8}
    Q ${CX+29} ${g.chY+14} ${CX} ${g.chY+20} Q ${CX-29} ${g.chY+14} ${CX-25} ${g.mouthY+8} Z" fill="${c}"/>
    <path d="M ${CX-33} ${g.mouthY-24} Q ${CX} ${g.mouthY-11} ${CX+33} ${g.mouthY-24}
    Q ${CX} ${g.mouthY-3} ${CX-33} ${g.mouthY-24} Z" fill="${c}"/>`},

  {n:'Chin Strap', clip:(c,g,s)=>`<path d="M 104 ${g.chY+90} L 104 ${g.earY-18}
    Q ${CX} ${g.cY+150} 408 ${g.earY-18} L 408 ${g.chY+90} Z" fill="${c}"/>
    <path d="${g.fp}" fill="${s}" transform="translate(${CX},${(g.tY+g.chY)/2}) scale(.845)
      translate(${-CX},${-(g.tY+g.chY)/2})"/>`},

  {n:'Full', clip:(c,g,s)=>`<path d="M 104 ${g.chY+90} L 104 ${g.cY+34}
    Q ${CX} ${g.cY+140} 408 ${g.cY+34} L 408 ${g.chY+90} Z" fill="${c}"/>
    <ellipse cx="${g.mouthX}" cy="${g.mouthY}" rx="34" ry="19" fill="${s}"/>`},

  {n:'Long',
   clip:(c,g,s)=>`<path d="M 104 ${g.chY+90} L 104 ${g.cY+34}
    Q ${CX} ${g.cY+140} 408 ${g.cY+34} L 408 ${g.chY+90} Z" fill="${c}"/>
    <ellipse cx="${g.mouthX}" cy="${g.mouthY}" rx="34" ry="19" fill="${s}"/>`,
   free:(c,g,s)=>`<path d="M ${CX-g.jW*0.9} ${g.chY-54} Q ${CX} ${g.chY+6} ${CX+g.jW*0.9} ${g.chY-54}
    Q ${CX+g.jW*0.66} ${g.chY+116} ${CX} ${g.chY+146} Q ${CX-g.jW*0.66} ${g.chY+116} ${CX-g.jW*0.9} ${g.chY-54} Z" fill="${c}"/>`},

  {n:'Mutton', clip:(c,g,s)=>`<path d="M 100 ${g.earY-46} L 198 ${g.earY-46}
    Q 184 ${g.jY+14} 122 ${g.jY+26} Z" fill="${c}"/>
    <path d="M 412 ${g.earY-46} L 314 ${g.earY-46} Q 328 ${g.jY+14} 390 ${g.jY+26} Z" fill="${c}"/>`},

  {n:'Sideburns', clip:(c,g,s)=>`<rect x="100" y="${g.earY-52}" width="66" height="${g.jY-g.earY+96}" fill="${c}"/>
    <rect x="346" y="${g.earY-52}" width="66" height="${g.jY-g.earY+96}" fill="${c}"/>`},

  /* Speckled stubble. The jitter is a fixed hash of the grid position, not
     Math.random, so the pattern is stable across re-renders. */
  {n:'Stubble Dots', clip:(c,g,s)=>{
    const COLS = 19, ROWS = 14;
    let d = '';
    for(let r = 0; r < ROWS; r++){
      for(let q = 0; q < COLS; q++){
        const jx = ((r*7 + q*13) % 5) - 2, jy = ((r*11 + q*5) % 5) - 2;
        const x  = 124 + q*15 + (r % 2 ? 7.5 : 0) + jx;
        const y  = g.cY + 8 + r*13 + jy;
        /* Top edge traces a real beard line: high at the sideburn, sweeping down
           across the cheek, then flat along the upper lip. */
        const t    = Math.min(1, Math.max(0, (Math.abs(x - CX) - 34) / 66));
        const yTop = (g.noseY + 18) - Math.pow(t, 1.6) * ((g.noseY + 18) - (g.cY + 16));
        if(y < yTop) continue;
        const lx = (x - g.mouthX) / 31, ly = (y - g.mouthY) / 14;
        if(lx*lx + ly*ly < 1) continue;                    // lips stay bare
        const rr = 1.8 + ((r*3 + q*7) % 3) * 0.4;
        d += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}"/>`;
      }
    }
    return `<g fill="${c}" opacity=".8">${d}</g>`;
  }}
];

/* Hats sit above the hair, scaled to the skull the same way the hair is.
   d(c, a): c = main colour, a = accent (band, brim, shading). */
const HATS = [
  {n:'None'},

  {n:'Headband', d:(c,a)=>`<path d="M 142 206 C 146 174, 194 152, 256 152 C 318 152, 366 174, 370 206
    L 370 232 C 366 200, 318 178, 256 178 C 194 178, 146 200, 142 232 Z" fill="${c}"/>
    <path d="M 238 154 L 274 154 L 274 180 L 238 180 Z" fill="${a}"/>`},

  {n:'Top Hat', d:(c,a)=>`<path d="M 188 134 L 188 40 C 188 30, 200 24, 256 24
    C 312 24, 324 30, 324 40 L 324 134 Z" fill="${c}"/>
    <rect x="188" y="104" width="136" height="24" fill="${a}"/>
    <ellipse cx="256" cy="136" rx="120" ry="21" fill="${c}"/>
    <ellipse cx="256" cy="132" rx="120" ry="21" fill="${a}" opacity=".35"/>`},

  {n:'Cap Forward', d:(c,a)=>`<path d="M 154 176 C 154 110, 198 80, 256 80 C 314 80, 358 110, 358 176 Z" fill="${c}"/>
    <circle cx="256" cy="86" r="8" fill="${a}"/>
    <path d="M 148 172 C 152 202, 202 216, 256 216 C 310 216, 360 202, 364 172
    C 348 186, 308 194, 256 194 C 204 194, 164 186, 148 172 Z" fill="${a}"/>`},

  {n:'Cap Back', d:(c,a)=>`<path d="M 154 178 C 154 112, 198 82, 256 82 C 314 82, 358 112, 358 178 Z" fill="${c}"/>
    <path d="M 156 178 C 156 164, 158 152, 162 144 L 350 144 C 354 152, 356 164, 356 178 Z" fill="${a}"/>
    <rect x="234" y="144" width="44" height="36" rx="5" fill="${c}"/>
    <circle cx="256" cy="88" r="8" fill="${a}"/>`},

  {n:'Beanie', d:(c,a)=>`<path d="M 150 192 C 150 118, 196 90, 256 90 C 316 90, 362 118, 362 192 Z" fill="${c}"/>
    <rect x="144" y="176" width="224" height="32" rx="15" fill="${a}"/>
    <circle cx="256" cy="80" r="18" fill="${a}"/>`},

  {n:'Headphones', d:(c,a)=>`<path d="M 148 258 C 144 158, 196 116, 256 116 C 316 116, 368 158, 364 258"
    fill="none" stroke="${c}" stroke-width="20" stroke-linecap="round"/>
    <rect x="118" y="232" width="50" height="76" rx="22" fill="${a}"/>
    <rect x="344" y="232" width="50" height="76" rx="22" fill="${a}"/>
    <rect x="130" y="246" width="26" height="48" rx="12" fill="${c}" opacity=".55"/>
    <rect x="356" y="246" width="26" height="48" rx="12" fill="${c}" opacity=".55"/>`},

  {n:'Shades Up', d:(c,a)=>`<path d="M 148 172 C 172 134, 340 134, 364 172" fill="none"
    stroke="${a}" stroke-width="12" stroke-linecap="round"/>
    <path d="M 150 164 C 172 140, 244 134, 252 158 C 258 182, 226 200, 190 197
    C 158 194, 147 180, 150 164 Z" fill="${c}"/>
    <path d="M 362 164 C 340 140, 268 134, 260 158 C 254 182, 286 200, 322 197
    C 354 194, 365 180, 362 164 Z" fill="${c}"/>
    <path d="M 252 155 L 260 155" stroke="${a}" stroke-width="9" stroke-linecap="round"/>`}
];

const JEWELC = ['#e0b23c'];          // gold, plus the wheel for anything else

/* Jewellery is additive: each piece is its own toggle, so combinations do not
   have to be enumerated. Ear pieces are drawn in the ear's own space
   (+x = outward, +y = down the lobe); neck pieces sit on the chest. */
const JEWEL_KEYS = ['cartL','cartR','studL','studR','dropL','dropR','necklace','choker'];
const JEWEL_EAR = {
  cart: c=>`<circle cx="11" cy="-9" r="4.8" fill="none" stroke="${c}" stroke-width="2.6"/>`,
  stud: c=>`<circle cx="1" cy="18" r="3.6" fill="${c}"/>`,
  drop: c=>`<circle cx="1" cy="17" r="3" fill="${c}"/>
            <path d="M 1 19 L 1 27" stroke="${c}" stroke-width="2.2"/>
            <ellipse cx="1" cy="33" rx="5" ry="7" fill="${c}"/>`
};

const GLASSES = [
  {n:'None',  d:c=>``},
  {n:'Round', d:c=>`<circle cx="-38" cy="0" r="25" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <circle cx="38" cy="0" r="25" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <path d="M -13 0 L 13 0 M -63 -4 L -86 -12 M 63 -4 L 86 -12" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`},
  {n:'Square',d:c=>`<rect x="-64" y="-24" width="52" height="48" rx="7" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <rect x="12" y="-24" width="52" height="48" rx="7" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <path d="M -12 -4 L 12 -4 M -64 -12 L -86 -18 M 64 -12 L 86 -18" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`},
  {n:'Rect',  d:c=>`<rect x="-66" y="-17" width="56" height="34" rx="5" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.6"/>
    <rect x="10" y="-17" width="56" height="34" rx="5" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.6"/>
    <path d="M -10 -6 L 10 -6 M -66 -8 L -88 -14 M 66 -8 L 88 -14" stroke="${c}" stroke-width="4.6" stroke-linecap="round"/>`},
  {n:'Shades',d:c=>`<path d="M -70 -20 L -10 -20 Q -6 -20 -6 -14 Q -6 18 -34 20 Q -66 22 -70 -6 Z" fill="${c}"/>
    <path d="M 70 -20 L 10 -20 Q 6 -20 6 -14 Q 6 18 34 20 Q 66 22 70 -6 Z" fill="${c}"/>
    <path d="M -6 -16 L 6 -16 M -70 -16 L -90 -22 M 70 -16 L 90 -22" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`},
  {n:'Half',  d:c=>`<path d="M -66 -14 L -10 -14 M 10 -14 L 66 -14" stroke="${c}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M -66 -14 Q -64 20 -38 21 Q -12 20 -10 -14 M 66 -14 Q 64 20 38 21 Q 12 20 10 -14"
      fill="#fff" fill-opacity=".18" stroke="${c}" stroke-width="2.4"/>
    <path d="M -10 -14 L 10 -14 M -66 -14 L -88 -20 M 66 -14 L 88 -20" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/>`},
  {n:'Oval',  d:c=>`<ellipse cx="-38" cy="0" rx="29" ry="21" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <ellipse cx="38" cy="0" rx="29" ry="21" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <path d="M -9 0 L 9 0 M -67 -6 L -88 -13 M 67 -6 L 88 -13" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`},
  {n:'Thick', d:c=>`<rect x="-68" y="-25" width="58" height="50" rx="10" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="9"/>
    <rect x="10" y="-25" width="58" height="50" rx="10" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="9"/>
    <path d="M -10 -8 L 10 -8" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
    <path d="M -68 -14 L -90 -20 M 68 -14 L 90 -20" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`},
  {n:'Aviator',d:c=>`<path d="M -68 -16 Q -66 22 -38 23 Q -10 22 -10 -8 Q -10 -16 -20 -16 Z"
      fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.6"/>
    <path d="M 68 -16 Q 66 22 38 23 Q 10 22 10 -8 Q 10 -16 20 -16 Z"
      fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.6"/>
    <path d="M -10 -12 Q 0 -18 10 -12 M -68 -16 L -90 -22 M 68 -16 L 90 -22"
      fill="none" stroke="${c}" stroke-width="4.6" stroke-linecap="round"/>`},
  {n:'Star',  d:c=>`<path d="M -38 -26 L -31 -9 L -13 -8 L -27 3 L -22 21 L -38 11 L -54 21 L -49 3
      L -63 -8 L -45 -9 Z" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.4" stroke-linejoin="round"/>
    <path d="M 38 -26 L 45 -9 L 63 -8 L 49 3 L 54 21 L 38 11 L 22 21 L 27 3
      L 13 -8 L 31 -9 Z" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="4.4" stroke-linejoin="round"/>`},
  {n:'Visor', d:c=>`<path d="M -78 -14 Q 0 -26 78 -14 Q 76 20 0 22 Q -76 20 -78 -14 Z"
      fill="${c}" fill-opacity=".85" stroke="${c}" stroke-width="4"/>
    <path d="M -70 -10 Q 0 -20 70 -10" fill="none" stroke="#fff" stroke-width="4" opacity=".35"/>`},
  {n:'Monocle',d:c=>`<circle cx="38" cy="0" r="27" fill="#fff" fill-opacity=".2" stroke="${c}" stroke-width="5"/>
    <path d="M 38 27 Q 34 56 12 66" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`}
];

/* ============================================================
   BODY PROPORTIONS  —  one source of truth so svgMii() and the
   stage viewBox always agree on where the feet end up.
   ============================================================ */
function bodyGeom(m){
  const bw = m.body.build, bh = m.body.height;
  const shoulderY = 392;                    // head sits straight on the body, almost no neck
  const waistY    = shoulderY + 172*bh;
  const hipY      = waistY + 12*bh;
  const legBotY   = hipY + 116*bh;
  return {
    bw, bh, shoulderY, waistY, hipY, legBotY,
    shoulderHalf: 74*bw,                    // ~69% of head width, as in the reference
    waistHalf:    68*bw,
    hipHalf:      64*bw,                    // narrower than the shirt waist, so it hides behind it
    armW:         17*bw,
    handR:        22*bw,
    legW:         26*bw,
    legTopX:      38*bw,                    // legs emerge at the full width of the hips
    legBotX:      44*bw,
    footR:        29*bw,
    bottom: legBotY + 29*bw + 30
  };
}

/* ============================================================
   STATE
   ============================================================ */
/* The starter Mii: long black hair with a blunt fringe, cream top, and the
   rust trousers the Favorite colour was sampled from. */
/* What the studio opens on: a plain Mii with nothing picked out yet, so a first
   visit starts on a blank slate rather than on somebody else's face. */
const DEFAULT = () => ({
  name:'', favorite:false, mingle:true,
  birthday:{m:1, d:1}, skin:2,
  face   :{shape:0, size:1, width:1, jaw:1},
  hair   :{style:0, color:0, y:0, size:1, flip:false},
  brows  :{style:0, color:0, y:0, spacing:1, size:1, rot:0},
  eyes   :{style:0, color:0, y:0, spacing:1, size:1, stretch:1, rot:0},
  nose   :{style:0, x:0, y:0, size:1, width:1},
  mouth  :{style:0, color:0, x:0, y:0, size:1, stretch:1},
  beard  :{must:0, style:0, color:0, size:1, y:0},
  glasses:{style:0, color:0, y:0, size:1},
  hat    :{style:0, color:11},
  jewel  :{color:0, cartL:false, cartR:false, studL:false, studR:false,
           dropL:false, dropR:false, necklace:false, choker:false},
  mole   :{on:false, color:0, x:0, y:0, size:1},
  body   :{color:10, pants:3, shoes:0, dress:false, build:1, height:1}
});

/* Celine, who used to be that opening face.  She is still needed: the Plaza
   falls back to her when plaza.json cannot be read, so it is never empty. */
const CELINE = () => ({
  name:'Celine', favorite:true, mingle:true,
  birthday:{m:10, d:15}, skin:2,
  face   :{shape:0, size:1, width:1.02, jaw:1},
  hair   :{style:19, color:0, y:0, size:1, flip:false},
  brows  :{style:7, color:0, y:4.5, spacing:1, size:.9, rot:0},
  eyes   :{style:0, color:1, y:0, spacing:1, size:1.02, stretch:1, rot:0},
  nose   :{style:0, x:0, y:2, size:.88, width:.95},
  mouth  :{style:3, color:0, x:0, y:3, size:.95, stretch:1.05},
  beard  :{must:0, style:0, color:0, size:1, y:0},
  glasses:{style:0, color:0, y:0, size:1},
  hat    :{style:0, color:11},
  jewel  :{color:0, cartL:true, cartR:false, studL:false, studR:false,
           dropL:true, dropR:true, necklace:false, choker:false},
  mole   :{on:true, color:1, x:-85, y:15, size:.69},   // a dimple, left cheek
  body   :{color:10, pants:3, shoes:0, dress:false, build:.95, height:1}
});

const get=(o,p)=>p.split('.').reduce((a,k)=>a[k],o);
const set=(o,p,v)=>{const k=p.split('.');const l=k.pop();k.reduce((a,x)=>a[x],o)[l]=v;};
let uidN = 0;

/* ============================================================
   RENDER
   ============================================================ */
function svgMii(m, mono, focus){
  const uid = 'u'+(uidN++);
  const g   = faceGeom(m);
  const inv = mono === 2;                       // white line art, for a selected tile
  const INV_INK = '#fffffe';        // reads as white; dodges the knockout pass at the end
  LINE = mono ? (inv ? INV_INK : '#33383c') : INK_BASE;
  const INK = inv ? INV_INK : '#33383c';
  const skin= mono ? (inv ? 'none' : '#ffffff') : pick(SKINS, m.skin);
  const hc  = mono ? INK : pick(HAIRC, m.hair.color);
  const bwc = mono ? INK : pick(HAIRC, m.brows.color);
  const fhc = mono ? INK : pick(HAIRC, m.beard.color);
  const ec  = mono ? (inv ? 'none' : '#3d4247') : pick(EYEC, m.eyes.color);
  const mc  = mono ? (inv ? 'none' : '#ffffff') : pick(MOUTHC, m.mouth.color);
  const gc  = mono ? INK : pick(GLASSC, m.glasses.color);
  const sc  = mono ? (inv ? 'none' : '#ffffff') : pick(SHIRTC, m.body.color);
  const fp = facePath(g);
  const hair=HAIRS[m.hair.style], beard=BEARDS[m.beard.style], must=MUSTACHES[m.beard.must];

  const eyeY=262+m.eyes.y,  eyeSp=36+m.eyes.spacing;
  const browY=220+m.brows.y, browSp=40+m.brows.spacing;
  const noseY=302+m.nose.y,  noseX =CX+m.nose.x;
  const mouthY=344+m.mouth.y, mouthX=CX+m.mouth.x;
  const mustY=mouthY-21+m.beard.y;

  /* mirrored pair helper — local +x always points toward the nose */
  const pair=(inner,y,sp,sx,sy,rot)=>
    `<g transform="translate(${CX-sp},${y}) scale(${sx},${sy}) rotate(${rot})">${inner}</g>`+
    `<g transform="translate(${CX+sp},${y}) scale(${-sx},${sy}) rotate(${rot})">${inner}</g>`;

  /* ---- body: shaded torso + limbs, spherical hands / feet ---- */
  const b  = bodyGeom(m);
  const pc = mono ? (inv ? 'none' : '#ffffff') : (m.favorite ? FAV_PANTS : pick(PANTSC, m.body.pants));
  const J  = m.jewel;
  const jc = mono ? LINE : pick(JEWELC, J.color);
  const shc = mono ? (inv ? 'none' : '#ffffff') : pick(SHOEC, m.body.shoes);
  const g3 = mono ? 'none' : `url(#b3${uid})`;
  const edge = mono ? `stroke="${LINE}" stroke-width="4"` : 'stroke="rgba(0,0,0,.07)" stroke-width="2"';                       // single light source across the whole body

  const sph = (cx,cy,r,fill) => mono
    ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${LINE}" stroke-width="4"/>`
    : `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="${fill}"/>
       <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r}" fill="url(#sp${uid})"/>`;
  const tube = (d,w,fill) => fill === 'none' ? '' :
    (mono ? `<path d="${d}" stroke="${LINE}" stroke-width="${w*2+4}" stroke-linecap="round" fill="none"/>` : '')
    + `<path d="${d}" stroke="${fill}" stroke-width="${w*2}" stroke-linecap="round" fill="none"/>`;

  const armTopX = b.shoulderHalf*0.84, armTopY = b.shoulderY + 26;
  const handX   = b.shoulderHalf + 50*b.bw, handY = b.waistY + 4;   // ~22 degrees from vertical
  const armL = `M ${CX-armTopX} ${armTopY} L ${CX-handX} ${handY}`;
  const armR = `M ${CX+armTopX} ${armTopY} L ${CX+handX} ${handY}`;
  const legL = `M ${CX-b.legTopX} ${b.hipY-16} L ${CX-b.legBotX} ${b.legBotY}`;
  const legR = `M ${CX+b.legTopX} ${b.hipY-16} L ${CX+b.legBotX} ${b.legBotY}`;

  const hipsD =
    `M ${CX-b.waistHalf} ${b.waistY-12} L ${CX+b.waistHalf} ${b.waistY-12}
     Q ${CX+b.hipHalf} ${b.waistY+4}, ${CX+b.hipHalf-5} ${b.hipY+12}
     L ${CX-b.hipHalf+5} ${b.hipY+12}
     Q ${CX-b.hipHalf} ${b.waistY+4}, ${CX-b.waistHalf} ${b.waistY-12} Z`;
  const dressD =
    `M ${CX-b.shoulderHalf} ${b.shoulderY+30}
     Q ${CX-b.shoulderHalf} ${b.shoulderY-1}, ${CX-b.shoulderHalf+24} ${b.shoulderY-4}
     L ${CX+b.shoulderHalf-24} ${b.shoulderY-4}
     Q ${CX+b.shoulderHalf} ${b.shoulderY-1}, ${CX+b.shoulderHalf} ${b.shoulderY+30}
     C ${CX+b.shoulderHalf+4} ${b.waistY-6}, ${CX+b.hipHalf+30} ${b.hipY+6}, ${CX+b.hipHalf+38} ${b.hipY+30}
     Q ${CX} ${b.hipY+50}, ${CX-b.hipHalf-38} ${b.hipY+30}
     C ${CX-b.hipHalf-30} ${b.hipY+6}, ${CX-b.shoulderHalf-4} ${b.waistY-6}, ${CX-b.shoulderHalf} ${b.shoulderY+30} Z`;
  const shirtD =
    `M ${CX-b.shoulderHalf} ${b.shoulderY+30}
     Q ${CX-b.shoulderHalf} ${b.shoulderY-1}, ${CX-b.shoulderHalf+24} ${b.shoulderY-4}
     L ${CX+b.shoulderHalf-24} ${b.shoulderY-4}
     Q ${CX+b.shoulderHalf} ${b.shoulderY-1}, ${CX+b.shoulderHalf} ${b.shoulderY+30}
     L ${CX+b.waistHalf} ${b.waistY+6} L ${CX-b.waistHalf} ${b.waistY+6} Z`;

  const groundShadow = mono ? ''
    : `<ellipse cx="${CX}" cy="${b.legBotY + b.footR*1.30}" rx="${b.legBotX + b.footR*1.45}"
         ry="${b.footR*0.42}" fill="rgba(28,44,50,.20)" filter="url(#gs${uid})"/>`;

  /* Each limb is its own group, pivoted at the shoulder or the hip, so the
     plaza can swing it by writing one transform instead of re-rendering.
     Hands and feet ride inside the group; neither ever overlaps the torso,
     so drawing them with the limb rather than on top of it changes nothing. */
  const n2 = v => (Math.round(v*100)/100);
  const limb = (cls, px, py, inner) =>
    `<g class="${cls}" data-pivot="${n2(px)} ${n2(py)}" transform="rotate(0 ${n2(px)} ${n2(py)})">${inner}</g>`;
  const armPiece = (d, hx, hy) => tube(d,b.armW,sc) + tube(d,b.armW,g3) + sph(hx,hy,b.handR,sc);
  const legPiece = (d, fx, fy) => tube(d,b.legW,pc) + tube(d,b.legW,g3) + sph(fx,fy,b.footR,shc);

  const footY = b.legBotY + b.footR*0.46;
  const body =
      limb('mii-limb mii-armL', CX-armTopX, armTopY, armPiece(armL, CX-handX, handY))
    + limb('mii-limb mii-armR', CX+armTopX, armTopY, armPiece(armR, CX+handX, handY))
    + limb('mii-limb mii-legL', CX-b.legTopX, b.hipY-16, legPiece(legL, CX-b.legBotX, footY))
    + limb('mii-limb mii-legR', CX+b.legTopX, b.hipY-16, legPiece(legR, CX+b.legBotX, footY))
    + (m.body.dress ? '' : `<path d="${hipsD}" fill="${pc}" ${edge}/><path d="${hipsD}" fill="${g3}"/>`)
    + `<path d="${m.body.dress ? dressD : shirtD}" fill="${sc}" ${edge}/>`
    + `<path d="${m.body.dress ? dressD : shirtD}" fill="${g3}"/>`
    + (mono ? '' : `<path d="M ${CX-30} ${b.shoulderY-2} Q ${CX} ${b.shoulderY+24} ${CX+30} ${b.shoulderY-2}"
             fill="none" stroke="rgba(0,0,0,.15)" stroke-width="7" stroke-linecap="round"/>`);

  const chinY = 254 + (g.chY - 254) * m.face.size;      // chin in body space
  const neckwear =
      (J.choker ? `<path d="M ${CX-33} ${chinY-2} Q ${CX} ${chinY+17} ${CX+33} ${chinY-2}"
         fill="none" stroke="${jc}" stroke-width="7" stroke-linecap="round"/>` : '')
    + (J.necklace ? `<path d="M ${CX-39} ${chinY+1} Q ${CX} ${chinY+38} ${CX+39} ${chinY+1}"
         fill="none" stroke="${jc}" stroke-width="3.4"/>
       <circle cx="${CX}" cy="${chinY+40}" r="6.2" fill="${jc}"/>` : '');

  const neck =
    `<path d="M ${CX-28} ${g.chY-60} L ${CX-28} ${b.shoulderY+22} L ${CX+28} ${b.shoulderY+22} L ${CX+28} ${g.chY-60} Z" fill="${skin}"/>
     ${mono?'':`<ellipse cx="${CX}" cy="${g.chY-8}" rx="30" ry="15" fill="rgba(0,0,0,.11)"/>`}`;

  /* ---- head ---- */
  const earX = g.cW*0.74 + g.jW*0.26 + 6, earY = g.cY + 32;
  const ear = sx =>
    `<g transform="translate(${CX+sx*earX},${earY}) scale(${sx},1)">
       <ellipse rx="14" ry="21" fill="${skin}" stroke="${mono?LINE:'rgba(0,0,0,.10)'}" stroke-width="${mono?4:1.8}"/>
       <path d="M 3 -10 C -5 -8, -6 6, 2 11" fill="none" stroke="${mono?LINE:'rgba(0,0,0,.13)'}" stroke-width="${mono?3:2.4}" stroke-linecap="round"/>
     </g>`;
  const ears = ear(-1) + ear(1);

  const face = mono
    ? `<path d="${fp}" fill="${inv?'none':'#fff'}" stroke="${LINE}" stroke-width="4.5"/>`
    : `<path d="${fp}" fill="${skin}"/>
       <path d="${fp}" fill="url(#sh${uid})"/>`;

  const brows = pair(BROWS[m.brows.style].d(bwc), browY, browSp, m.brows.size, m.brows.size, m.brows.rot);
  const eyes  = pair(EYES[m.eyes.style].d(ec), eyeY, eyeSp, m.eyes.size, m.eyes.size*m.eyes.stretch, m.eyes.rot);
  const nw = m.nose.width;
  const nose  = `<g transform="translate(${noseX},${noseY}) scale(${m.nose.size*nw},${m.nose.size})">`
              + NOSES[m.nose.style].d(4 / Math.sqrt(nw)) + `</g>`;   // keep the line weight even when stretched
  const mouth = `<g transform="translate(${mouthX},${mouthY}) scale(${m.mouth.size*m.mouth.stretch},${m.mouth.size})">${MOUTHS[m.mouth.style].d(mc)}</g>`;
  const stache= must.d ? `<g transform="translate(${mouthX},${mustY}) scale(${m.beard.size})">${must.d(fhc)}</g>` : '';

  const bg = Object.assign({}, g, {mouthY, mouthX, noseY, noseX, earY, fp});
  const beardClip = beard.clip ? `<g clip-path="url(#fc${uid})">${beard.clip(fhc,bg,skin)}</g>` : '';
  const beardFree = beard.free ? beard.free(fhc,bg,skin) : '';

  const NOGLOSS = new Set(['Bald','Mohawk','Slick','Side Part','Afro Puffs','Loose Curls','Tapered',
    'Waves','Twists','Short Locs','Long Locs']);
  const gloss = NOGLOSS.has(hair.n) ? ''
    : `<path d="M 192 157 C 218 130, 266 123, 303 139" fill="none" stroke="${shade(hc,.13)}"
         stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
  /* Hair art was drawn against a reference skull: 106 half-width at the cheeks,
     88 at the crown control. Fit to whichever of those the live skull stretches
     more, and anchor the scale near the crown so shrinking cannot expose it. */
  const HAIR_ANCHOR = 138;
  const fit    = Math.max(g.cW / 106, g.tW / 88);
  const hairSX = fit * 1.04 * (0.62 + 0.38 * m.hair.size);   // width tracks the skull; Size mostly adds volume
  const hairSY = m.hair.size * Math.max(1, fit * 0.88);
  const hairT  = `translate(${CX},${HAIR_ANCHOR+m.hair.y}) scale(${m.hair.flip?-hairSX:hairSX},${hairSY}) translate(${-CX},${-HAIR_ANCHOR})`;
  const hairBack  = hair.back  ? `<g transform="${hairT}">${hair.back(hc)}</g>`  : '';
  /* Drawn inside the head but ahead of the ears, so a plait can be tucked behind
     the ear and still hang down over the shoulder. */
  const hairMid   = hair.mid   ? `<g transform="${hairT}">${hair.mid(hc)}</g>`   : '';
  const hairFront = hair.front ? `<g transform="${hairT}">${hair.front(hc)}${gloss}</g>` : '';

  const onEar = (sx, d) => `<g transform="translate(${CX+sx*earX},${earY}) scale(${sx},1)">${d}</g>`;
  const earJewel =
      (J.cartL ? onEar(-1, JEWEL_EAR.cart(jc)) : '') + (J.cartR ? onEar(1, JEWEL_EAR.cart(jc)) : '')
    + (J.studL ? onEar(-1, JEWEL_EAR.stud(jc)) : '') + (J.studR ? onEar(1, JEWEL_EAR.stud(jc)) : '')
    + (J.dropL ? onEar(-1, JEWEL_EAR.drop(jc)) : '') + (J.dropR ? onEar(1, JEWEL_EAR.drop(jc)) : '');

  const hatSpec = HATS[m.hat.style];
  const hatT = `translate(${CX},${HAIR_ANCHOR}) scale(${fit*1.04},${Math.max(1, fit*0.88)}) translate(${-CX},${-HAIR_ANCHOR})`;
  const hatC = mono ? (inv ? 'none' : '#fff') : pick(HATC, m.hat.color);
  const hatA = mono ? (inv ? 'none' : '#fff') : shade(pick(HATC, m.hat.color), -.17);
  const hat = hatSpec.d
    ? `<g transform="${hatT}" ${mono ? `stroke="${LINE}" stroke-width="4" stroke-linejoin="round"` : ''}>`
      + hatSpec.d(hatC, hatA) + `</g>` : '';

  const glass = GLASSES[m.glasses.style].d
    ? `<g transform="translate(${CX},${eyeY+m.glasses.y}) scale(${m.glasses.size})">${GLASSES[m.glasses.style].d(gc)}</g>` : '';
  const molec = mono ? (inv ? 'none' : INK) : pick(moleColors(m), m.mole.color);
  const mole = m.mole.on
    ? `<ellipse cx="${mouthX+40+m.mole.x}" cy="${mouthY-22+m.mole.y}" rx="${5*m.mole.size}" ry="${5*m.mole.size}" fill="${molec}"/>` : '';

  const headScale = t =>
    `<g transform="translate(${CX},254) scale(${m.face.size}) translate(${-CX},-254)">${t}</g>`;
  /* The 24 hand-drawn caps cannot each fit 12 skull shapes at every size, so the
     crown of the skull is filled in hair colour underneath. Clipped above the
     style's hairline, it is invisible except where a cap would have fallen short. */
  /* Bald draws nothing, and the Mohawk is meant to leave the sides showing, so
     neither of them wants the crown filled in underneath. */
  const scalpOn = !!hair.front && !hair.noScalp && hair.n !== 'Mohawk' && hair.n !== 'Bald';
  const scalpY  = hair.hl != null ? hair.hl : 180;
  const scalpCY = (g.tY + g.chY) / 2;
  const scalp = scalpOn
    ? `<g clip-path="url(#cp${uid})"><path d="${fp}" fill="${hc}"
         transform="translate(${CX},${scalpCY}) scale(1.03) translate(${-CX},${-scalpCY})"/></g>`
    : '';
  /* On a picker tile, only the piece actually being chosen is drawn at full
     strength; the rest of the Mii drops back to a faint outline so the choice
     reads at a glance instead of competing with a whole face.  Without a focus
     — the live Mii, the Plaza — nothing is wrapped and the output is unchanged. */
  const lead = focus === 'skin' ? 'face' : focus;
  const part = (name, frag) => (!lead || !frag || name === 'face') ? frag
    : `<g${name === lead ? '' : ' opacity=".2"'}>${frag}</g>`;

  const backHair = hairBack ? headScale(part('hair', hairBack)) : '';
  const head = headScale(
      part('hair', hairMid) + part('face', ears + face) + part('hair', scalp)
    + part('beard', beardClip + beardFree)
    + part('brows', brows) + part('eyes', eyes) + part('nose', nose)
    + part('mouth', mouth) + part('beard', stache)
    + part('hair', hairFront) + part('jewel', earJewel) + part('hat', hat)
    + part('glasses', glass) + part('mole', mole));

  const out = `<defs>
<linearGradient id="sh${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#fff" stop-opacity=".16"/>
        <stop offset="62%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".055"/>
      </linearGradient>
      <linearGradient id="b3${uid}" gradientUnits="userSpaceOnUse" x1="${CX-165}" y1="0" x2="${CX+175}" y2="0">
        <stop offset="0%"   stop-color="#fff" stop-opacity=".13"/>
        <stop offset="34%"  stop-color="#fff" stop-opacity=".07"/>
        <stop offset="64%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".11"/>
      </linearGradient>
      <radialGradient id="sp${uid}" cx="35%" cy="30%" r="82%">
        <stop offset="0%"   stop-color="#fff" stop-opacity=".2"/>
        <stop offset="58%"  stop-color="#fff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".1"/>
      </radialGradient>
      <filter id="gs${uid}" x="-60%" y="-180%" width="220%" height="460%">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
      <clipPath id="fc${uid}"><path d="${fp}"/></clipPath>
      <clipPath id="cp${uid}"><path d="M 0 0 H 512 V 254
        C 340 254, 300 ${scalpY} 256 ${scalpY}
        C 212 ${scalpY}, 172 254, 0 254 Z"/></clipPath>
    </defs>${groundShadow}<g class="mii-bob">${backHair}${part('body', neck + body + neckwear)}${head}</g>`;
  LINE = INK_BASE;                              // never leak the mono ink into the live Mii
  // only the parts library's own hard-coded paper white (sclera, teeth) is knocked out
  return inv ? out.replace(/fill="#fff(?:fff)?"(?![0-9a-f])/gi, 'fill="none"') : out;
}

/* ============================================================
   RANDOM MII
   ============================================================ */
/* A small deterministic PRNG, so a seeded crowd comes out the same every time. */
function rngFrom(seed){
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ t >>> 15, 1 | t);
    x ^= x + Math.imul(x ^ x >>> 7, 61 | x);
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
}

/* Nicknames for the crowd the plaza seeds itself with. */
const MII_NAMES = ['Ava','Bo','Cleo','Dez','Emi','Fitz','Gus','Hana','Ida','Jae','Kit','Lena',
  'Miko','Nan','Otis','Pip','Quin','Rae','Sol','Tam','Uma','Vic','Wren','Xio','Yuki','Zed',
  'Bea','Cass','Dot','Ezra','Flo','Gil','Hugo','Ines','Juno','Kai','Lou','Mo','Nia','Ollie'];

function randomMii(rand = Math.random){
  const ri = n => Math.floor(rand()*n);
  const rf = (a,b) => Math.round((a + rand()*(b-a)) * 1000) / 1000;
  const beardy = rand() < .35;
  return {
    name: MII_NAMES[ri(MII_NAMES.length)], favorite:false, mingle:true,
    birthday:{m:1, d:1},
    skin: ri(SKINS.length),
    face   :{shape:ri(FACES.length), size:rf(.92,1.08), width:rf(.9,1.1), jaw:rf(.88,1.14)},
    hair   :{style:ri(HAIRS.length), color:ri(HAIRC.length), y:rf(-8,8), size:rf(.95,1.08), flip:rand()<.5},
    brows  :{style:ri(BROWS.length), color:ri(HAIRC.length), y:rf(-10,10), spacing:rf(-6,10), size:rf(.85,1.2), rot:rf(-14,14)},
    eyes   :{style:ri(EYES.length), color:ri(EYEC.length), y:rf(-10,10), spacing:rf(-6,12), size:rf(.85,1.15), stretch:rf(.85,1.15), rot:rf(-12,12)},
    nose   :{style:ri(NOSES.length), x:rf(-6,6), y:rf(-10,12), size:rf(.85,1.25), width:rf(.8,1.3)},
    mouth  :{style:ri(MOUTHS.length), color:ri(MOUTHC.length), x:rf(-6,6), y:rf(-10,14), size:rf(.85,1.15), stretch:rf(.85,1.2)},
    beard  :{must: beardy?ri(MUSTACHES.length):0, style: beardy?ri(BEARDS.length):0, color:ri(HAIRC.length), size:rf(.85,1.2), y:rf(-8,8)},
    glasses:{style: rand()<.35 ? 1+ri(GLASSES.length-1) : 0, color:ri(GLASSC.length), y:rf(-6,6), size:rf(.9,1.1)},
    mole   :{on: rand()<.18, color: rand()<.65 ? 0 : 1,
              x:rf(-120,45), y:rf(-70,60), size:rf(.8,1.4)},
    hat    :{style: rand()<.35 ? 1+ri(HATS.length-1) : 0, color:ri(HATC.length)},
    jewel  :Object.assign({color:0}, Object.fromEntries(JEWEL_KEYS.map(k=>[k, rand()<.22]))),
    body   :{color:ri(SHIRTC.length), pants:ri(PANTSC.length), shoes:ri(SHOEC.length),
             dress:rand()<.4, build:rf(.86,1.16), height:rf(.9,1.1)}
  };
}

/* ============================================================
   PLAZA ROSTER

   The plaza is fed from two places:

   * plaza.json, committed to the repo — the curated residents. Everybody
     who loads the site sees these, and nothing in the browser can remove
     them; they are edited by changing the file and pushing.
   * localStorage — the Miis this one visitor has sent over from the studio.
     They live in that visitor's browser only, so sending a Mii also copies
     a submission code to paste into plaza.json to make it permanent.

   Each entry is {id, name, mii}; the nickname is the id, and a nickname
   already taken by a resident or a local Mii cannot be used again.
   ============================================================ */
const PLAZA_KEY  = 'mii.plaza.roster.v1';
const PLAZA_FILE = 'plaza.json';

const rosterKey = name => String(name || '').trim().toLowerCase();

/* ---- the committed residents ---- */
let COMMITTED = [];

function normEntry(e, committed){
  const name = String(e && e.name || '').trim();
  if(!name || !e.mii) return null;
  return {id: rosterKey(name), name, mii: e.mii, sent: !!(e && e.sent), committed: !!committed};
}

/* Falls back to an empty list when plaza.json cannot be read — opening the
   page straight off disk, say — so the plaza still works locally. */
/* GitHub Pages serves the roster with a ten-minute max-age, so for that long
   after a merge the edge keeps handing back the old one and a newly admitted
   Mii is nowhere to be seen.  cache:'no-cache' only revalidates, and the edge
   answers the revalidation from the very copy that is stale — so ask for a URL
   it has not cached instead.  A minute's granularity keeps a page that loads
   the roster twice from fetching it twice. */
async function loadCommitted(url = PLAZA_FILE){
  try{
    const bust = `${url}${url.includes('?') ? '&' : '?'}v=${Math.floor(Date.now() / 60000)}`;
    const res = await fetch(bust, {cache:'no-cache'});
    if(!res.ok) throw new Error(res.status);
    const data = await res.json();
    COMMITTED = (Array.isArray(data) ? data : []).map(e => normEntry(e, true)).filter(Boolean);
  }catch{
    COMMITTED = [];
  }
  return COMMITTED;
}

/* ---- this visitor's own Miis ---- */
function loadRoster(){
  try{
    const r = JSON.parse(localStorage.getItem(PLAZA_KEY));
    return Array.isArray(r) ? r.map(e => normEntry(e, false)).filter(Boolean) : [];
  }catch{ return []; }
}
function saveRoster(list){
  try{
    localStorage.setItem(PLAZA_KEY,
      JSON.stringify(list.map(({id,name,mii,sent}) => ({id,name,mii,sent: !!sent}))));
  }catch{}
}

/* Residents first; a local Mii whose nickname a resident already holds is
   dropped, so the committed file always wins. */
function mergedRoster(){
  const seen = new Set(COMMITTED.map(e => e.id));
  const out  = COMMITTED.slice();
  for(const e of loadRoster()) if(!seen.has(e.id)){ seen.add(e.id); out.push(e); }
  /* Never show an empty plaza: if plaza.json could not be read and this
     visitor has sent nobody over, Celine stands in for it. */
  if(!out.length){
    const mii = CELINE();
    out.push({id:'celine', name:'Celine', mii, committed:true});
  }
  return out;
}

function rosterAdd(m){
  const name = String(m.name || '').trim();
  if(!name) return {ok:false, reason:'noname'};
  const id = rosterKey(name);
  if(COMMITTED.some(e => e.id === id)) return {ok:false, reason:'resident', name};
  const list = loadRoster();
  if(list.some(e => e.id === id))      return {ok:false, reason:'duplicate', name};
  list.push({id, name, mii: structuredClone(m)});
  saveRoster(list);
  return {ok:true, id, name};
}

/* Did the postbox actually take this one?  A Mii that was added here but never
   accepted — the postbox was down, or busy — has to be allowed another run at
   it, or one failed send would lock that nickname out of this browser for good.
   Only a Mii that really went through counts as a double-submit. */
function rosterSent(name){
  const id = rosterKey(name);
  return loadRoster().some(e => e.id === id && e.sent);
}
function rosterMarkSent(name){
  const id   = rosterKey(name);
  const list = loadRoster();
  const hit  = list.find(e => e.id === id);
  if(hit){ hit.sent = true; saveRoster(list); }
}
/* The nickname turned out to belong to somebody else, so this browser should
   not go on claiming it either. */
function rosterRemove(name){
  const id = rosterKey(name);
  saveRoster(loadRoster().filter(e => e.id !== id));
}

/* ---- sending a Mii on for real ----
   The plaza is fed by one file per Mii in _data/plaza/, so a submission is just
   that file's contents. The studio copies it to the clipboard and the visitor
   passes it on however they like; Celine saves it into the folder and pushes. */
function submissionCode(m){
  const name = String(m.name || '').trim();
  return JSON.stringify({id: rosterKey(name), name, mii: m}, null, 2);
}

/* ---- the postbox ----
   A small service that takes a Mii and opens the pull request itself, so a
   visitor needs nothing but this page.  Empty means there is no postbox and the
   studio hands back the code to paste instead — which is also what happens when
   the postbox is unreachable, so the send button never simply fails.
   Deploying one: see plaza-api/README.md. */
const PLAZA_API = 'https://celine-lee-github-io-mii.vercel.app/api/submit';

async function sendToPlaza(m){
  if(!PLAZA_API) return {ok:false, reason:'nopost'};
  try{
    const res  = await fetch(PLAZA_API, {
      method : 'POST',
      headers: {'content-type':'application/json'},
      body   : JSON.stringify({name: String(m.name || '').trim(), mii: m})
    });
    const data = await res.json().catch(()=>null);
    if(res.ok && data && data.ok) return {ok:true, url: data.url};
    return {ok:false,
            reason : (data && data.reason)  || 'http',
            message: (data && data.message) || 'The Plaza postbox did not answer.'};
  }catch{
    return {ok:false, reason:'offline', message:'Could not reach the Plaza postbox.'};
  }
}

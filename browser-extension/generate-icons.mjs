/**
 * Génère les icônes PNG de l'extension ShadowReply AI.
 * Utilise uniquement les modules natifs Node.js — aucune dépendance externe.
 *
 * Usage : node generate-icons.mjs
 */

import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Palette émeraude ShadowReply
const COLORS = {
  bg:     [0, 103, 79],    // #00674f — fond
  light:  [0, 196, 138],   // #00c48a — accent clair
  white:  [240, 245, 242],  // #f0f5f2
};

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crcBuf]);
}

/**
 * Crée un PNG RGBA à partir d'une fonction de pixel.
 * pixelFn(x, y, size) → [r, g, b, a]
 */
function createPNG(size, pixelFn) {
  // IHDR
  const ihdr = Buffer.alloc(13, 0);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  // Raw pixel data (filter byte 0 per row + RGBA)
  const rowLen = 1 + size * 4;
  const raw = Buffer.alloc(size * rowLen, 0);
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const [r, g, b, a = 255] = pixelFn(x, y, size);
      const i = y * rowLen + 1 + x * 4;
      raw[i] = r; raw[i+1] = g; raw[i+2] = b; raw[i+3] = a;
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Dessin simplifié : fond vert + 3 cercles blancs (logo ShadowReply) */
function drawIcon(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  // Distance du centre
  const dx = x - cx + 0.5;
  const dy = y - cy + 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Hors du cercle → transparent
  if (dist > r - 0.5) return [0, 0, 0, 0];

  // Anti-aliasing bord
  const alpha = dist > r - 1.5
    ? Math.round(255 * (r - 0.5 - dist))
    : 255;

  // 3 points blancs horizontaux centrés
  const dotR = size * 0.075;
  const spacing = size * 0.2;
  const dotY = cy;
  const dots = [-spacing, 0, spacing].map((ox) => ({ cx: cx + ox, cy: dotY }));

  for (const dot of dots) {
    const ddx = x - dot.cx + 0.5;
    const ddy = y - dot.cy + 0.5;
    if (Math.sqrt(ddx * ddx + ddy * ddy) < dotR) {
      return [240, 245, 242, alpha];
    }
  }

  // Dégradé vert émeraude de fond
  const t = Math.max(0, Math.min(1, (y - (cy - r)) / (2 * r)));
  const bg = interpolate(COLORS.bg, COLORS.light, t * 0.4);
  return [...bg, alpha];
}

function interpolate([r1, g1, b1], [r2, g2, b2], t) {
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

// Génération
mkdirSync(join(__dir, 'icons'), { recursive: true });

for (const size of [16, 48, 128]) {
  const png = createPNG(size, drawIcon);
  const path = join(__dir, 'icons', `icon${size}.png`);
  writeFileSync(path, png);
  console.log(`✓ icons/icon${size}.png (${png.length} bytes)`);
}

console.log('\nIcones générées. Tu peux maintenant packager l\'extension.');

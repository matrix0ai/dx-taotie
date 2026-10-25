#!/usr/bin/env node
// Regenerates the non-macOS tray icons (#1353) from build/tray-color.svg,
// rendered from the vector at every size so each one is crisp.
//
// The macOS tray uses trayTemplate.png, a black-on-transparent template image
// that the menu bar tints for light/dark (see gen-icons.mjs). Windows and Linux
// do not tint, so that glyph would be black on a dark taskbar, and
// Shell_NotifyIcon wants a multi-size .ico anyway. The colour glyph, a bone
// mask on the dark tile, reads on both dark and light taskbars:
//
//   resources/tray.ico  Windows, 16/20/24/32/40/48/64 px (100% to 400% DPI)
//   resources/tray.png  Linux, 32 px (panels scale it to their 22-24 px slot)
//
// The outputs are committed; run this only when build/tray-color.svg changes:
//   node scripts/make-tray-icons.mjs   (from apps/desktop)
// sharp is resolved from the monorepo's node_modules (a server dependency).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const resources = path.join(here, '../resources');
const SOURCE = fs.readFileSync(path.join(here, '../build/tray-color.svg'));
const ICO_SIZES = [16, 20, 24, 32, 40, 48, 64];
const LINUX_SIZE = 32;

// The SVG is drawn on a 64 unit box; density scales it so it renders at exactly size px.
function render(size) {
  return sharp(SOURCE, { density: (72 * size) / 64 }).resize(size, size);
}

async function rgba(size) {
  const { data } = await render(size).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}

// One ICO image entry as a classic 32-bit DIB (BITMAPINFOHEADER + bottom-up
// BGRA + 1-bit AND mask). PNG-in-ICO is only guaranteed for 256 px entries, so
// the small sizes use the format every Windows icon loader understands.
function dib(size, data) {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0); // biSize
  header.writeInt32LE(size, 4); // biWidth
  header.writeInt32LE(size * 2, 8); // biHeight: XOR + AND masks
  header.writeUInt16LE(1, 12); // biPlanes
  header.writeUInt16LE(32, 14); // biBitCount
  header.writeUInt32LE(0, 16); // biCompression = BI_RGB

  const xor = Buffer.alloc(size * size * 4);
  const maskStride = Math.ceil(size / 32) * 4;
  const and = Buffer.alloc(maskStride * size);
  for (let y = 0; y < size; y++) {
    const row = size - 1 - y; // DIB rows run bottom-up
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = (row * size + x) * 4;
      xor[dst] = data[src + 2];
      xor[dst + 1] = data[src + 1];
      xor[dst + 2] = data[src];
      xor[dst + 3] = data[src + 3];
      if (data[src + 3] === 0) and[row * maskStride + (x >> 3)] |= 0x80 >> (x & 7);
    }
  }
  return Buffer.concat([header, xor, and]);
}

async function buildIco() {
  const images = [];
  for (const size of ICO_SIZES) images.push(dib(size, await rgba(size)));

  const dir = Buffer.alloc(6 + 16 * images.length);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(images.length, 4);
  let offset = dir.length;
  images.forEach((img, i) => {
    const size = ICO_SIZES[i];
    const e = 6 + 16 * i;
    dir.writeUInt8(size >= 256 ? 0 : size, e);
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1);
    dir.writeUInt8(0, e + 2); // palette colours
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(img.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += img.length;
  });
  return Buffer.concat([dir, ...images]);
}

fs.writeFileSync(path.join(resources, 'tray.ico'), await buildIco());
await render(LINUX_SIZE).png({ compressionLevel: 9 }).toFile(path.join(resources, 'tray.png'));
console.log(`wrote resources/tray.ico (${ICO_SIZES.join('/')} px) and resources/tray.png (${LINUX_SIZE} px)`);

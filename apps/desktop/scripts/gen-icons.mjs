// Generates the desktop icons from the brand mark with sharp (a server
// dependency, resolved from the monorepo's node_modules).
//
//   apps/client/public/favicon.svg  ->  assets/appicon_1024.png
//       824 px tile inset 100 px on every side (macOS icon grid); icon.icns is
//       built from it via iconutil.
//   assets/tray-template.svg        ->  assets/trayTemplate.png (16) and
//                                       assets/trayTemplate@2x.png (32)
//       black-on-transparent macOS template image.
//
// Run from apps/desktop:  node scripts/gen-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(__dirname, '../assets');
const favicon = path.resolve(__dirname, '../../client/public/favicon.svg');

const tile = await sharp(fs.readFileSync(favicon), { density: 1200 }).resize(824, 824).png().toBuffer();
await sharp(tile).extend({ top: 100, bottom: 100, left: 100, right: 100, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toFile(path.join(assets, 'appicon_1024.png'));

const tray = fs.readFileSync(path.join(assets, 'tray-template.svg'));
await sharp(tray, { density: 1200 }).resize(16, 16).png().toFile(path.join(assets, 'trayTemplate.png'));
await sharp(tray, { density: 1200 }).resize(32, 32).png().toFile(path.join(assets, 'trayTemplate@2x.png'));

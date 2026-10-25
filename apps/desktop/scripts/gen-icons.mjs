// Generates the desktop icons from the brand mark with sharp (a server
// dependency, resolved from the monorepo's node_modules).
//
//   build/icon.svg                  ->  build/icon.png (1024) and
//                                       resources/icon.png (512, shown in dev)
//       the ornate app icon, already drawn on the macOS icon grid (824 px tile
//       inset 100 px); also -> build/icon.icns (macOS only, iconutil)
//   apps/client/public/favicon.svg  ->  build/tray-source.png
//       the simple mark: the app icon is too detailed for 16-32 px tray slots,
//       so scripts/make-tray-icons.mjs cuts tray.ico / tray.png from this
//   resources/tray-template.svg        ->  resources/trayTemplate.png (16) and
//                                       resources/trayTemplate@2x.png (32)
//       black-on-transparent macOS template image.
//
// Run from apps/desktop:  node scripts/gen-icons.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, '../build');
const resources = path.resolve(__dirname, '../resources');
const appIconSvg = path.join(buildDir, 'icon.svg');
const favicon = path.resolve(__dirname, '../../client/public/favicon.svg');

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const icon = await sharp(fs.readFileSync(appIconSvg), { density: 384 }).resize(1024, 1024).png().toBuffer();
fs.writeFileSync(path.join(buildDir, 'icon.png'), icon);

const tile = await sharp(fs.readFileSync(favicon), { density: 1200 }).resize(824, 824).png().toBuffer();
await sharp(tile).extend({ top: 100, bottom: 100, left: 100, right: 100, background: transparent })
  .png().toFile(path.join(buildDir, 'tray-source.png'));
await sharp(icon).resize(512, 512).png().toFile(path.join(resources, 'icon.png'));

if (process.platform === 'darwin') {
  const iconset = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'taotie-icon-')), 'icon.iconset');
  fs.mkdirSync(iconset);
  for (const size of [16, 32, 128, 256, 512]) {
    await sharp(icon).resize(size, size).png().toFile(path.join(iconset, `icon_${size}x${size}.png`));
    await sharp(icon).resize(size * 2, size * 2).png().toFile(path.join(iconset, `icon_${size}x${size}@2x.png`));
  }
  execFileSync('iconutil', ['-c', 'icns', iconset, '-o', path.join(buildDir, 'icon.icns')]);
}

const tray = fs.readFileSync(path.join(buildDir, 'tray-template.svg'));
await sharp(tray, { density: 1200 }).resize(16, 16).png().toFile(path.join(resources, 'trayTemplate.png'));
await sharp(tray, { density: 1200 }).resize(32, 32).png().toFile(path.join(resources, 'trayTemplate@2x.png'));

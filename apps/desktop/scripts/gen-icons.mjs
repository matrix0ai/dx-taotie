// Generates the desktop icons from the brand mark with sharp (a server
// dependency, resolved from the monorepo's node_modules).
//
//   build/icon.svg                  ->  build/icon.png (1024) and
//                                       resources/icon.png (512, shown in dev)
//       the ornate app icon, already drawn on the macOS icon grid (824 px tile
//       inset 100 px); also -> build/icon.icns (macOS only, iconutil)
//   build/tray-template-16.svg      ->  resources/trayTemplate.png (16)
//   build/tray-template.svg         ->  resources/trayTemplate@2x.png (32)
//       black-on-transparent macOS template images, each drawn on its own pixel
//       grid (the app icon is far too detailed for a menu-bar slot)
//   build/tray-color.svg            ->  see scripts/make-tray-icons.mjs
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

const icon = await sharp(fs.readFileSync(appIconSvg), { density: 384 }).resize(1024, 1024).png().toBuffer();
fs.writeFileSync(path.join(buildDir, 'icon.png'), icon);

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

// 72 dpi: the SVGs are authored at 1 unit = 1 px, so they render at exactly 16 / 32 px.
await sharp(path.join(buildDir, 'tray-template-16.svg'), { density: 72 }).png().toFile(path.join(resources, 'trayTemplate.png'));
await sharp(path.join(buildDir, 'tray-template.svg'), { density: 72 }).png().toFile(path.join(resources, 'trayTemplate@2x.png'));

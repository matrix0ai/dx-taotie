import path from 'node:path';
import { nativeImage } from 'electron';

// resources/icon.png, resolved from out/main. A packaged app already carries
// its icon in the bundle; this is what dev runs (the stock Electron binary)
// and Linux window managers need set explicitly.
export const appIconPath = path.join(import.meta.dirname, '../../resources/icon.png');

export function appIcon() {
  return nativeImage.createFromPath(appIconPath);
}

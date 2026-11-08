import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { detectDshTuiProfile } from './dsh-profile.js';

const directories: string[] = [];
const originalDshHome = process.env.DSH_HOME;

afterEach(() => {
  for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true });
  if (originalDshHome === undefined) delete process.env.DSH_HOME;
  else process.env.DSH_HOME = originalDshHome;
});

function makeHome(): string {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'taotie-dsh-'));
  directories.push(home);
  process.env.DSH_HOME = home;
  return home;
}

function addProfile(home: string, name: string): void {
  const directory = path.join(home, 'profiles', name);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({
    dsh: { profile: { bundles: ['@deepseek-harness-tui/dsh-tui'] } },
  }));
}

describe('DSH TUI profile detection', () => {
  it('detects the sole profile by installed bundle, not directory name', () => {
    const home = makeHome();
    addProfile(home, 'my-terminal');
    expect(detectDshTuiProfile('/unused')).toEqual({
      name: 'my-terminal',
      patchPath: path.join(home, 'profiles', 'my-terminal', 'cordis.patch.yml'),
    });
  });

  it('requires an explicit choice when multiple TUI profiles exist', () => {
    const home = makeHome();
    addProfile(home, 'work');
    addProfile(home, 'personal');
    expect(() => detectDshTuiProfile('/unused')).toThrow('Multiple DSH TUI profiles found');
    expect(detectDshTuiProfile('/unused', 'work')?.name).toBe('work');
  });

  it('returns legacy fallback when no TUI profile exists', () => {
    makeHome();
    expect(detectDshTuiProfile('/unused')).toBeUndefined();
  });
});

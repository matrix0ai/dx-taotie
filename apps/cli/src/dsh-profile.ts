import fs from 'node:fs';
import path from 'node:path';

const TUI_BUNDLE = '@deepseek-harness-tui/dsh-tui';

export interface DshTuiProfile {
  name: string;
  patchPath: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readProfile(home: string, name: string): DshTuiProfile | undefined {
  const directory = path.join(home, 'profiles', name);
  const manifestPath = path.join(directory, 'package.json');
  if (!fs.existsSync(manifestPath)) return undefined;
  let manifest: unknown;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read DSH profile manifest ${manifestPath}: ${String(error)}`);
  }
  const dsh = isRecord(manifest) && isRecord(manifest.dsh) ? manifest.dsh : undefined;
  const profile = dsh && isRecord(dsh.profile) ? dsh.profile : undefined;
  const bundles = profile?.bundles;
  if (!Array.isArray(bundles) || !bundles.every(bundle => typeof bundle === 'string')) {
    return undefined;
  }
  if (!bundles.includes(TUI_BUNDLE)) return undefined;
  return { name, patchPath: path.join(directory, 'cordis.patch.yml') };
}

export function detectDshTuiProfile(
  homeDir: string,
  explicitName?: string,
): DshTuiProfile | undefined {
  const home = process.env.DSH_HOME?.trim() || path.join(homeDir, '.dsh');
  if (explicitName) {
    const profile = readProfile(home, explicitName);
    if (!profile) {
      throw new Error(`DSH profile '${explicitName}' is missing or does not install ${TUI_BUNDLE}`);
    }
    return profile;
  }
  const profilesDir = path.join(home, 'profiles');
  if (!fs.existsSync(profilesDir)) return undefined;
  const matches = fs.readdirSync(profilesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => readProfile(home, entry.name))
    .filter((profile): profile is DshTuiProfile => Boolean(profile));
  if (matches.length > 1) {
    throw new Error(
      `Multiple DSH TUI profiles found: ${matches.map(profile => profile.name).join(', ')}. `
      + 'Choose one with --dsh-profile <name>.',
    );
  }
  return matches[0];
}

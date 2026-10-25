import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

// #948: the v0.8.2–v0.8.4 releases shipped installers stamped 0.8.1 because
// desktop/package.json was never bumped after v0.8.1. electron-builder reads
// this version for the artifact filenames and the latest*.yml updater
// manifests, so a stale number here silently mislabels every future release.
//
// The authoritative tag-vs-version check is the "Verify desktop version
// matches the tag" step in .github/workflows/desktop-release.yml — only a
// tagged run knows which version is being released, so it cannot live here.
// This test covers what is checkable without a tag: that the version is
// well-formed. pnpm-lock.yaml does not record workspace package versions, so
// there is no lockfile stamp to compare against.

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(here, '../../package.json'), 'utf8')) as {
  name: string;
  version: string;
};

describe('desktop package version', () => {
  it('is a semver-ish x.y.z', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

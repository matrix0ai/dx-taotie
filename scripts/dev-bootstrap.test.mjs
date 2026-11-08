import { createHash } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import assert from 'node:assert/strict';

const execFile = promisify(execFileCallback);
const projectRoot = resolve(import.meta.dirname, '..');
async function makeFixture(t) {
  const fixture = await mkdtemp(join(tmpdir(), 'taotie-bootstrap-'));
  const lockfile = join(fixture, 'pnpm-lock.yaml');
  const lockContents = "lockfileVersion: '9.0'\n";
  const lockHash = createHash('sha256').update(lockContents).digest('hex');

  await writeFile(join(fixture, 'package.json'), '{"name":"bootstrap-fixture"}\n');
  await writeFile(lockfile, lockContents);
  await mkdir(join(fixture, 'node_modules'));
  await writeFile(join(fixture, 'node_modules', '.taotie-bootstrap-lock'), lockHash);
  t.after(() => rm(fixture, { force: true, recursive: true }));
  return { fixture, lockfile };
}

async function assertEnvIsCreatedAndPreserved(runBootstrap, t) {
  const { fixture } = await makeFixture(t);

  await runBootstrap(fixture);
  const generatedEnv = await readFile(join(fixture, '.env'), 'utf8');
  assert.match(generatedEnv, /^ENCRYPTION_KEY=[0-9a-f]{64}\r?\nPORT=3001\r?\n$/);

  const existingEnv = 'ENCRYPTION_KEY=keep-this-value\nPORT=4444\n';
  await writeFile(join(fixture, '.env'), existingEnv);
  await runBootstrap(fixture);
  assert.equal(await readFile(join(fixture, '.env'), 'utf8'), existingEnv);
}

async function assertMissingStampInstalls(runBootstrap, t) {
  const { fixture, lockfile } = await makeFixture(t);
  await rm(join(fixture, 'node_modules', '.taotie-bootstrap-lock'));

  await runBootstrap(fixture);

  const lockHash = createHash('sha256').update(await readFile(lockfile)).digest('hex');
  assert.equal(
    (await readFile(join(fixture, 'node_modules', '.taotie-bootstrap-lock'), 'utf8')).trim(),
    lockHash,
  );
}

test('Bash bootstrap creates and preserves .env', { skip: process.platform === 'win32' }, async (t) => {
  await assertEnvIsCreatedAndPreserved(
    (fixture) => execFile('bash', [join(projectRoot, 'scripts', 'dev-bootstrap.sh'), '--project-root', fixture]),
    t,
  );
});

test('Bash bootstrap installs when the lockfile stamp is missing', { skip: process.platform === 'win32' }, async (t) => {
  await assertMissingStampInstalls(
    (fixture) => execFile('bash', [join(projectRoot, 'scripts', 'dev-bootstrap.sh'), '--project-root', fixture]),
    t,
  );
});

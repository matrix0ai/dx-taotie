# RFC 0006: Pin Node 24 and move desktop to Electron 45

**Status:** Implemented

## Summary

Pin the repository to Node 24.22.2, move the desktop app from Electron 38.8.6 to 45.2.3 (which bundles the same Node 24.22.2), and replace `better-sqlite3` 12.10.0 with 13.0.3, which ships prebuilt N-API binaries. One binary then loads in Node 24, Electron 45 and the server, so the desktop dev loop no longer rebuilds a native module. The implementation exists in the working tree and is uncommitted.

## Problem

- The repo pinned Node 22 (`.nvmrc`, `engines`, `Dockerfile`, dead `volta` blocks) while shells resolved Node 24 (fnm), Node 26 (Homebrew `pnpm` shebang) and Volta's Node 22. A native module built for one runtime failed to load in another (`NODE_MODULE_VERSION 139` vs `148`).
- `better-sqlite3` 12.x is a per-ABI C++ addon. Desktop (Electron ABI) and server/tests (Node ABI) share one build directory, so each run overwrote the other's binary. `desktop:dev` ran `electron-rebuild` on every start.
- 12.x does not compile against Electron 45's V8 (`GetPrototypeV2`, `HolderV2`). 13.0.3 fails the same compile but ships `prebuilds/*.node` (`gypfile: false`), so no compile is needed.
- Volta is no longer maintained. Its `volta` blocks in six `package.json` files were dead configuration.

## Goals

- One Node version (24.22.2) across `.nvmrc`, `Dockerfile` and `engines`, matching the Node bundled in Electron 45.2.3.
- `better-sqlite3` loads unchanged in Node 24, Electron 45 and the server.
- `pnpm desktop:dev` starts without a native rebuild step.
- Typecheck and the desktop test suite stay green.

## Non-goals

- Node 26. No stable Electron bundles it (46 is alpha, 47 is nightly as of 2026-11-07); revisit when one ships.
- Pinning pnpm through a new version manager (mise/fnm migration). Corepack plus the `packageManager` field remains the mechanism.
- Removing `rebuild:native` and the matching `apps/desktop/README.md` lines (52, 72). Tracked as follow-up.
- Fixing the missing `outputs` key for `taotie-desktop#build` in `turbo.json`.

## Design

- `.nvmrc`: `24.22.2`. `Dockerfile`: `node:24.22.2-bookworm-slim`.
- Root and `apps/client` `engines.node`: `>=24.0.0 <25.0.0`. Server and CLI already allowed Node 24 and are unchanged.
- Remove the `volta` blocks from the root, `apps/cli`, `apps/client`, `apps/desktop`, `apps/server` and `packages/shared` `package.json` files.
- `apps/desktop`: `electron` `^45.2.3`, `@types/node` `^24.12.2`, `better-sqlite3` `13.0.3`; `dev` becomes `electron-vite dev`.
- `apps/server`: `better-sqlite3` `^13.0.3`, `@types/node` `^24.12.2`.
- Enable corepack under the active Node (`corepack enable`) so `pnpm` resolves to the pinned 10.28.1 under that Node, not the Homebrew shebang.

## Acceptance

- `node -v` is 24.22.2 and `pnpm -v` is 10.28.1 inside the repo.
- Electron 45.2.3 reports Node 24.22.2 (`ELECTRON_RUN_AS_NODE=1 electron -p process.versions.node`).
- `require('better-sqlite3')` opens an in-memory db in Node 24, Electron 45 and `apps/server`.
- `pnpm --filter taotie-desktop typecheck` passes and `pnpm --filter taotie-desktop test` passes (70 passed, 1 skipped on 2026-11-07).
- `pnpm build` exits 0 (verified 2026-11-07).
- `pnpm desktop:dev` starts and logs `Taotie running on http://127.0.0.1:31415`.
- Full suites on Node 24.22.2 (2026-11-08): client 405/406 on the first run, with the one failure a 5 s timeout under load that passes alone (3/3); CLI 168 passed, 1 skipped; server 4147 passed, 5 skipped, 1 failed. The server failure is the `compression.test.ts` 100 KB performance-budget test, which depends on machine load: it also failed once under Node 22 at load average ~60 and passed on other runs.
- `scripts/dev-bootstrap.sh` accepts Node 24 and `dev-bootstrap.test.mjs` passes (2/2).
- `smoke-mac-package.mjs` now checks `prebuilds/darwin-<arch>.node`. The script itself was not run.
- Not verified: packaged builds (`desktop:dist*`), the auto-updater and the macOS notarize flow on Electron 45. Follow-ups: remove the stale `rebuild:native` script and the `apps/desktop/README.md` rebuild notes; review the `better-sqlite3` rebuild steps in `.github/workflows/desktop-release.yml`.
- Shipped in commit `3ae585f4`.

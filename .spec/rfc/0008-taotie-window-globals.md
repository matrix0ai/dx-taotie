# RFC 0008: Rename desktop window globals from __FREEAPI_* to __TAOTIE_*

**Status:** Draft

## Summary

Rename the five globals the desktop preload script injects into the dashboard window from `__FREEAPI_*__` to `__TAOTIE_*__`, and update every reader. The product is called Taotie; the leftover upstream name leaks into the client code and into any new bridge added later (RFC 0004).

## Problem

`apps/desktop/src/preload/index.ts` defines `window.__FREEAPI_DESKTOP__`, `__FREEAPI_PLATFORM__`, `__FREEAPI_SESSION__`, `__FREEAPI_VERSION__` and `__FREEAPI_UPDATER__`. They are 36 references in 10 files across `apps/client` and `apps/desktop`. The name comes from the upstream FreeLLMAPI project and no longer matches the product.

## Goals

- All five globals are named `__TAOTIE_*__` in the preload script, the main process comments, the client, and the client tests.
- No `__FREEAPI_` text remains in the repository.
- Behavior is unchanged.

## Non-goals

- IPC channel names (`freeapi:*`), the `--freeapi-token=` and `--freeapi-version=` launch arguments, `FREEAPI_*` environment variables, database and log file names. Environment variables are user-facing deployment configuration, so renaming them needs a compatibility plan and is a separate RFC.
- A compatibility alias for the old names. The preload script and the client ship in the same app build, so no client reads the old names after this change.

## Design

Mechanical replacement of the five identifiers in:

- `apps/desktop/src/preload/index.ts`, `apps/desktop/src/main/index.ts`
- `apps/client/src/App.tsx`, `lib/desktop-updater.ts`
- `apps/client/src/components/` : `auth-gate.tsx`, `auth-gate.desktop.test.tsx`, `update-reminder.tsx`, `updates-dialog.tsx`, `keys/copy-key-dialog.tsx`, `keys/export-keys-dialog.tsx`

## Acceptance

- `git grep -n "__FREEAPI_"` returns nothing.
- `git grep -c "__TAOTIE_"` finds the same 36 references.
- Client and desktop test suites pass, including `auth-gate.desktop.test.tsx`; the client typechecks and builds.
- The desktop app starts and serves the dashboard.

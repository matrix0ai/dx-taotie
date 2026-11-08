# Why: main

<!-- reasongraph:v1 generated 2026-11-08 — review before sharing; edit freely, edits are preserved -->

## Intent
Use FreeLLMAPI as Taotie's default model catalog and Premium site, and build and restart the desktop app.

## Decisions

### Set FreeLLMAPI as the default catalog and Premium site
Status: directed
Touches: `apps/server/src/services/catalog-sync.ts`, `apps/server/src/routes/premium.ts`, `docs/en/architecture/05-catalog-sync.md`

The agent changed the catalog default to `https://api.freellmapi.co` and the Premium site default to `https://freellmapi.co`, then updated the architecture documentation to match. An unauthenticated catalog download returned the monthly tier, and its Ed25519 signature verified against Taotie's pinned key.

### Run catalog configuration tests after changing defaults
Status: discussed
Touches: `apps/server/src/services/catalog-sync.test.ts`, `apps/server/src/**/declarative-config.test.ts`

The agent ran the catalog sync and declarative configuration tests to check the default URL changes. The session summary reports 70 passing tests.

### Build and restart the desktop app
Status: directed
Touches: `apps/desktop/*`

The agent stopped the development run it had started and began a full build before relaunching. The recorded session does not confirm build completion or that the restarted app became available.

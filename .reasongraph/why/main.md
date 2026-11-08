# Why: main

<!-- reasongraph:v1 generated 2026-11-08 — review before sharing; edit freely, edits are preserved -->

## Intent
Use FreeLLMAPI as Taotie's default model catalog and Premium site, and build and restart the desktop app.

## Decisions

### Set FreeLLMAPI as the default catalog and Premium site
Status: directed
Touches: `apps/server/src/services/catalog-sync.ts`, `apps/server/src/routes/premium.ts`, `docs/en/architecture/05-catalog-sync.md`

The default catalog API and Premium site now point to FreeLLMAPI. An unauthenticated monthly catalog download returned successfully, and its Ed25519 signature verified against the pinned public key.

Reviewer attention: Confirm Taotie should use the upstream Premium site and catalog service.

### Run catalog configuration tests after changing defaults
Status: directed
Touches: `apps/server/src/__tests__/services/catalog-sync.test.ts`, `apps/server/src/__tests__/services/declarative-config.test.ts`

Both test files passed after the catalog and Premium defaults changed: 70 tests total.

### Build and restart the desktop app
Status: directed
Touches: `apps/desktop/package.json`, `apps/desktop/*`

The repository build completed successfully, then the desktop dev app started and logged that Taotie was running on port 31415.

### Pin Node 24 and move desktop to Electron 45
Status: directed
Touches: `.nvmrc`, `Dockerfile`, `package.json`, `apps/*/package.json`, `apps/desktop/package.json`

The repository was pinned to Node 24.22.2, and Electron was moved to 45.2.3, which bundles Node 24. This aligns the desktop runtime with the selected Node version and updates package engine and type declarations to match.

Risk: Electron 38 to 45 crosses seven major versions; tray, updater, signing, and notarization flows were not verified.

### Use better-sqlite3 13.0.3 without a forced Electron rebuild
Status: discussed
Touches: `apps/desktop/package.json`, `apps/server/package.json`

Version 12.10.0 failed to compile against Electron 45. Version 13.0.3 supplied a prebuilt N-API binary that loaded in Node 24, Electron 45, and the server, so the desktop dev command no longer forces an Electron rebuild.

Risk: The forced source rebuild still failed against Electron 45; compatibility relies on the prebuilt binary.

### Align bootstrap checks with Node 24
Status: discussed
Touches: `scripts/dev-bootstrap.sh`, `scripts/dev-bootstrap.test.mjs`, `package.json`

The bootstrap checks were updated to accept Node.js >=24.0.0 and <25.0.0, matching the project engine range. Bootstrap tests passed after the change.

### Remove the PowerShell bootstrap script
Status: discussed
Touches: `scripts/dev-bootstrap.ps1`, `scripts/dev-bootstrap.test.mjs`, `CONTRIBUTING.md`

The PowerShell bootstrap script and its test and documentation references were removed. The change reduces the supported bootstrap paths; verify Windows setup expectations before relying on this removal.

### Configure DSH TUI profiles through setup-dsh
Status: discussed
Touches: `.spec/rfc/0001-dsh-tui-profile-setup.md`

The CLI must configure the profile that DSH TUI actually reads, because writing only legacy settings leaves the TUI without the Taotie provider. The RFC specifies detecting profiles from their manifests, requiring an explicit profile when matches are ambiguous, and retaining legacy behavior when no TUI profile matches.

### Run root dev command as the desktop app
Status: directed
Touches: `package.json`

The root development command maps to the existing desktop development flow so it opens the Electron app instead of starting the web app. The existing desktop script remains the implementation entry point.

### Use Node 24 through fnm
Status: directed
Touches: `.nvmrc`, `package.json`

Project runtime configuration was changed to Node 24, with fnm used for local runtime selection after Volta was removed. Node 24.22.2 successfully loaded the SQLite native module and served the desktop API.

### Keep existing saved API keys until coordinated rotation
Status: discussed
Touches: `apps/server/src/db/index.ts`

The server returns previously saved unified keys unchanged, while newly generated keys use the Taotie prefix. Changing the stored key would break existing DSH and agent connections, so the existing key was not rotated without updating those clients.

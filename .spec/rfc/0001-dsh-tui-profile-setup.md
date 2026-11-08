# RFC 0001: Auto-detect and configure DSH TUI profiles

**Status:** Approved

## Summary

Update `taotie setup-dsh` to detect current DSH TUI profiles and register Taotie in the profile configuration DSH actually loads. Keep legacy DSH `settings.yaml` setup working. Detection must honor `DSH_HOME`, preserve unrelated profile entries and provider routes, and refuse ambiguous profile selection instead of writing to multiple profiles.

## Problem

The current generator writes provider configuration to `$DSH_HOME/settings.yaml`. Current DSH TUI reads profile overlays from `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, a YAML sequence of loader patch entries. As a result, setup can report success while Taotie remains absent from the TUI model picker. The current machine reproduced this mismatch: DSH migrated the old settings file to `settings.yaml.imported`, while its `dsh-tui` profile remained unchanged.

## Goals

- Auto-detect installed DSH TUI profiles by reading profile manifests and matching the `@deepseek-harness-tui/dsh-tui` bundle, rather than assuming a directory name.
- Write Taotie's `llm-pi-ai` route to the detected profile's `cordis.patch.yml` using DSH's sequence and plugin-config shape.
- Preserve other patch entries, existing provider routes, comments where supported, DSH credentials, and the user's selected default provider/model.
- Keep setup safe to rerun; update only Taotie's route and credential reference.
- Preserve the existing legacy `settings.yaml` behavior when no TUI profile is detected.
- Preview all changes through existing `--dry-run` flow and retain atomic writes, backups, and mode `0600` for secrets.

## Non-goals

- Change Taotie routing or gateway APIs.
- Install, update, or launch DSH or its TUI bundle.
- Switch the user's default DSH model automatically.
- Repair malformed unrelated DSH profiles or migrate all DSH configuration formats.
- Add support for other DSH profile plugins or other harnesses.

## Design

### Detection and selection

Resolve DSH home as `DSH_HOME` when set, otherwise `<homeDir>/.dsh`. Inspect profile `package.json` files under `profiles/` and parse `dsh.profile.bundles`. A profile matches when its bundle list includes `@deepseek-harness-tui/dsh-tui`.

When exactly one profile matches, select it automatically. When multiple profiles match, stop before writes and list their names with guidance to pass a new `--dsh-profile <name>` option. When an explicit `--dsh-profile` is given, require that profile to exist and match the TUI bundle. When no profile matches, retain legacy `settings.yaml` generation. Keep existing `--profile` semantics for naming Taotie routes.

### Configuration and credentials

For TUI profiles, parse `cordis.patch.yml` as a top-level YAML array. Merge one entry with `id: llm-pi-ai`; preserve its other configuration and provider routes, then add or update Taotie's provider using the live catalog, `api: openai-completions`, gateway `baseURL`, and `apiKeyEnv: TAOTIE_API_KEY`. Preserve all other patch entries. Do not add or replace `dsh-tui`'s default-model entry, so selection remains user-owned.

Continue storing `TAOTIE_API_KEY` in `$DSH_HOME/.env` with existing merge, backup, and `0600` behavior. DSH's credential resolver reads this fallback. A malformed profile patch, invalid manifest, or ambiguous target must fail before any file is written.

### Code and documentation areas

- `apps/cli/src/index.ts`: parse `--dsh-profile`, resolve the DSH target before generating files, and preserve existing `--profile` behavior.
- `apps/cli/src/tools.ts`: represent both legacy and TUI outputs from the same discovered catalog and Taotie route.
- `apps/cli/src/config-files.ts`: add a sequence-aware merge for DSH profile patches while retaining two-phase planning, backups, atomic replacement, and dry-run output.
- `apps/cli/src/tools.test.ts`, `apps/cli/src/config-files.test.ts`, and `apps/cli/src/index.test.ts`: cover generated route shape, safe keyed merge, detection, ambiguity, explicit selection, legacy fallback, and no-write failures.
- `apps/cli/README.md`: document automatic detection, `--dsh-profile`, legacy fallback, and dry-run behavior.

## Acceptance

- With one TUI profile whose manifest contains the TUI bundle, `taotie setup-dsh` updates that profile's `cordis.patch.yml`; its composed config contains Taotie and all discovered models.
- With multiple matching profiles, setup writes nothing and names each candidate; `--dsh-profile` selects only the requested profile.
- With no matching TUI profile, current legacy DSH setup still writes compatible `settings.yaml` and `.env` files.
- Existing patch entries and non-Taotie providers survive setup and reruns; Taotie's route updates when the live catalog changes.
- Malformed YAML, invalid matching profile manifests, missing explicit profile, and ambiguous detection fail before writing either profile config or credentials.
- `--dry-run` shows both profile and credential changes without modifying files; secret values never appear in output; sensitive files remain mode `0600`.
- Focused CLI tests pass, and manual DSH `--dump-config` confirms the provider route in the selected TUI profile.

# RFC 0007: Default catalog and Premium endpoints to freellmapi.co

**Status:** Draft

## Summary

Point the default model-catalog sync and the Premium page links at the upstream FreeLLMAPI service (`https://api.freellmapi.co` and `https://freellmapi.co`) instead of `taotie.conouch.io`. Taotie does not operate a catalog service, and the catalog signature is verified against a pinned key that only the upstream catalog host holds. The implementation exists in the working tree and is uncommitted.

## Problem

- `catalog-sync.ts` defaulted `CATALOG_BASE_URL` to `https://api.taotie.conouch.io` and `premium.ts` defaulted `PREMIUM_SITE_URL` to `https://taotie.conouch.io`. These were rebrand substitutions from upstream `tashfeenahmed/freellmapi`.
- `PINNED_CATALOG_PUBKEY` in Taotie is byte-identical to upstream's. Per the upstream docs, the private half never left the upstream catalog host. A catalog served from any other host is rejected unless that host forwards upstream's signed bytes.
- Premium licenses (`fla_` keys, $19/year or $49 lifetime per the upstream README) are issued through upstream's Stripe. A Taotie domain that does not forward cannot activate them.
- Taotie's maintainers do not maintain a catalog.

## Goals

- A default install syncs the free monthly catalog from the host that signs it.
- Premium activation, billing portal and key-recovery links resolve to the service that issues keys.

## Non-goals

- Running or mirroring a catalog service, or changing the pinned key.
- Rewording the README, install scripts, `SECURITY.md`, `docs/index.html` and other docs that link `taotie.conouch.io` for non-catalog purposes.
- Applying a catalog to a user's database. Sync stays automatic or user-triggered.

## Design

- `apps/server/src/services/catalog-sync.ts`: `DEFAULT_BASE_URL` becomes `https://api.freellmapi.co`.
- `apps/server/src/routes/premium.ts`: default `PREMIUM_SITE_URL` becomes `https://freellmapi.co`.
- `docs/en/architecture/05-catalog-sync.md`: the `CATALOG_BASE_URL` default row matches.
- `CATALOG_BASE_URL`, `CATALOG_PUBKEY` and `PREMIUM_SITE_URL` stay as overrides for a self-hosted catalog.
- Callers of `catalogBaseUrl()`: `/v1/latest`, `/v1/license/activate`, `/v1/license/check` (catalog-sync) and `/v1/portal` (premium).

## Acceptance

- An unauthenticated `GET https://api.freellmapi.co/v1/latest` returns HTTP 200 with a signature that verifies against `PINNED_CATALOG_PUBKEY` (verified 2026-11-08: tier `monthly`, version `2026.11.07.3db98c`, 450 models, 136 quirks).
- `catalog-sync.test.ts` and `declarative-config.test.ts` pass (70 tests on 2026-11-07).
- The Premium page's pricing and manage links use `freellmapi.co`.
- Not yet verified: a full sync applied to a database from the new default, and key activation with a purchased `fla_` key.
- Open: the Premium terms are upstream's. Confirm with the project owner that routing Taotie users to a third-party paid service is intended.

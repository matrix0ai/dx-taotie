# RFC 0005: Live Request and Routing Monitor (child of 0002)

**Status:** Draft

**Parent:** [0002](0002-taotie-app-operator-workflow.md)

## Summary

Add a live Monitor view to the Taotie dashboard that refreshes recent gateway requests and exposes their client, requested/selected model, provider route, result, latency, token counts, and fallback attempts. Reuse existing analytics request and detail APIs; keep prompt and credential contents out of the view.

## Problem

Analytics already contains an aggregate dashboard and recent-call table, and Logs polls every three seconds. Operators still lack one continuously refreshing view centered on each request and its route/fallback trace. The analytics page does not poll recent calls, so it can show stale traffic while the server continues handling requests.

## Goals

Add a Monitor navigation entry with a recent-request table that refreshes every three seconds while visible. Each row shows client, requested and selected model when they differ, provider, status, elapsed time, tokens, and attempt count. Opening a request shows its existing failover ladder detail. Existing analytics aggregations and Logs page remain intact.

## Non-goals

Persistent distributed tracing, exporting to external observability systems, recording prompt/response bodies, changing request storage schemas, and replacing Analytics or Logs are out of scope.

## Design

Build the Monitor page from `GET /api/analytics/requests` and `GET /api/analytics/requests/:id` in `apps/server/src/routes/analytics.ts`. Use the existing three-second polling cadence and stop background polling when the page is hidden. Add navigation/localization and a focused request detail view in `apps/client`. Add a new server endpoint or schema field only if the existing request and attempt payload cannot provide the requested route information; keep any such addition minimal and backward compatible.

## Acceptance

Generate successful and failed requests through the local gateway and verify they appear in Monitor within one polling interval. Confirm rows distinguish requested from selected model, show actual provider and fallback count, and open the existing attempt trace. Confirm pausing/visibility stops polling, Analytics and Logs still load, and no prompt or credential material appears.

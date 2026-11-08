# RFC 0003: Configurable Server and Web UI Ports (child of 0002)

**Status:** Draft

**Parent:** [0002](0002-taotie-app-operator-workflow.md)

## Summary

Allow operators to choose the local Vite dashboard port with `VITE_PORT`, while keeping the existing `PORT` variable dedicated to the Taotie server. Preserve current defaults and make `pnpm dev` proxy the dashboard to the selected server port.

## Problem

The server already reads `PORT` and defaults to 3001, but the Vite server hard-codes port 5203. Operators can move the backend while the dashboard URL remains fixed, and `pnpm dev -- --port ...` does not provide one reliable port contract across the concurrent processes.

## Goals

`PORT` continues to select the backend port, defaulting to 3001. `VITE_PORT` selects the dashboard dev-server port, defaulting to 5203. Both values work through the root `pnpm dev` command, and the dashboard proxy targets the selected backend port.

## Non-goals

Production Electron port selection, changing the server's existing `PORT` contract, port discovery, and automatic fallback to a different occupied port are out of scope.

## Design

Update `apps/client/vite.config.ts` to read and validate `VITE_PORT` for `server.port`, retaining `strictPort`. Keep `PORT` as the server address injected into the client for proxy requests. Document the two variables in the development guide. Root scripts need no wrapper; environment variables already reach both concurrent commands.

## Acceptance

With no overrides, `pnpm dev` keeps server port 3001 and dashboard port 5203. With `PORT=3011 VITE_PORT=5211 pnpm dev`, the server binds 3011, the dashboard binds 5211, and dashboard API calls reach port 3011. An occupied selected dashboard port fails clearly without silently binding another port. Existing `PORT`-only startup remains compatible.

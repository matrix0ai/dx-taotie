# RFC 0004: Configure Local Agents from Taotie Desktop (child of 0002)

**Status:** Draft

**Parent:** [0002](0002-taotie-app-operator-workflow.md)

## Summary

Add an explicit Configure action for supported coding agents in the Taotie desktop app. The desktop host reuses Taotie's existing per-agent setup generators and safe file writer to merge gateway settings into the current user's agent configuration; the web dashboard keeps its copy-command flow.

## Problem

The Agents page currently displays copyable setup commands. Those commands work, but users must leave the desktop app and run the Taotie CLI themselves. A browser cannot safely write host files; the Electron main process can, but its preload currently exposes no agent-configuration API.

## Goals

The desktop app lists supported agents and lets the user choose Configure. The main process validates the tool id, obtains the current gateway URL and unified API key, calls the existing Taotie setup generator, and applies its merged files with backups and existing secret-file permissions. Existing model and profile choices remain user-owned.

## Non-goals

Installing or upgrading third-party agent applications, silently configuring agents without a user action, remote configuration, web-browser filesystem access, and changing the CLI's configuration formats are out of scope.

## Design

Add a narrow `taotie:configure-agent` IPC method in `apps/desktop/src/main` and expose only that method through `apps/desktop/src/preload`. The renderer sends a catalog tool id and optional profile/model choices. The main process resolves gateway credentials locally, validates the id against the shared tool catalog, and invokes the same generator and two-phase writer used by the CLI. Add desktop dependency/API exports only as needed to reuse these modules. Show per-agent completion or error status in the existing Agents page. Never send filesystem paths or the unified key to arbitrary renderer calls; the UI may show the existing masked/copy key flow separately.

## Acceptance

On macOS, configuring one supported agent from the desktop app writes the same merged configuration as its equivalent `taotie setup-*` command and creates a backup when replacing an existing file. Existing provider settings survive. Invalid tool ids and write failures produce visible errors and do not report success. The web Agents page still offers its existing CLI copy commands, and secret values do not appear in logs or renderer IPC results.

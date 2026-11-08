# RFC 0002: Taotie App Operator Experience (Umbrella)

**Status:** Draft

**Type:** Umbrella

## Summary

This umbrella tracks three operator gaps in the Taotie app: configurable local web ports, direct configuration of supported agents from the desktop app, and a live view of requests and routing decisions. Existing server port configuration, CLI setup commands, analytics, and logs remain the foundation; children define only the missing behavior.

## Problem

The requested work crosses independent boundaries: Vite startup configuration, Electron-to-host configuration writes, and request observability. Separate RFCs keep each contract reviewable while giving the operator workflow one completion target.

## Goals

All three child RFCs are implemented and their acceptance checks pass. The existing CLI agent setup and analytics behavior remain compatible.

## Non-goals

Provider routing behavior, gateway protocol changes, agent installation or upgrades, remote host configuration, and a redesign of existing analytics are outside this umbrella.

## Children

| RFC | Concern |
|-----|---------|
| [0005](0005-live-request-routing-monitor.md) | Live Request and Routing Monitor |
| [0004](0004-desktop-agent-autoconfiguration.md) | Configure Local Agents from Taotie Desktop |
| [0003](rejected/0003-configurable-app-ports.md) | Configurable Server and Web UI Ports |

## Acceptance

The umbrella may close when every listed child is Implemented and its validation passes. New operator requests require a new RFC or umbrella; this one stays closed.

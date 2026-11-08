# DSH TUI auto-detection

## Feature playbook

- [x] `how` over the affected subsystem.
- [x] `architect` for parallel design exploration.
- [x] Write the throughput checkpoint as four todo items.
- [x] Delegate code-writing to a subagent with a specific scope.
- [ ] Verify on the matching surface.
- [ ] Rebase into small, ordered commits.
- [ ] If the design is contested, interrogate before shipping.
- [ ] Run Opening a PR.

## Throughput checkpoint

- Blocking first steps. RFC 0001 approved; source and current DSH config shape inspected.
- Independent workstreams. n/a: profile detection, patch merge, and CLI generation share one DSH setup path and must stay serialized.
- Shared mutable state. Single owner edits CLI sources and tests; no shared files written concurrently.
- Smallest safe decomposition. One owner; no independent code workstream justifies delegation.

## Architect phases

- [x] Ground.
- [x] Sketch.
- [x] Agree.
- [ ] Implement.
- [ ] Scrap.

## Acceptance

- [ ] One TUI profile is detected from its bundle manifest and configured.
- [ ] Multiple profiles refuse writes until `--dsh-profile` selects one.
- [ ] No TUI profile preserves legacy DSH output.
- [ ] Patch merge preserves unrelated entries and is idempotent.
- [ ] Dry-run and malformed-input behavior pass focused checks.

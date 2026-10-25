#!/usr/bin/env bash
# The Taotie installer moved to https://taotie.conouch.io/install.sh
# This shim keeps old `curl ... github.io ... | bash` one-liners working.
set -euo pipefail
exec bash -c "$(curl -fsSL https://taotie.conouch.io/install.sh)"

[English](../../en/cli/OVERVIEW.md) · **简体中文**

# CLI 域 —— 概览与文件索引

## 范围

本域文档记录 Taotie 安装 CLI（`cli/`）—— 通过 `npx taotie` 一键将编程智能体接入本地网关的生成器集合。每个生成器（`setup-claude`、`setup-codex` 等）都会拉取实时目录、备份已有配置、绝不覆盖无关键，并为 `taotie launch` / `launch-codex` 零持久化启动器以及 `taotie doctor` 记录 `tools.json` 元数据。

权威来源：[`apps/cli/src/tools.ts`](../../../apps/cli/src/tools.ts)（全部 `Xxx()` 生成器函数）、[`apps/cli/tools.json`](../../../apps/cli/tools.json)（注册表）、[`apps/cli/src/config-files.ts`](../../../apps/cli/src/config-files.ts)（合并 + `0600` + 带时间戳备份）、[`apps/cli/README.md`](../../../apps/cli/README.md)、[`apps/client/src/data/agent-tools.json`](../../../apps/client/src/data/agent-tools.json)。

关于按智能体的一对一接入配方与 MCP/无头客户端的说明，见[客户端与编程智能体](../clients/OVERVIEW.md)。关于 CLI 注入的环境变量（`TAOTIE_API_KEY`、`TAOTIE_MODEL`），见 [env/](../env/OVERVIEW.md)。

## 文件索引

| 文件 | 说明 |
| --- | --- |
| [01-generators.md](01-generators.md) | 全部 `setup-*` 生成器（claude/codex/cline/continue/aider/opencode/goose/qwen/roo/kilo/crush/cursor/dsh/mimo/atomcode/generic）、目标文件、合并行为、`--model` 解析以及 `launch`/`launch-codex`/`doctor` 命令。 |
| [02-config-files.md](02-config-files.md) | 配置文件层：`tools.json` 注册表、`config-files.ts` 合并策略（JSON/TOML/YAML）、`0600` 权限、带时间戳备份、`--dry-run` 以及如何新增生成器。 |
| [CHANGELOG.md](CHANGELOG.md) | 本域文档修订历史。 |

## 导航

- ← [文档根目录](../README.md)
- ↑ [文档索引](../OVERVIEW.md)

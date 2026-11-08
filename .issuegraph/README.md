# IssueGraph - AI-Native Issue Tracking

Welcome to IssueGraph! This repository uses **IssueGraph** for issue tracking - a modern, AI-native tool designed to live directly in your codebase alongside your code.

## What is IssueGraph?

IssueGraph is issue tracking that lives in your repo, making it perfect for AI coding agents and developers who want their issues close to their code. No web UI required - everything works through the CLI and integrates seamlessly with git.

**Learn more:** [github.com/borg0ai/dx-issuegraph](https://github.com/borg0ai/dx-issuegraph)

## Quick Start

### Essential Commands

```bash
# Create new issues
issuegraph create "Add user authentication"

# View all issues
issuegraph list

# View issue details
issuegraph show <issue-id>

# Update issue status
issuegraph update <issue-id> --claim
issuegraph update <issue-id> --status done

# Sync with Dolt remote
issuegraph dolt push
```

### Working with Issues

Issues in IssueGraph are:
- **Git-native**: Stored in Dolt database with version control and branching
- **AI-friendly**: CLI-first design works perfectly with AI coding agents
- **Branch-aware**: Issues can follow your branch workflow
- **Sync-ready**: Uses Dolt remotes for backup and team sharing

## Why IssueGraph?

✨ **AI-Native Design**
- Built specifically for AI-assisted development workflows
- CLI-first interface works seamlessly with AI coding agents
- No context switching to web UIs

🚀 **Developer Focused**
- Issues live in your repo, right next to your code
- Works offline, syncs when you push
- Fast, lightweight, and stays out of your way

🔧 **Git Integration**
- Dolt-native sync via issuegraph dolt push / issuegraph dolt pull
- Branch-aware issue tracking
- Dolt-native three-way merge resolution

## Get Started with IssueGraph

Try IssueGraph in your own projects:

```bash
# Install IssueGraph (macOS: Homebrew, Linux: Nix, Windows: Scoop)
brew install systembugtj/luban-homebrew/issuegraph

# Initialize in your repo
issuegraph init

# Create your first issue
issuegraph create "Try out IssueGraph"
```

## Learn More

- **Documentation**: [github.com/borg0ai/dx-issuegraph/docs](https://github.com/borg0ai/dx-issuegraph/tree/main/docs)
- **Quick Start Guide**: Run `issuegraph quickstart`
- **Examples**: [github.com/borg0ai/dx-issuegraph/examples](https://github.com/borg0ai/dx-issuegraph/tree/main/examples)

---

*IssueGraph: Issue tracking that moves at the speed of thought* ⚡

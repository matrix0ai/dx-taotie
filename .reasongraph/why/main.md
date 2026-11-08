# Why: main

<!-- reasongraph:v1 generated 2026-11-08 — review before sharing; edit freely, edits are preserved -->

## Intent
Use FreeLLMAPI as Taotie's default model catalog and Premium site, and build and restart the desktop app.

## Decisions

### Set FreeLLMAPI as the default catalog and Premium site
Status: directed
Touches: `apps/server/src/services/catalog-sync.ts`, `apps/server/src/routes/premium.ts`, `docs/en/architecture/05-catalog-sync.md`

The default catalog API and Premium site now point to FreeLLMAPI. An unauthenticated monthly catalog download returned successfully, and its Ed25519 signature verified against the pinned public key.

Reviewer attention: Confirm Taotie should use the upstream Premium site and catalog service.

### Run catalog configuration tests after changing defaults
Status: directed
Touches: `apps/server/src/__tests__/services/catalog-sync.test.ts`, `apps/server/src/__tests__/services/declarative-config.test.ts`

Both test files passed after the catalog and Premium defaults changed: 70 tests total.

### Build and restart the desktop app
Status: directed
Touches: `apps/desktop/package.json`, `apps/desktop/*`

The repository build completed successfully, then the desktop dev app started and logged that Taotie was running on port 31415.

### Pin Node 24 and move desktop to Electron 45
Status: directed
Touches: `.nvmrc`, `Dockerfile`, `package.json`, `client/package.json`, `server/package.json`, `cli/package.json`

The repository pins Node to 24.22.2, constrains root and client engines to Node 24, and moves the desktop app to Electron 45.2.3, which bundles Node 24.22.2. This aligns the shell and desktop runtimes.

### Use better-sqlite3 13.0.3 without a forced Electron rebuild
Status: discussed
Touches: `package.json`, `client/package.json`

The Electron rebuild reported compilation errors, while the installed prebuilt binary loaded in Electron 45. The development command therefore drops the rebuild step so startup does not fail on that step.

### Align bootstrap checks with Node 24
Status: discussed
Touches: `scripts/dev-bootstrap.sh`, `scripts/dev-bootstrap.test.mjs`, `package.json`

The bootstrap checks were updated to accept Node.js >=24.0.0 and <25.0.0, matching the project engine range. Bootstrap tests passed after the change.

### Remove the PowerShell bootstrap script
Status: discussed
Touches: `scripts/dev-bootstrap.ps1`, `scripts/dev-bootstrap.test.mjs`, `CONTRIBUTING.md`

The PowerShell bootstrap script and its test and documentation references were removed. The change reduces the supported bootstrap paths; verify Windows setup expectations before relying on this removal.

### Configure DSH TUI profiles through setup-dsh
Status: discussed
Touches: `.spec/rfc/0001-dsh-tui-profile-setup.md`

The CLI must configure the profile that DSH TUI actually reads, because writing only legacy settings leaves the TUI without the Taotie provider. The RFC specifies detecting profiles from their manifests, requiring an explicit profile when matches are ambiguous, and retaining legacy behavior when no TUI profile matches.

### Run root dev command as the desktop app
Status: directed
Touches: `package.json`

The root development command maps to the existing desktop development flow so it opens the Electron app instead of starting the web app. The existing desktop script remains the implementation entry point.

### Use fnm Node 24
Status: directed
Touches: `~/.zshrc`, `~/.profile`

The agent chose fnm to support per-project Node versions, with Node 24 as the default and Node 22 also installed. Shell startup configuration initializes fnm and removes Volta entries. The `~/.volta` directory itself was left in place.

### Keep existing saved API keys until coordinated rotation
Status: discussed
Touches: `~/.dsh/.env`

The agent found the configured local API key in the dsh environment file and confirmed it worked against the local endpoint. The key was left unchanged.

### Use Birdify for project mapping checks
Status: discussed
Touches: `.birdify/*`, `architecture JSON`

现有仓库没有可复用的 Birdify 地图或架构 JSON，因此代理决定基于当前根目录构建地图并核对约束。该工作不修改业务代码或 RFC 状态。

Considered/rejected: 复用现有地图；仓库中没有可复用地图。

### Configure OpenAI-compatible providers in the dsh profile patch
Status: discussed
Touches: `~/.dsh/profiles/dsh-tui/cordis.patch.yml`

The agent identified the profile patch as the place for OpenAI-compatible provider settings, including the base URL, model definitions, and environment-variable name for the API key. The configured local endpoint and key were confirmed to work; the key value is omitted.

### Use fnm Node 24 to fetch Birdify CLI
Status: agent-initiated — transcript does not show this approach being discussed
Touches: `Birdify CLI invocation`

代理避开仍指向 Volta shim 的 `birdify` 命令，改用 fnm Node 24 下的 `npx` 获取 CLI。下载尚未返回，因此执行结果未确认。

Considered/rejected: 直接运行 `birdify`；命令仍指向 Volta shim。

### Reorganize applications under apps and shared code under packages
Status: discussed
Touches: `apps/*`, `packages/shared/*`

Application directories were moved under apps and shared code under packages/shared to establish the monorepo layout.

### Preserve container data path during source reorganization
Status: discussed
Touches: `Dockerfile`

The image reads source from apps while retaining /app/server/data inside the container, preserving compatibility with existing data volumes.

### Render generated icons from SVG
Status: discussed
Touches: `gen-icons.mjs`

The icon generator now renders from SVG through sharp because its previous hand-drawn shapes would overwrite the new brand artwork.

### Rename product branding to Taotie
Status: discussed
Touches: `README*`, `docs/*`, `.env.example`, `.github/RELEASE_TEMPLATE.md`, `apps/desktop/package.json`, `apps/server/src/*`

Brand references and the premium site default were updated to Taotie; the site URL remains overridable through PREMIUM_SITE_URL.

### Set Taotie bundle identifier
Status: discussed
Touches: `apps/desktop/*`

The desktop bundle identifier was changed to me.systembug.taotie to match the rebranded application.

### Update workflow paths after directory reorganization
Status: discussed
Touches: `.github/workflows/*`

工作流中的路径引用随目录搬迁更新，使发布和 Docker 流程继续指向新的 apps/ 与 packages/ 布局。

### Repair documentation links after directory reorganization
Status: discussed
Touches: `docs/*`, `README*`

Documentation links were repaired after the directory move, addressing 108 broken links.

### Keep historical changelog unchanged
Status: discussed
Touches: `CHANGELOG`

Historical changelog content was restored after an unintended edit so the reorganization would not rewrite release history.

### Register frontend and backend ports
Status: discussed
Touches: `spark/port.md`

The port registry records Vite on 5203 and the backend on 3001 so local services have stable assignments.

### Point origin remote to Taotie repository
Status: discussed
Touches: `.git/config`

The origin remote now targets the repository path selected for the rebranded project. No push was performed.

### Update project registry repository path
Status: discussed
Touches: `spark/project.md`

The project registry Git path was aligned with the configured origin remote.

### Do not change existing domain links
Status: discussed
Touches: `apps/server/src/lib/catalog-sync.ts`

The catalog synchronization API default remains unchanged because it points to the sync backend rather than the website; changing it without a replacement endpoint could break synchronization.

### Leave branding screenshots for later recapture
Status: discussed
Touches: `repo-assets/*`

Existing repository screenshots still show the old branding and remain to be recaptured.

### Apply the registered Vite port in client configuration
Status: discussed
Touches: `apps/client/vite.config.ts`, `CONTRIBUTING.md`

The client reads `VITE_PORT` for its development-server port and keeps 5203 as the default. This preserves existing local startup behavior while allowing the dashboard port to change independently from backend `PORT`. The value is validated as an integer from 1 to 65535, and invalid values fail with an explicit error.

### Close RFCs 0006 and 0007 as Implemented
Status: discussed
Touches: `.spec/rfc/0006-node24-electron45-toolchain.md`, `.spec/rfc/0007-catalog-freellmapi-endpoint.md`, `.spec/rfc/completed/*`

Both RFCs were advanced to Implemented, archived under `completed/`, and passed `sync-check`. Their acceptance notes record validation limits: the server suite had one load-sensitive timing failure, and packaged builds and some catalog flows remained unverified.

### Commit the Node 24, Electron 45, and catalog default changes
Status: discussed
Touches: `.nvmrc`, `Dockerfile`, `CONTRIBUTING.md`, `README.md`, `apps/cli/package.json`, `apps/client/package.json`, `apps/desktop/package.json`, `apps/desktop/scripts/smoke-mac-package.mjs`, `apps/server/package.json`, `packages/shared/package.json`, `.github/workflows/desktop-release.yml`, `pnpm-workspace.yaml`, `package.json`

Commit `3ae585f4` bundled the toolchain pin, desktop runtime upgrade, catalog default, bootstrap cleanup, and package smoke-path correction. The stated intent was to keep the commit scoped to task files while retaining unrelated working-tree edits.

### Close RFCs 0006 and 0007
Status: discussed
Touches: `.spec/rfc/0006-node24-electron45-toolchain.md`, `.spec/rfc/0007-catalog-freellmapi-endpoint.md`

A lifecycle commit was intended to contain only RFC updates, but the resulting commit `b3f9b038` included 42 files, 36 outside `.spec/`. The extra files included CLI edits, generated configuration, hooks, and other working-tree changes; the cause was not confirmed. The RFC change was pushed to `origin/main`.

### Do not rewrite main after the oversized RFC commit
Status: discussed
Touches: `main`

History exposure from commit `b3f9b038` remains because rewriting `main` was not authorized. Follow-up commit `20d3c05d` removes the extra files from the current tree, but does not erase them from history.

### Use SVG sources for generated app icons
Status: discussed
Touches: `apps/desktop/build/icon.svg`, `apps/desktop/build/icon.png`, `apps/desktop/build/icon.icns`, `apps/desktop/resources/icon.png`, `scripts/gen-icons.mjs`

以 `icon.svg` 作为桌面主图标矢量源，并通过生成脚本产出位图和图标包，方便保持各格式一致。

### Keep border ornament clear of rounded corners
Status: discussed
Touches: `apps/desktop/build/icon.svg`

回纹限制在圆角之间的直边区域，避免圆角裁切纹样；兽面居中并保留边距，减少角、嘴和脸颊贴边或被裁的风险。

### Simplify facial details in the main icon
Status: discussed
Touches: `apps/desktop/build/icon.svg`

移除容易形成斑点或镜像接缝的螺旋和嘴部竖线；鼻孔、獠牙和角尖改用更清晰的实心形状，以提升图标辨识度。

### Design tray artwork for each target size
Status: discussed
Touches: `apps/desktop/build/tray-template-16.svg`, `apps/desktop/build/tray-template.svg`, `apps/desktop/build/tray-color.svg`, `apps/desktop/resources/trayTemplate.png`, `apps/desktop/resources/trayTemplate@2x.png`, `apps/desktop/resources/tray.png`, `apps/desktop/resources/tray.ico`

macOS 的 16px 与 32px 模板图标分别按目标尺寸绘制，避免缩小大图造成模糊；Linux 与 Windows 使用黑色圆角底上的骨白兽面，彩色版瞳孔使用朱红。

### Render Windows ICO frames directly from vector artwork
Status: discussed
Touches: `apps/desktop/build/tray-color.svg`, `apps/desktop/resources/tray.ico`

Windows ICO 包含 16、20、24、32、40、48、64 共七个尺寸，各帧直接从矢量图渲染，避免由单个位图缩放造成的模糊。

### Use the new brand mark across client entry points
Status: discussed
Touches: `apps/client/**/brand-mark.tsx`, `apps/client/**`

新增品牌标志组件，并用于仪表盘页头及两个登录页，替换旧的小圆点标识，使这些入口与新版图标一致。

### Replace website links with Taotie domain
Status: directed
Touches: `README*`, `docs/**`, `.env.example`, `.github/RELEASE_TEMPLATE.md`, `apps/desktop/package.json`, `apps/server/**`

The agent updated website, documentation, installation, and premium-site defaults to use the new Taotie domain. The premium-site setting remains overridable through `PREMIUM_SITE_URL`.

### Keep catalog sync API endpoint unchanged
Status: discussed
Touches: `apps/server/**/catalog-sync.ts`

The agent kept the existing catalog sync API host because it serves the backend used for catalog synchronization, not the website. Changing it without a replacement API host would break synchronization.

### Build Docker image through Compose
Status: discussed
Touches: `docker-compose.yml`

The agent kept a Compose `build:` configuration so `docker compose up --build` can build and start the application locally. A container run returned HTTP 200 for both `/api/ping` and the dashboard.

### Remove mistakenly committed files in a follow-up commit
Status: discussed
Touches: `.spec/`, `apps/cli/`, `opencode.json`, `.github/RELEASE_TEMPLATE.md`, `package.json`, `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, `.codex/*`, `.cursor/*`, `.audit/*`

A follow-up commit restored the tree to the intended implementation plus RFC changes, while preserving working-tree edits. The earlier commit still contains unrelated files in repository history.

### Leave IssueGraph hooks and configuration enabled
Status: directed
Touches: `.git/hooks/*`, `.issuegraph/*`, `.codex/*`

The hooks and configuration remain enabled because disabling IssueGraph was not authorized.

### Commit cleanup without bypassing hooks
Status: discussed
Touches: `.spec/`, `.git/hooks/*`

The cleanup was committed through normal hooks after a policy hook blocked the bypass option.

### Push and verify the cleanup commit
Status: discussed
Touches: `apps/client/src/App.tsx`, `apps/client/src/components/auth-gate.desktop.test.tsx`, `apps/client/src/components/auth-gate.tsx`, `apps/client/src/components/keys/copy-key-dialog.tsx`, `apps/client/src/components/*`, `apps/desktop/src/preload/index.ts`, `.spec/rfc/0008-taotie-window-globals.md`

The agent pushed the commit and fetched `origin/main` until it confirmed the commit was an ancestor of the remote branch, providing evidence that the rename reached the shared branch.

### Keep the local ReasonGraph hook commit unpushed
Status: discussed
Touches: `.spec/*`

Local `main` contains unpushed commit `0ea49acc`; it was left unpushed. The working tree retains 11 modified, unstaged files.

### Link the profile-installed dsh-tui commands into the user bin
Status: discussed
Touches: `~/.local/bin/dsh-tui`, `~/.local/bin/dst`, `~/.dsh/profiles/dsh-tui/node_modules/.bin/*`

Global installation of the TUI package failed because an upstream dependency version could not be resolved. The agent linked the profile-installed `dsh-tui` and `dst` executables into the user bin so they could be found on PATH.

### Install the dsh engine globally
Status: discussed
Touches: `~/Library/pnpm/dsh`, `~/.npm-global/bin/dsh`

The TUI requires the `dsh` engine to load its profile bundle. The agent installed the current engine globally, but its version was incompatible with the installed TUI bundle, so profile loading still failed.

### Close RFC 0001 after committing and pushing its implementation
Status: directed
Touches: `.spec/rfc/0001*`, `.spec/rfc/completed/`

RFC 0001 was archived as Implemented after its implementation commit was pushed and acceptance checks were completed.

### Validate DSH profile setup against a temporary home
Status: discussed
Touches: `apps/cli/`

Validation used a temporary profile and throwaway catalog server, avoiding changes to the real DSH home and keeping the API key out of the patch. The CLI suite passed 168 tests, with 1 skipped.

### Commit only the intended CLI implementation files
Status: discussed
Touches: `apps/client/src/App.tsx`, `apps/client/src/components/auth-gate.desktop.test.tsx`, `apps/client/src/components/auth-gate.tsx`, `apps/client/src/components/keys/copy-key-dialog.tsx`, `apps/client/src/components/*`, `apps/desktop/src/preload/index.ts`, `.spec/rfc/0008-taotie-window-globals.md`

The agent staged the rename implementation and RFC files while excluding generated Birdify output and ReasonGraph and IssueGraph state. It rechecked the staged paths before committing so unrelated hook-generated files would not enter the change.

### Pin DSH to a version supported by the TUI plugin
Status: discussed
Touches: `~/.dsh/profiles/dsh-tui/package.json`

The installed TUI plugin version accepts only a specific set of engine boot-package versions, and the installed engine falls outside that set. Downgrading the engine to a listed compatible release was recommended while leaving the plugin unchanged; this change was not performed.

### Keep the DSH API key in its DSH environment file
Status: discussed
Touches: `~/.dsh/.env`, `~/.dsh/profiles/dsh-tui/cordis.patch.yml`, `~/.zshrc`

The provider configuration reads its API key through an environment variable, and DSH loads that variable from its own environment file. Keeping the key there limits its availability to DSH; the shell configuration was left unchanged. A local models endpoint request returned HTTP 200.

### Leave PM2 uninstalled
Status: directed
Touches: `~/.volta/bin`

PM2 appeared among commands from the retired Volta installation, but no current need to manage background processes was established. It was therefore excluded from restoration.

### Retain the Volta directory pending safe cleanup
Status: discussed
Touches: `~/.volta`, `~/.zshrc`, `~/.profile`

Volta startup configuration was removed from the shell files, while the Volta directory was retained because deleting it is irreversible and running processes may still depend on it.

### Do not merge upstream
Status: discussed
Touches: `.git/config`

The upstream repository was not merged because the directory reorganization would produce extensive conflicts. Future upstream synchronization remains unsupported by this change.

### Work on main directly
Status: directed
Touches: `.git/HEAD`

The reorganization and rebrand were completed on main rather than a feature branch.

### Document separate backend and Vite development ports
Status: discussed
Touches: `CONTRIBUTING.md`

The development guide uses the current `pnpm dev:lan` command and documents `PORT` and `VITE_PORT` overrides. This keeps instructions aligned with the current root script and makes the two port settings clear.

### Generate Birdify architecture map and HTML
Status: discussed
Touches: `.birdify/architecture.html`, `.birdify/architecture.json`

生成架构地图 HTML 和 JSON，覆盖桌面宿主、Dashboard、服务端 API、路由、请求历史、CLI 与上游模型服务。校验结果为 7 个模块、9 条关系。

Risk: 约束图和浏览器内视觉检查尚未完成。

### Use cached Birdify CLI when npx stalls
Status: discussed
Touches: `.birdify/*`

The `npx` validation command stalled, so the agent chose a cached CLI entry point to validate the generated map and avoid waiting on `npx`.

### Reject RFC 0003 and archive it
Status: directed
Touches: `.spec/**`

The agent moved RFC 0003 to `rejected/` and updated its tracking records to reflect rejection. The change was committed with only four `.spec` files staged.

### Revert configurable port changes
Status: directed
Touches: `apps/client/vite.config.ts`, `CONTRIBUTING.md`

The agent restored both files to `HEAD`, removing the configurable port change and leaving the client Vite port fixed at 5203.

### Use the Taotie brand mark for development app icons
Status: discussed
Touches: `apps/desktop/scripts/gen-icons.mjs`, `apps/desktop/src/main/window.ts`, `apps/desktop/src/main/index.ts`

The agent treated the existing Taotie beast-face mark as the source for a regenerated application icon set. Development mode needs explicit Dock and window icon setup so Electron displays the same branding during development.

### Expose desktop agent setup through a narrow IPC
Status: discussed
Touches: `apps/desktop/src/main/agent-config.ts`, `apps/desktop/src/main/index.ts`, `apps/desktop/src/preload/index.ts`

The planned setup flow accepts only a tool ID over IPC and keeps configuration work in the desktop main process. This limits the renderer bridge to one operation and avoids exposing credentials in its result.

### Keep browser setup as command copy
Status: discussed
Touches: `apps/client/src/pages/AgentsPage.tsx`

The planned configuration button appears only when the desktop bridge exists and the tool supports file configuration. Browser users keep the existing command-copy flow.

### Reuse the CLI tool generator and config writer
Status: discussed
Touches: `apps/cli/src/tools.ts`, `apps/cli/src/config-files.ts`, `apps/desktop/src/main/agent-config.ts`

The proposed desktop flow reuses existing tool generation and file-writing logic, including its merge and backup behavior. Importing these modules avoids duplicating configuration rules or changing the CLI.

### Defer profile and model selection in desktop setup
Status: discussed
Touches: `apps/desktop/src/main/agent-config.ts`

The proposed IPC accepts only a tool ID and uses the CLI's default profile and model settings. No explicit rationale beyond keeping the initial flow narrow was established.

### Reuse the existing client UI for desktop and web
Status: discussed
Touches: `apps/client/src/pages/AgentsPage.tsx`, `apps/client/src/components/ui/button.tsx`, `apps/desktop/src/preload/index.ts`

The desktop main window serves the same client build as the web app, so the planned button belongs in the existing Agents page and can use the existing button component. A desktop preload bridge provides the runtime distinction without adding a shared UI package.

### Keep Monitor in the Electron desktop app
Status: discussed
Touches: `.spec/rfc/RFC-0005*`

将 Monitor 限定在 Electron 桌面端，避免把新页面加入共享客户端或服务端界面。

### Support WebSocket monitoring events on the server
Status: discussed
Touches: `.spec/rfc/RFC-0005*`

RFC 描述服务端通过 WebSocket 推送请求与路由事件，供桌面端 Monitor 订阅展示。

### Keep Dashboard distinct from Analytics and Monitor
Status: discussed
Touches: `.spec/rfc/RFC-0005*`

将 Dashboard 视为管理界面、Analytics 视为其中现有统计页面，并将 Monitor 定义为独立的实时监控页面，以明确页面职责和平台范围。

### Rename desktop window globals from __FREEAPI_* to __TAOTIE_*
Status: directed
Touches: `apps/client/src/App.tsx`, `apps/client/src/components/auth-gate.desktop.test.tsx`, `apps/client/src/components/auth-gate.tsx`, `apps/client/src/components/keys/copy-key-dialog.tsx`, `apps/client/src/components/*`, `apps/desktop/src/preload/index.ts`, `.spec/rfc/0008-taotie-window-globals.md`

The agent renamed the five desktop globals to align runtime names with Taotie branding. It kept IPC channels, environment variables, and log filenames unchanged to limit compatibility impact. The served bundle exposed the renamed globals after the desktop app returned HTTP 200.

Risk: Any external code reading the old window global names would need to migrate.

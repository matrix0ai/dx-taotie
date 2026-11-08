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
Touches: `.nvmrc`, `Dockerfile`, `package.json`, `apps/*/package.json`, `apps/desktop/package.json`

The repository was pinned to Node 24.22.2, and Electron was moved to 45.2.3, which bundles Node 24. This aligns the desktop runtime with the selected Node version and updates package engine and type declarations to match.

Risk: Electron 38 to 45 crosses seven major versions; tray, updater, signing, and notarization flows were not verified.

### Use better-sqlite3 13.0.3 without a forced Electron rebuild
Status: discussed
Touches: `apps/desktop/scripts/smoke-mac-package.mjs`

The smoke check now looks for the Darwin architecture-specific binary under `prebuilds`, matching better-sqlite3 13.0.3’s package layout. The previous `build/Release` path would fail for that version.

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
Touches: `apps/*`, `packages/shared/*`, `server/*`, `client/*`, `cli/*`, `desktop/*`

将服务端、客户端、CLI 和桌面应用归入 apps/，将 shared/ 归入 packages/shared/，以采用 pnpm monorepo 布局。

### Preserve container data path during source reorganization
Status: discussed
Touches: `docker-compose.yml`, `Dockerfile`

The agent preserved `/app/server/data`, the `freellmapi-data` volume, service name, and `freeapi.db` filename across the source reorganization. Reusing these identifiers allows existing container data to remain available after rebuilding.

### Render generated icons from SVG
Status: discussed
Touches: `gen-icons.mjs`

图标生成器改为使用 sharp 渲染 SVG，避免原有手绘逻辑覆盖新图标。

### Rename product branding to Taotie
Status: discussed
Touches: `**/*`

显示名称、favicon、桌面图标和托盘图标统一改为 Taotie，以保持产品品牌呈现一致。

### Set Taotie bundle identifier
Status: discussed
Touches: `desktop/*`

桌面应用 Bundle ID 改为 me.systembug.taotie，以匹配新的产品标识。

### Update workflow paths after directory reorganization
Status: discussed
Touches: `.github/workflows/*`

工作流中的路径引用随目录搬迁更新，使发布和 Docker 流程继续指向新的 apps/ 与 packages/ 布局。

### Repair documentation links after directory reorganization
Status: discussed
Touches: `README*`, `CONTRIBUTING.md`, `SECURITY.md`, `GLOSSARY.md`

目录搬迁后修复失效文档链接，保持文档导航可用。

### Keep historical changelog unchanged
Status: discussed
Touches: `CHANGELOG*`

保留历史 changelog 内容，避免重写既有发布记录。

### Register frontend and backend ports
Status: discussed
Touches: `spark/port.md`

登记前端 Vite 端口 5203 和后端监听端口 3001。前端端口登记用于避免与其他项目发生冲突。

### Point origin remote to Taotie repository
Status: discussed
Touches: `.git/config`

将 origin 指向 matrix0ai/dx-taotie，使仓库远程地址与新的项目归属一致。

### Update project registry repository path
Status: discussed
Touches: `spark/project.md`

同步更新项目登记中的 Git 路径，使其与新的仓库路径一致。

### Do not change existing domain links
Status: discussed
Touches: `**/*`

保留现有 freellmapi.co 链接，因为新域名尚未确定。

### Leave branding screenshots for later recapture
Status: discussed
Touches: `repo-assets/github-hero.png`, `repo-assets/*`

现有截图仍展示旧品牌，需要重新生成后才能反映 Taotie 外观。

### Apply the registered Vite port in client configuration
Status: discussed
Touches: `apps/client/vite.config.ts`

端口登记为 5203，但 Vite 配置尚未应用该端口和 strictPort；客户端当前仍使用默认端口 5173。

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
Touches: `.spec/*`, `.claude/settings.json`

The cleanup removes the 38 extra files from the repository index while leaving their on-disk copies intact. Existing files are restored in the index to their prior commit versions, preserving working-tree edits.

### Leave IssueGraph hooks and configuration enabled
Status: discussed
Touches: `.claude/settings.json`

The hook configuration remains untouched because disabling IssueGraph was not approved. Its role in re-staging files remains unconfirmed.

### Commit cleanup without bypassing hooks
Status: discussed
Touches: `.spec/*`, `.claude/settings.json`

A policy hook blocked `--no-verify`, so the cleanup was committed normally. The resulting tree was checked before push.

### Push and verify the cleanup commit
Status: discussed
Touches: `.spec/rfc/0006-*`, `.spec/rfc/0007-*`

The cleanup was pushed to `origin/main` and the remote ref was checked against local `HEAD`. The remote tree differs from implementation commit `3ae585f4` only in `.spec/`, where RFC 0006 and 0007 were archived as Implemented.

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

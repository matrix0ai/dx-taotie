import { resolve } from 'node:path';
import { defineConfig } from 'electron-vite';

// CI stamps the build identity so the packaged app can tell the update check
// which commit and install method it is (see src/main/server-host.ts).
const githubSha = process.env.GITHUB_SHA;
const hasBuildIdentity = /^[0-9a-f]{40}$/i.test(githubSha ?? '');

export default defineConfig({
  main: {
    // The server sources (apps/server/src) are bundled in; only the desktop
    // package's own dependencies (better-sqlite3, electron-updater) stay
    // external — externalizeDeps is on by default.
    define: {
      'process.env.TAOTIE_COMMIT_SHA': JSON.stringify(hasBuildIdentity ? githubSha : ''),
      'process.env.TAOTIE_INSTALL_METHOD': JSON.stringify(hasBuildIdentity ? 'desktop' : ''),
    },
    build: {
      rolldownOptions: {
        input: { index: resolve(__dirname, 'src/main/index.ts') },
        output: {
          format: 'es',
          entryFileNames: '[name].mjs',
          // Some inlined CJS deps (express internals) reference `require` at
          // runtime; give the ESM bundle a working one.
          banner:
            "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
        },
      },
    },
  },
  preload: {
    build: {
      rolldownOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          popover: resolve(__dirname, 'src/preload/popover.ts'),
        },
        // CommonJS is the reliable preload format.
        output: { format: 'cjs', entryFileNames: '[name].cjs' },
      },
    },
  },
  renderer: {
    // The dashboard itself is the web client (apps/client) served by the
    // embedded server; this renderer is only the tray popover.
    root: resolve(__dirname, 'src/renderer'),
    build: {
      rolldownOptions: {
        input: { popover: resolve(__dirname, 'src/renderer/popover/index.html') },
      },
    },
  },
});

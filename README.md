# Portfolio

React 19 + TypeScript + Vite, with a react-three-fiber hero scene.

## Running locally

```bash
npm install
npm run dev
```

Assets (models, images, videos, the resume) are served from a CDN bucket. Two
env vars drive that:

```
VITE_MODE=production      # anything other than "development" disables publicDir
VITE_BUCKET_URL=https://cdn.kalevkeil.com
```

With `VITE_MODE=development`, Vite serves `public/` instead and asset paths
become root-relative.

## Tests

| Command | What it runs |
| --- | --- |
| `npm test` | Vitest unit + component suite |
| `npm run test:watch` | the same, in watch mode |
| `npm run test:coverage` | with a v8 coverage report |
| `npm run test:e2e` | Playwright, against a production build |
| `npm run test:e2e:ui` | Playwright in UI mode |
| `npm run test:e2e:record` | re-record the CDN fixture (see below) |

`npm run typecheck` and `npm run lint` cover the rest.

### Unit and component tests

Vitest with jsdom, colocated as `*.test.ts(x)` beside the code. 3D components
are covered with `@react-three/test-renderer`. EmailJS is mocked globally in
`src/test/setup.ts`, so nothing can reach the real service.

`src/test/setup.ts` also installs an in-memory `Storage`: Node 25 ships an
experimental `localStorage` global that otherwise clobbers jsdom's.

### End-to-end tests

Playwright builds the app and serves it with `vite preview` on port 4173, so
the suite exercises the real production bundle.

**The CDN bucket is on a free Cloudflare plan with a limited egress
allowance**, so e2e does not re-download assets on every run. The first run
records them into `tests/e2e/.har/` (gitignored, ~46MB) and every run after
replays from disk. Anything missing from the recording still falls back to the
network, so a stale fixture degrades rather than breaks.

```bash
npm run test:e2e            # replay from the recording
npm run test:e2e:record     # refresh the recording (hits the CDN)
E2E_ASSETS=live npm run test:e2e   # bypass the recording entirely
```

Once the assets are available locally for dev mode, point Playwright at the dev
server and drop the HAR shim in `tests/e2e/fixtures.ts`.

Two other things the e2e fixture papers over, both environment rather than app
bugs: headless Chromium has no audio device (so `HTMLMediaElement.play()` never
settles, and the writer intro awaits it), and no GPU (so the hero canvas needs
SwiftShader, enabled in `playwright.config.ts`).

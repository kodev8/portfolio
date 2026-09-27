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

## Assets

Models, images, videos and the resume live in an R2 bucket behind
`cdn.kalevkeil.com`. Mirror them locally once:

```bash
brew install rclone
export R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=...
npm run assets:sync
```

The script never writes credentials to disk; it configures rclone through the
environment. It uses `rclone copy`, so it only ever adds and overwrites. Pass
`MIRROR=1` for a true mirror that also deletes local-only files, and
`--dry-run` to preview either.

With `public/` populated, `VITE_MODE=development` serves everything from disk
instead of the CDN.

## Tests

| Command | What it runs |
| --- | --- |
| `npm test` | Vitest unit + component suite |
| `npm run test:watch` | the same, in watch mode |
| `npm run test:coverage` | with a v8 coverage report |
| `npm run test:e2e` | Playwright, offline against local assets |
| `npm run test:e2e:ui` | Playwright in UI mode |
| `npm run test:e2e:cdn` | Playwright against the real bucket |

`npm run typecheck` and `npm run lint` cover the rest.

### Unit and component tests

Vitest with jsdom, colocated as `*.test.ts(x)` beside the code. 3D components
are covered with `@react-three/test-renderer`. EmailJS is mocked globally in
`src/test/setup.ts`, so nothing can reach the real service.

`src/test/setup.ts` also installs an in-memory `Storage`: Node 25 ships an
experimental `localStorage` global that otherwise clobbers jsdom's.

Two known blind spots in that setup: `IntersectionObserver` is a no-op, so
scroll-reveal animations never fire under test, and `matchMedia` always returns
`false`, so every component renders its desktop branch.

### End-to-end tests

`npm run test:e2e` builds with `VITE_MODE=development` and serves the result
with `vite preview` on port 4173. That is still a production bundle, but every
asset resolves out of `public/`, so the run needs no network. It refuses to
start if `public/` looks unpopulated.

`npm run test:e2e:cdn` is the counterpart: a production-mode build on port
4174 that genuinely fetches from the bucket. It is the only thing that can
catch a broken `VITE_BUCKET_URL` or an object missing from R2, so it is worth
running before a deploy rather than on every commit.

Headless Chromium needs two shims, both in the harness rather than the app:
SwiftShader for the hero canvas (no GPU), and a resolved
`HTMLMediaElement.play()` (no audio device — the writer intro awaits it).

`tests/e2e/intro-resilience.spec.ts` deliberately runs without that second
shim. Two of its cases pass; the third is marked `test.fail()` because a
`play()` promise that never settles strands the site at `opacity-0`. When that
is fixed the test will start passing and the run will fail until the
annotation is removed.

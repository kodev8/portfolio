/**
 * Where asset URLs are rooted.
 *
 * In production the bucket URL is baked in and `publicDir` is disabled, so
 * every path has to be absolute. In any other mode Vite serves `public/`, so
 * paths stay root-relative and resolve against the dev/preview origin.
 *
 * Shared with vite.config.ts, which needs the same answer when rewriting
 * index.html. Keep it dependency-free so both sides can import it.
 */
export const resolveBucketUrl = (
  mode: string | undefined,
  bucketUrl: string | undefined
): string => (mode === "production" ? (bucketUrl ?? "") : "");

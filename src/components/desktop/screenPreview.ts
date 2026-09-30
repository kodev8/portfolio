import { CanvasTexture, SRGBColorSpace } from "three";
import type { OsKind } from "./windowManager";

/*
 * What the monitor shows from across the room: a painted stand-in for the
 * desktop. The live DOM desktop only appears once the camera is face-on, so
 * the angled view never depends on 3D CSS transforms, which Safari mis-draws.
 *
 * Shapes only, no images: a cross-origin image would taint the canvas and
 * WebGL refuses to upload a tainted canvas.
 */

const W = 1000;
const H = 600;

const radial = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
};

const APP_TILES = ["#f5b82e", "#e5243b", "#fde047", "#4c8bf5", "#38bdf8"];

const drawWindows = (ctx: CanvasRenderingContext2D) => {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b1230");
  bg.addColorStop(1, "#0a0f24");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  radial(ctx, W * 0.5, H * 0.64, W * 0.36, "rgba(96,165,250,0.85)");
  radial(ctx, W * 0.36, H * 0.58, W * 0.22, "rgba(167,139,250,0.6)");

  ctx.fillStyle = "rgba(21,20,31,0.9)";
  ctx.fillRect(0, H - 50, W, 50);
  const size = 26;
  const gap = 16;
  const start = W / 2 - ((APP_TILES.length + 1) * (size + gap) - gap) / 2;
  roundRect(ctx, start, H - 38, size, size, 5, "#e6e3ff");
  APP_TILES.forEach((c, i) =>
    roundRect(ctx, start + (i + 1) * (size + gap), H - 38, size, size, 5, c)
  );
};

const drawMac = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#1b1830";
  ctx.fillRect(0, 0, W, H);
  radial(ctx, W * 0.18, H * 0.18, W * 0.5, "rgba(255,91,168,0.55)");
  radial(ctx, W * 0.88, H * 0.26, W * 0.45, "rgba(109,91,255,0.6)");
  radial(ctx, W * 0.5, H * 1.05, W * 0.55, "rgba(53,224,200,0.45)");

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, W, 30);
  const size = 40;
  const gap = 12;
  const dockW = APP_TILES.length * (size + gap) + gap;
  roundRect(ctx, W / 2 - dockW / 2, H - 70, dockW, 60, 16, "rgba(255,255,255,0.16)");
  APP_TILES.forEach((c, i) =>
    roundRect(
      ctx,
      W / 2 - dockW / 2 + gap + i * (size + gap),
      H - 60,
      size,
      size,
      10,
      c
    )
  );
};

const drawChooser = (ctx: CanvasRenderingContext2D) => {
  const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.8);
  bg.addColorStop(0, "#27224a");
  bg.addColorStop(1, "#0b0a12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#f2f0ff";
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("<KK>", W / 2, H * 0.3);
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText("Pick a desktop", W / 2, H * 0.45);

  for (const [i, accent] of ["#35e0c8", "#ff5ba8"].entries()) {
    const x = W / 2 - 230 + i * 250;
    roundRect(ctx, x, H * 0.54, 210, 130, 16, "rgba(27,24,48,0.9)");
    roundRect(ctx, x + 12, H * 0.54 + 12, 186, 80, 8, accent);
  }
};

/** A texture of the monitor as seen from the room, for the given OS choice. */
export const createScreenPreview = (os: OsKind | null) => {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    if (os === "windows") drawWindows(ctx);
    else if (os === "macos") drawMac(ctx);
    else drawChooser(ctx);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

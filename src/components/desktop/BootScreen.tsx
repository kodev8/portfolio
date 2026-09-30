import { assetsPaths, desktopOsText } from "../../constants";
import type { Language } from "../../types";
import { cn } from "../../utils";
import type { OsKind } from "./windowManager";

/** How long the startup splash holds before the desktop appears. */
export const BOOT_MS = 1400;

const OPTIONS: { os: OsKind; label: string }[] = [
  { os: "windows", label: "Windows" },
  { os: "macos", label: "macOS" },
];

/** A thumbnail of each desktop, drawn in CSS so the chooser costs no requests. */
const Preview = ({ os }: { os: OsKind }) =>
  os === "windows" ? (
    <div className="relative aspect-video overflow-hidden rounded-md bg-[radial-gradient(55%_45%_at_50%_64%,rgb(96_165_250/0.85),transparent_70%),linear-gradient(180deg,#0b1230,#0a0f24)]">
      <div className="absolute inset-x-0 bottom-0 flex h-3 items-center justify-center gap-0.5 bg-black/50">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="size-1.5 rounded-[2px] bg-white/60" />
        ))}
      </div>
      <div className="absolute top-4 left-1/2 h-8 w-14 -translate-x-1/2 rounded-sm border border-white/15 bg-[#1b1a25]/90" />
    </div>
  ) : (
    <div className="relative aspect-video overflow-hidden rounded-md bg-[radial-gradient(70%_60%_at_18%_18%,rgb(255_91_168/0.55),transparent_60%),radial-gradient(65%_60%_at_88%_26%,rgb(109_91_255/0.6),transparent_60%),#1b1830]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-black/30" />
      <div className="absolute top-4 left-1/2 h-8 w-14 -translate-x-1/2 rounded-sm border border-white/15 bg-[#1d1a2c]/90">
        <div className="flex gap-0.5 p-0.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="size-1 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-1 left-1/2 flex h-2.5 -translate-x-1/2 items-center gap-0.5 rounded-sm bg-white/25 px-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="size-1.5 rounded-[2px] bg-white/70" />
        ))}
      </div>
    </div>
  );

export const OsChooser = ({
  language,
  onChoose,
}: {
  language: Language;
  onChoose: (os: OsKind) => void;
}) => (
  <div className="desk-fade-in flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(80%_70%_at_50%_0%,#27224a,#0b0a12)] p-4 text-center">
    <img src={assetsPaths.images.desktop.logo} alt="" className="h-7 opacity-90" />
    <div>
      <h2 className="text-base font-semibold text-room-hi">
        {desktopOsText.chooseTitle[language]}
      </h2>
      <p className="mt-0.5 text-[11px] text-room-mid">
        {desktopOsText.chooseHint[language]}
      </p>
    </div>
    <div className="flex gap-3">
      {OPTIONS.map(({ os, label }) => (
        <button
          key={os}
          onClick={() => onChoose(os)}
          className="group w-40 rounded-xl border border-[var(--room-line)] bg-room-surface/80 p-2 text-left transition hover:-translate-y-0.5 hover:border-room-accent focus-visible:border-room-accent"
        >
          <Preview os={os} />
          <span className="mt-2 block px-0.5 text-xs font-medium text-room-hi group-hover:text-room-accent">
            {label}
          </span>
        </button>
      ))}
    </div>
  </div>
);

/** Logo and a loader in each OS's style, while the desktop "starts". */
export const BootSplash = ({ os, language }: { os: OsKind; language: Language }) => (
  <div
    role="status"
    className="flex h-full w-full flex-col items-center justify-center gap-6 bg-black"
  >
    <img src={assetsPaths.images.desktop.logo} alt="" className="h-12" />
    {os === "windows" ? (
      <span className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    ) : (
      <span className="h-1 w-36 overflow-hidden rounded-full bg-white/20">
        <span
          className={cn("desk-progress block h-full rounded-full bg-white")}
          style={{ animationDuration: `${BOOT_MS - 100}ms` }}
        />
      </span>
    )}
    <span className="sr-only">{desktopOsText.booting[language]}</span>
  </div>
);

import { useState, type PointerEvent } from "react";
import { RefreshCw, Search } from "lucide-react";
import { assetsPaths, desktopOsText, windowLabels } from "../../constants";
import { cn } from "../../utils";
import { APP_IDS, appTitle, localeOf, type Desk } from "./desk";
import { DesktopIcons, DeskWindows } from "./shared";

export const WINDOWS_TASKBAR = 40;

const WALLPAPER = [
  "radial-gradient(55% 45% at 50% 64%, rgb(96 165 250 / 0.85), transparent 70%)",
  "radial-gradient(38% 32% at 36% 58%, rgb(167 139 250 / 0.7), transparent 70%)",
  "radial-gradient(34% 30% at 64% 56%, rgb(53 224 200 / 0.45), transparent 70%)",
  "linear-gradient(180deg, #0b1230 0%, #0a0f24 100%)",
].join(", ");

const keepOpen = (e: PointerEvent) => e.stopPropagation();

const StartMenu = ({ desk, onClose }: { desk: Desk; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const { language } = desk;
  const matches = APP_IDS.filter((id) =>
    appTitle(id, language).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      onPointerDown={keepOpen}
      className="desk-menu-open absolute left-1/2 z-[9001] w-[340px] max-w-[calc(100%-16px)] -translate-x-1/2 overflow-hidden rounded-lg border border-white/10 bg-[#1f1d2b]/95 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{ bottom: WINDOWS_TASKBAR + 8 }}
    >
      <div className="p-4">
        <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/25 px-2.5 py-1.5">
          <Search className="size-3.5 text-room-low" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={desktopOsText.search[language]}
            className="w-full bg-transparent text-xs text-room-hi outline-none placeholder:text-room-low"
          />
        </label>

        <h3 className="mt-3 mb-1.5 text-[11px] font-semibold text-room-mid">
          {desktopOsText.pinned[language]}
        </h3>
        {matches.length ? (
          <ul className="grid grid-cols-5 gap-1">
            {matches.map((id) => (
              <li key={id}>
                <button
                  onClick={() => {
                    desk.open(id);
                    onClose();
                  }}
                  className="flex w-full flex-col items-center gap-1 rounded-md p-1.5 hover:bg-white/10"
                >
                  <img src={windowLabels[id].icon} alt="" className="size-7" />
                  <span className="w-full truncate text-center text-[10px] text-room-hi">
                    {appTitle(id, language)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-3 text-center text-[11px] text-room-low">
            {desktopOsText.noResults[language]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 bg-black/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <img
            src={assetsPaths.images.profile_pics[0]}
            alt=""
            className="size-6 rounded-full object-cover"
          />
          <span className="text-xs text-room-hi">Kalev Keil</span>
        </div>
        <button
          onClick={desk.switchOs}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-room-mid hover:bg-white/10 hover:text-room-hi"
        >
          <RefreshCw className="size-3.5" />
          {desktopOsText.switchToMac[language]}
        </button>
      </div>
    </div>
  );
};

const Taskbar = ({
  desk,
  startOpen,
  onToggleStart,
}: {
  desk: Desk;
  startOpen: boolean;
  onToggleStart: () => void;
}) => {
  const locale = localeOf(desk.language);

  // Taskbar convention: open it, raise it, or tuck the active one away.
  const onApp = (id: (typeof APP_IDS)[number]) => {
    const win = desk.state.windows.find((w) => w.id === id);
    if (win && desk.active === id) desk.minimize(id);
    else desk.open(id);
  };

  return (
    <footer
      onPointerDown={keepOpen}
      className="absolute inset-x-0 bottom-0 z-[9000] flex items-center border-t border-white/10 bg-[#15141f]/85 px-2 backdrop-blur-xl"
      style={{ height: WINDOWS_TASKBAR }}
    >
      <div className="mx-auto flex items-center gap-1">
        <button
          aria-label={desktopOsText.start[desk.language]}
          aria-expanded={startOpen}
          onClick={onToggleStart}
          className={cn(
            "grid size-8 place-items-center rounded-md hover:bg-white/10",
            startOpen && "bg-white/10"
          )}
        >
          <img src={assetsPaths.images.desktop.logo} alt="" className="size-5" />
        </button>

        {APP_IDS.map((id) => {
          const open = desk.isOpen(id);
          const active = desk.active === id;
          return (
            <button
              key={id}
              aria-label={appTitle(id, desk.language)}
              onClick={() => onApp(id)}
              className={cn(
                "relative grid size-8 place-items-center rounded-md hover:bg-white/10",
                active && "bg-white/10"
              )}
            >
              <img src={windowLabels[id].icon} alt="" className="size-5" />
              <span
                className={cn(
                  "absolute bottom-0.5 h-[3px] rounded-full transition-all",
                  active ? "w-4 bg-room-accent" : open ? "w-1.5 bg-room-low" : "w-0"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="absolute right-3 text-right text-[10px] leading-tight text-room-hi">
        <div>
          {desk.now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div>{desk.now.toLocaleDateString(locale)}</div>
      </div>
    </footer>
  );
};

const WindowsShell = ({ desk }: { desk: Desk }) => {
  const [startOpen, setStartOpen] = useState(false);

  return (
    <div
      className="desk-fade-in relative h-full w-full overflow-hidden"
      style={{ background: WALLPAPER }}
      onPointerDown={() => setStartOpen(false)}
    >
      <DesktopIcons desk={desk} side="left" />
      <DeskWindows desk={desk} />
      {startOpen && <StartMenu desk={desk} onClose={() => setStartOpen(false)} />}
      <Taskbar
        desk={desk}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((open) => !open)}
      />
    </div>
  );
};

export default WindowsShell;

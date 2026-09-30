import { useState, type PointerEvent, type ReactNode } from "react";
import { BatteryFull, Check, RefreshCw, Wifi } from "lucide-react";
import { assetsPaths, desktopOsText, windowLabels } from "../../constants";
import { cn } from "../../utils";
import { APP_IDS, appTitle, localeOf, type Desk } from "./desk";
import { DesktopIcons, DeskWindows } from "./shared";

export const MAC_MENU_BAR = 24;
export const MAC_DOCK = 62;

const WALLPAPER = [
  "radial-gradient(70% 60% at 18% 18%, rgb(255 91 168 / 0.55), transparent 60%)",
  "radial-gradient(65% 60% at 88% 26%, rgb(109 91 255 / 0.6), transparent 60%)",
  "radial-gradient(90% 70% at 50% 105%, rgb(53 224 200 / 0.45), transparent 60%)",
  "#1b1830",
].join(", ");

type MenuId = "system" | "window";

const keepOpen = (e: PointerEvent) => e.stopPropagation();

const MenuItem = ({
  onClick,
  checked,
  children,
}: {
  onClick: () => void;
  checked?: boolean;
  children: ReactNode;
}) => (
  <li>
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12px] text-room-hi hover:bg-room-link hover:text-white"
    >
      <Check className={cn("size-3", !checked && "invisible")} />
      {children}
    </button>
  </li>
);

const MenuBar = ({
  desk,
  menu,
  setMenu,
}: {
  desk: Desk;
  menu: MenuId | null;
  setMenu: (m: MenuId | null) => void;
}) => {
  const { language } = desk;
  const toggle = (id: MenuId) => setMenu(menu === id ? null : id);
  const pick = (action: () => void) => () => {
    action();
    setMenu(null);
  };
  const title = desk.active
    ? appTitle(desk.active, language)
    : desktopOsText.finder[language];
  const menuButton = (id: MenuId) =>
    cn("rounded px-2 py-0.5 hover:bg-white/15", menu === id && "bg-white/20");

  return (
    <header
      onPointerDown={keepOpen}
      className="absolute inset-x-0 top-0 z-[9000] flex items-center gap-1 bg-black/30 px-2 text-[12px] text-white backdrop-blur-xl"
      style={{ height: MAC_MENU_BAR }}
    >
      <div className="relative">
        <button
          aria-label="Menu"
          aria-expanded={menu === "system"}
          onClick={() => toggle("system")}
          className={menuButton("system")}
        >
          <img src={assetsPaths.images.desktop.logo} alt="" className="h-3.5" />
        </button>
        {menu === "system" && (
          <ul className="desk-menu-open absolute top-6 left-0 min-w-[190px] rounded-md border border-white/10 bg-[#2a2638]/95 p-1 shadow-xl backdrop-blur-xl">
            <MenuItem onClick={pick(desk.switchOs)}>
              <RefreshCw className="size-3" />
              {desktopOsText.switchToWindows[language]}
            </MenuItem>
          </ul>
        )}
      </div>

      <span className="px-1.5 font-semibold">{title}</span>

      <div className="relative">
        <button
          aria-expanded={menu === "window"}
          onClick={() => toggle("window")}
          className={menuButton("window")}
        >
          {desktopOsText.window[language]}
        </button>
        {menu === "window" && (
          <ul className="desk-menu-open absolute top-6 left-0 min-w-[170px] rounded-md border border-white/10 bg-[#2a2638]/95 p-1 shadow-xl backdrop-blur-xl">
            {desk.active && (
              <>
                <MenuItem onClick={pick(() => desk.minimize(desk.active!))}>
                  {desktopOsText.minimize[language]}
                </MenuItem>
                <MenuItem onClick={pick(() => desk.close(desk.active!))}>
                  {desktopOsText.close[language]}
                </MenuItem>
                <li className="mx-2 my-1 h-px bg-white/10" />
              </>
            )}
            {APP_IDS.map((id) => (
              <MenuItem
                key={id}
                checked={desk.active === id}
                onClick={pick(() => desk.open(id))}
              >
                {appTitle(id, language)}
              </MenuItem>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3 pr-1">
        <Wifi className="size-3.5" />
        <BatteryFull className="size-4" />
        <span>
          {desk.now.toLocaleString(localeOf(language), {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </header>
  );
};

const Dock = ({ desk }: { desk: Desk }) => (
  <nav
    onPointerDown={keepOpen}
    className="absolute bottom-1.5 left-1/2 z-[9000] flex -translate-x-1/2 items-end gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-2 pt-1.5 pb-1 backdrop-blur-xl"
  >
    {APP_IDS.map((id) => (
      <button
        key={id}
        aria-label={appTitle(id, desk.language)}
        // A dock click raises or restores; it never hides the app.
        onClick={() => desk.open(id)}
        className="group relative flex flex-col items-center"
      >
        <span className="pointer-events-none absolute -top-7 rounded bg-[#2a2638]/95 px-2 py-0.5 text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          {appTitle(id, desk.language)}
        </span>
        <span className="grid size-10 origin-bottom place-items-center rounded-[10px] border border-white/15 bg-gradient-to-b from-white/25 to-white/5 shadow-md transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-125 group-active:scale-110">
          <img src={windowLabels[id].icon} alt="" className="size-6" />
        </span>
        <span
          className={cn(
            "mt-0.5 size-1 rounded-full",
            desk.isOpen(id) ? "bg-white/80" : "bg-transparent"
          )}
        />
      </button>
    ))}
  </nav>
);

const MacShell = ({ desk }: { desk: Desk }) => {
  const [menu, setMenu] = useState<MenuId | null>(null);

  return (
    <div
      className="desk-fade-in relative h-full w-full overflow-hidden"
      style={{ background: WALLPAPER }}
      onPointerDown={() => setMenu(null)}
    >
      <MenuBar desk={desk} menu={menu} setMenu={setMenu} />
      <DesktopIcons desk={desk} side="right" />
      <DeskWindows desk={desk} />
      <Dock desk={desk} />
    </div>
  );
};

export default MacShell;

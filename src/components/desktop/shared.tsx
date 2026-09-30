import { windowLabels } from "../../constants";
import { cn } from "../../utils";
import { AppContent } from "./apps";
import { APP_IDS, appTitle, type AppId, type Desk } from "./desk";
import Window from "./Window";

/** Every open window, in its shell's chrome. */
export const DeskWindows = ({ desk }: { desk: Desk }) => (
  <>
    {desk.state.windows.map((win) => (
      <Window
        key={win.id}
        os={desk.os}
        win={win}
        area={desk.area}
        active={desk.active === win.id}
        title={appTitle(win.id, desk.language)}
        icon={windowLabels[win.id]?.icon}
        language={desk.language}
        getScale={desk.getScale}
        onFocus={() => desk.active !== win.id && desk.focus(win.id)}
        onClose={() => desk.close(win.id)}
        onMinimize={() => desk.minimize(win.id)}
        onToggleMaximize={() => desk.toggleMaximize(win.id)}
        onMove={(x, y) => desk.move(win.id, x, y)}
      >
        <AppContent id={win.id as AppId} language={desk.language} />
      </Window>
    ))}
  </>
);

/** Shortcut icons on the wallpaper; wraps into more columns on short screens. */
export const DesktopIcons = ({
  desk,
  side,
}: {
  desk: Desk;
  side: "left" | "right";
}) => (
  <ul
    className={cn(
      "absolute flex flex-col flex-wrap content-start gap-1",
      side === "left" ? "left-2 items-start" : "right-2 flex-wrap-reverse items-end"
    )}
    style={{ top: desk.area.top + 8, bottom: desk.area.bottom + 8 }}
  >
    {APP_IDS.map((id) => (
      <li key={id}>
        <button
          onClick={() => desk.open(id)}
          className="flex w-[72px] flex-col items-center gap-1 rounded-md p-1.5 text-center hover:bg-white/12 focus-visible:bg-white/12"
        >
          <img src={windowLabels[id].icon} alt="" className="size-8 drop-shadow" />
          <span className="text-[11px] leading-tight text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.8)]">
            {appTitle(id, desk.language)}
          </span>
        </button>
      </li>
    ))}
  </ul>
);

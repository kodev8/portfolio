import { useRef, type PointerEvent, type ReactNode } from "react";
import { Copy, Maximize2, Minus, Square, X } from "lucide-react";
import { desktopOsText } from "../../constants";
import type { Language } from "../../types";
import { cn } from "../../utils";
import {
  windowRect,
  type DesktopArea,
  type OsKind,
  type WindowState,
} from "./windowManager";

interface WindowProps {
  os: OsKind;
  win: WindowState;
  area: DesktopArea;
  active: boolean;
  title: string;
  icon: string;
  language: Language;
  /** CSS px of the desktop per on-screen px; the 3D view scales the whole UI. */
  getScale: () => number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}

/** Stops a title-bar button press from also starting a drag. */
const noDrag = (e: PointerEvent) => e.stopPropagation();

const TrafficLights = ({
  active,
  language,
  onClose,
  onMinimize,
  onToggleMaximize,
}: Pick<
  WindowProps,
  "active" | "language" | "onClose" | "onMinimize" | "onToggleMaximize"
>) => {
  const dot =
    "grid size-3 place-items-center rounded-full text-black/60 transition-colors";
  const idle = !active && "bg-[#4a4658]";

  return (
    <div className="group flex gap-2" onPointerDown={noDrag}>
      <button
        aria-label={desktopOsText.close[language]}
        onClick={onClose}
        className={cn(dot, idle || "bg-[#ff5f57]", "group-hover:bg-[#ff5f57]")}
      >
        <X className="size-2 opacity-0 group-hover:opacity-100" strokeWidth={3} />
      </button>
      <button
        aria-label={desktopOsText.minimize[language]}
        onClick={onMinimize}
        className={cn(dot, idle || "bg-[#febc2e]", "group-hover:bg-[#febc2e]")}
      >
        <Minus className="size-2 opacity-0 group-hover:opacity-100" strokeWidth={3} />
      </button>
      <button
        aria-label={desktopOsText.maximize[language]}
        onClick={onToggleMaximize}
        className={cn(dot, idle || "bg-[#28c840]", "group-hover:bg-[#28c840]")}
      >
        <Maximize2
          className="size-1.5 opacity-0 group-hover:opacity-100"
          strokeWidth={3}
        />
      </button>
    </div>
  );
};

const CaptionButtons = ({
  maximized,
  language,
  onClose,
  onMinimize,
  onToggleMaximize,
}: { maximized: boolean } & Pick<
  WindowProps,
  "language" | "onClose" | "onMinimize" | "onToggleMaximize"
>) => {
  const button = "grid h-8 w-11 place-items-center text-room-mid transition-colors";

  return (
    <div className="flex" onPointerDown={noDrag}>
      <button
        aria-label={desktopOsText.minimize[language]}
        onClick={onMinimize}
        className={cn(button, "hover:bg-white/10 hover:text-room-hi")}
      >
        <Minus className="size-3.5" />
      </button>
      <button
        aria-label={desktopOsText[maximized ? "restore" : "maximize"][language]}
        onClick={onToggleMaximize}
        className={cn(button, "hover:bg-white/10 hover:text-room-hi")}
      >
        {maximized ? <Copy className="size-3" /> : <Square className="size-3" />}
      </button>
      <button
        aria-label={desktopOsText.close[language]}
        onClick={onClose}
        className={cn(button, "hover:bg-[#c42b1c] hover:text-white")}
      >
        <X className="size-4" />
      </button>
    </div>
  );
};

const Window = ({
  os,
  win,
  area,
  active,
  title,
  icon,
  language,
  getScale,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  children,
}: WindowProps) => {
  const drag = useRef<{
    px: number;
    py: number;
    x: number;
    y: number;
    scale: number;
  } | null>(null);
  const rect = windowRect(win, area);
  const mac = os === "macos";

  // Pointer events with capture, so the drag works for touch and keeps
  // tracking when the pointer outruns the title bar. Screen deltas are divided
  // by the 3D scale, so the window stays under the finger at any zoom.
  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || win.maximized) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      px: e.clientX,
      py: e.clientY,
      x: win.x,
      y: win.y,
      scale: getScale(),
    };
  };
  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    onMove(d.x + (e.clientX - d.px) / d.scale, d.y + (e.clientY - d.py) / d.scale);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <section
      aria-label={title}
      onPointerDownCapture={onFocus}
      className={cn(
        "desk-window-open absolute flex flex-col overflow-hidden border shadow-[0_16px_48px_rgba(0,0,0,0.55)]",
        mac ? "rounded-[10px] bg-[#1d1a2c]" : "rounded-lg bg-[#1b1a25]",
        active ? "border-white/18" : "border-white/8",
        win.maximized && "rounded-none border-0",
        win.minimized && "hidden"
      )}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        zIndex: win.z,
      }}
    >
      <div
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onToggleMaximize}
        className={cn(
          "relative flex shrink-0 touch-none items-center select-none",
          mac ? "h-7 px-3" : "h-8 pl-3",
          !win.maximized && "cursor-grab active:cursor-grabbing"
        )}
      >
        {mac ? (
          <>
            <TrafficLights
              active={active}
              language={language}
              onClose={onClose}
              onMinimize={onMinimize}
              onToggleMaximize={onToggleMaximize}
            />
            <span
              className={cn(
                "pointer-events-none absolute inset-x-20 truncate text-center text-xs font-medium",
                active ? "text-room-hi" : "text-room-low"
              )}
            >
              {title}
            </span>
          </>
        ) : (
          <>
            <img src={icon} alt="" className="size-4" />
            <span
              className={cn(
                "ml-2 flex-1 truncate text-xs",
                active ? "text-room-hi" : "text-room-low"
              )}
            >
              {title}
            </span>
            <CaptionButtons
              maximized={win.maximized}
              language={language}
              onClose={onClose}
              onMinimize={onMinimize}
              onToggleMaximize={onToggleMaximize}
            />
          </>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">{children}</div>
    </section>
  );
};

export default Window;

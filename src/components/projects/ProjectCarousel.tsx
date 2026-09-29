import { useState, useEffect, useRef, type CSSProperties } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "../../utils";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiArrowsExpand } from "react-icons/hi";
import { Button } from "../ui/button";
import { useMedia } from "../../context/MediaContext";

/** How long a slide holds before autoplay advances it. */
const AUTOPLAY_MS = 5000;
/** Dwell on a hovered video slide before it starts playing. */
const VIDEO_HOVER_DELAY_MS = 1500;

/**
 * The travel time, read from the same token the CSS transition uses.
 *
 * The controls lock out while a slide is moving, so that lockout has to match
 * the transition exactly — and it cannot be a literal, because reduced motion
 * collapses --dur-slow to 0.01ms. Reading it means the toggle shortens the
 * lockout too, instead of freezing the arrows for 600ms on a slide that has
 * already arrived.
 */
const FALLBACK_SLIDE_MS = 600;

export const slideDurationMs = () => {
  if (typeof window === "undefined") return FALLBACK_SLIDE_MS;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--dur-slow")
    .trim();
  // Absent, not zero: jsdom loads no stylesheet, and falling through to 0
  // there would release the lockout before the slide had moved at all.
  if (!raw) return FALLBACK_SLIDE_MS;
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return FALLBACK_SLIDE_MS;
  return raw.endsWith("ms") ? value : value * 1000;
};

interface CarouselNavProps {
  prevImage: () => void;
  nextImage: () => void;
  isTransitioning: boolean;
}

/** Shared by both arrows: a tile on the room ground rather than a black pill. */
const NAV_BUTTON = cn(
  "absolute top-1/2 z-20 size-10 -translate-y-1/2 rounded-xl",
  "border border-[var(--room-line)] bg-room-ground/80 backdrop-blur-sm",
  "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
  "hover:border-room-accent hover:bg-room-ground focus-visible:border-room-accent focus-visible:outline-none"
);

const CarouselNav = ({ prevImage, nextImage, isTransitioning }: CarouselNavProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={prevImage}
        className={cn(NAV_BUTTON, "left-3")}
        aria-label="Previous image"
        disabled={isTransitioning}
      >
        <RxCaretLeft className="size-6 text-room-hi" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextImage}
        className={cn(NAV_BUTTON, "right-3")}
        aria-label="Next image"
        disabled={isTransitioning}
      >
        <RxCaretRight className="size-6 text-room-hi" />
      </Button>
    </>
  );
};

interface ProjectCarouselProps {
  images: string[];
  videoUrl?: string;
  onExpand?: () => void;
  autoplay?: boolean;
  controls?: boolean;
  modal?: boolean;
  projectTitle?: string;
  projectDesc?: string;
  className?: string;
  isShowcase?: boolean;
  containerStyle?: CSSProperties;
}

const ProjectCarousel = ({
  images,
  videoUrl,
  autoplay = true,
  controls = false,
  modal = false,
  projectTitle = "",
  projectDesc = "",
  className = "",
  isShowcase = false,
  containerStyle = {},
}: ProjectCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const { isMobile } = useMedia();

  const nextImage = () => {
    if (isTransitioning || (images.length <= 1 && !videoUrl)) return;
    const totalItems = videoUrl ? images.length + 1 : images.length;

    // If we have a video and it's the current slide, force navigation regardless of ended state in modal view
    // or if the video has ended in regular view
    if (videoUrl && currentIndex === 0 && !videoEnded && !modal) {
      // In regular view, if video hasn't ended, force it to end and pause
      pauseVideo();
      setVideoEnded(true); // Mark as ended so we can navigate
    }

    // Pause video if we're moving away from it
    if (videoUrl && currentIndex === 0) {
      pauseVideo();
    }

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);

    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDurationMs());
  };

  // Function to go to previous image
  const prevImage = () => {
    if (isTransitioning || (images.length <= 1 && !videoUrl)) return;

    const totalItems = videoUrl ? images.length + 1 : images.length;

    // Pause video if we're moving away from it
    if (videoUrl && currentIndex === 0) {
      pauseVideo();
      setVideoEnded(true); // Mark as ended so we can navigate back to it later
    }

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);

    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDurationMs());
  };
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  // Handle video ended event
  const handleVideoEnded = () => {
    setVideoEnded(true);
    // Start the carousel after video ends
    if (autoplay) {
      nextImage();
    }
  };

  // Reset video ended state when returning to the video slide
  useEffect(() => {
    if (videoUrl && currentIndex === 0) {
      // If we navigate back to the video slide, reset the ended state
      // but only if the video is actually at the beginning
      const videoElement = modal ? modalVideoRef.current : videoRef.current;
      if (videoElement && videoElement.currentTime === 0) {
        setVideoEnded(false);
      }
    }
  }, [currentIndex, videoUrl, modal]);

  // Watch for index changes to pause video when navigating away
  useEffect(() => {
    // If we moved away from the video slide, pause the video
    if (videoUrl && currentIndex !== 0) {
      pauseVideo();
    }
  }, [currentIndex, videoUrl]);

  // Start autoplay when hovered or when autoplay is always on
  useEffect(() => {
    // Only start autoplay if:
    // 1. Autoplay is enabled AND (user is hovering OR it's in modal view)
    // 2. If there's a video, it must have ended or we're in modal view
    if ((autoplay && isHovered) || (autoplay && modal)) {
      if (videoUrl && currentIndex === 0 && !videoEnded && !modal) {
        // If we're on the video slide and it hasn't ended, don't start the carousel
        return;
      }

      intervalRef.current = setInterval(() => {
        nextImage();
      }, AUTOPLAY_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isHovered,
    currentIndex,
    autoplay,
    modal,
    images.length,
    isTransitioning,
    videoUrl,
    videoEnded,
  ]);

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (videoUrl && currentIndex === 0 && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current!.play().catch((err) => {
          console.error("Video play failed:", err);
        });
      }, VIDEO_HOVER_DELAY_MS);

      setHoverTimer(timer);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }

    if (videoUrl && currentIndex === 0) {
      pauseVideo();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // go to a specific slide for nav dots
  const goToSlide = (index: number) => {
    if (isTransitioning) return;

    // pause video when moving to a new slide
    if (videoUrl && currentIndex === 0 && index !== 0) {
      pauseVideo();

      // mark video as ended so we can navigate back to it later
      setVideoEnded(true);
    }

    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, slideDurationMs());
  };

  // Handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (open && videoUrl && currentIndex === 0) {
      setTimeout(() => {
        if (modalVideoRef.current) {
          modalVideoRef.current.play().catch((err) => {
            console.error("Video play failed in dialog:", err);
          });
        }
      }, 300);
    } else if (!open) {
      pauseVideo();
    }
  };

  const handleVideoClick = (
    e: React.MouseEvent<HTMLVideoElement>,
    isModalView: boolean
  ) => {
    if (isModalView) {
      return;
    }

    e.stopPropagation();
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement
          .play()
          .then(() => {
            setIsHovered(true);
          })
          .catch((err) => {
            console.error("Video play failed on click:", err);
          });
      } else {
        videoElement.pause();
        setIsHovered(false);
      }
    }
  };

  const renderCarouselContent = (isModalView = false) => {
    const totalItems = videoUrl ? images.length + 1 : images.length;
    return (
      <div
        className={cn(`relative flex h-full w-full flex-col overflow-hidden`, {
          "aspect-auto": isModalView,
          "h-[70%]": isModalView && isMobile,
        })}
        onMouseEnter={!isModalView ? handleMouseEnter : undefined}
        onMouseLeave={!isModalView ? handleMouseLeave : undefined}
      >
        {/* Slide container */}
        {/* A fixed viewport for the track to slide inside. The clip has to
            live here, not on the track: the track is the thing that moves,
            so clipping it would carry its own window off-screen with it. */}
        <div
          className={cn(
            "w-full",
            isModalView
              ? "min-h-0 flex-1 overflow-hidden rounded-xl bg-[#0F0D1E]"
              : "h-[90%] sm:h-[95%]"
          )}
        >
          <div
            className="flex h-full w-full transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {/* video slide */}
            {videoUrl && (
              <div className="flex h-full w-full min-w-full flex-shrink-0 flex-grow-0 items-center justify-center bg-black">
                <video
                  ref={isModalView ? modalVideoRef : videoRef}
                  className={cn(`max-h-full max-w-full`, {
                    "h-[50vh]": isShowcase && !isModalView,
                  })}
                  src={videoUrl}
                  controls={isModalView}
                  muted={true}
                  autoPlay={false}
                  playsInline
                  poster={images[0]}
                  onClick={(e) => handleVideoClick(e, isModalView)}
                  onEnded={handleVideoEnded}
                />
              </div>
            )}

            {/* image slides */}
            {images.map((image, index) => (
              <div
                key={index}
                className="flex h-full w-full min-w-full flex-shrink-0 flex-grow-0 items-center justify-center bg-black"
              >
                <img
                  src={image}
                  alt={`Slide ${videoUrl ? index + 2 : index + 1}`}
                  className={cn(`max-w-full object-contain`, {
                    "h-[50vh]": isShowcase && !isModalView,
                  })}
                  // style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* counter */}
        {(images.length > 1 || videoUrl) && (
          <div
            className={cn(
              "absolute right-2 z-20 rounded-lg border border-[var(--room-line)] bg-room-ground/80 px-2 py-1 font-mono text-[11px] text-room-mid tabular-nums backdrop-blur-sm",
              {
                "bottom-2": !isModalView || !isMobile,
                "bottom-4": isModalView && isMobile,
              }
            )}
          >
            {currentIndex + 1}/{totalItems}
          </div>
        )}

        {/* Open the current slide full size. A screenshot of a dashboard is
            unreadable at 659px wide, which is the whole point of showing it. */}
        {isModalView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
            aria-label="View this image full size"
            className={cn(
              "absolute top-3 right-3 z-20 size-10 rounded-xl",
              "border border-[var(--room-line)] bg-room-ground/80 backdrop-blur-sm",
              "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              "hover:border-room-accent hover:bg-room-ground focus-visible:border-room-accent focus-visible:outline-none"
            )}
          >
            <HiArrowsExpand className="size-4 text-room-hi" />
          </Button>
        )}

        {/* nav for modal */}
        {(isModalView || controls) && (images.length > 1 || videoUrl) && (
          <CarouselNav
            prevImage={prevImage}
            nextImage={nextImage}
            isTransitioning={isTransitioning}
          />
        )}

        {/* Thumbnail strip: the mockup's indicator. It says which slide you
            are on and how many there are, and doubles as the way to jump —
            which a row of dots cannot do once there are a dozen of them. */}
        {isModalView && (images.length > 1 || videoUrl) && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {(videoUrl ? [null, ...images] : images).map((slide, index) => {
              const active = currentIndex === index;
              return (
                <button
                  key={slide ?? "video"}
                  type="button"
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  aria-label={`Go to ${slide === null ? "video" : `image ${videoUrl ? index : index + 1}`}`}
                  aria-current={active}
                  // Block body: a React 19 ref callback may only return a
                  // cleanup function, and the expression form returned false.
                  ref={(node) => {
                    if (active)
                      node?.scrollIntoView({ block: "nearest", inline: "center" });
                  }}
                  className={cn(
                    "relative h-[60px] w-[104px] flex-none cursor-pointer overflow-hidden rounded-[10px]",
                    "transition-[border-color,opacity] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                    "focus-visible:outline-none",
                    active
                      ? "border-2 border-room-accent opacity-100"
                      : "border border-[var(--room-line)] opacity-60 hover:opacity-100 focus-visible:opacity-100"
                  )}
                >
                  {slide === null ? (
                    <span className="flex h-full w-full items-center justify-center bg-[#0F0D1E]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-room-hi"
                        aria-hidden="true"
                      >
                        <path d="m9 6 9 6-9 6z" />
                      </svg>
                    </span>
                  ) : (
                    <img
                      src={slide}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* reg view nav */}
        {!controls && !isModalView && (images.length > 1 || videoUrl) && isHovered && (
          <CarouselNav
            prevImage={prevImage}
            nextImage={nextImage}
            isTransitioning={isTransitioning}
          />
        )}

        {/* Video play indicator for non-modal view */}
        {videoUrl && currentIndex === 0 && !isModalView && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                `rounded-full bg-black/50 p-4 transition-opacity duration-1500`,
                {
                  "opacity-0": isHovered,
                  "opacity-70": !isHovered,
                }
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!images || (images.length === 0 && !videoUrl)) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-800">
        No media
      </div>
    );
  }

  // Already inside a dialog: render the carousel plus its own full-size view.
  if (modal) {
    const slideImage = videoUrl ? images[currentIndex - 1] : images[currentIndex];
    return (
      <>
        {renderCarouselContent(true)}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            showCloseButton={false}
            // Above the project dialog, which already sits above the intro logo.
            overlayClassName="z-[130] bg-[rgb(6_5_12/0.92)]"
            className="z-[140] w-[96vw] max-w-[96vw] place-items-center border-none bg-transparent p-0 shadow-none sm:max-w-[96vw]"
          >
            <DialogTitle className="sr-only">
              {projectTitle ? `${projectTitle} — full size` : "Full size image"}
            </DialogTitle>
            {slideImage ? (
              <img
                src={slideImage}
                alt=""
                className="mx-auto max-h-[92vh] w-auto rounded-xl object-contain"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                playsInline
                className="mx-auto max-h-[92vh] w-auto rounded-xl"
              />
            )}
            <DialogClose
              aria-label="Close full size image"
              className="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--room-line-strong)] bg-room-ground/80 text-room-hi backdrop-blur-sm transition-colors duration-[var(--dur-fast)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`} style={containerStyle}>
      {/* not modal view */}
      {renderCarouselContent(false)}

      {/* modal view */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-20 rounded bg-black/50 p-1 text-white transition-all hover:bg-black hover:text-white"
            aria-label="Expand carousel"
          >
            <HiArrowsExpand />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[95vw] overflow-hidden border-gray-700 bg-gray-800 p-0 text-white md:max-w-[85vw] lg:max-w-[75vw]">
          <DialogHeader className="border-b border-gray-700 p-3 md:p-4">
            <DialogTitle>{projectTitle || "Project Gallery"}</DialogTitle>
          </DialogHeader>
          <div className="p-0 md:p-2">
            <div
              className={cn("", {
                "h-[60vh] overflow-y-auto": isMobile,
                "h-[65vh] md:h-[85vh]": !isMobile,
              })}
            >
              {renderCarouselContent(true)}
              <div className="relative h-3"></div>
              {isMobile && projectDesc && (
                <div className="px-4 py-3 text-sm">
                  <p className="leading-5 text-gray-300">{projectDesc}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectCarousel;

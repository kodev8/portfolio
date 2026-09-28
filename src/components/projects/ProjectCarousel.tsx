import { useState, useEffect, useRef, type CSSProperties } from "react";
import {
  Dialog,
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

interface CarouselNavProps {
  prevImage: () => void;
  nextImage: () => void;
  isTransitioning: boolean;
}

const CarouselNav = ({ prevImage, nextImage, isTransitioning }: CarouselNavProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={prevImage}
        className="absolute top-1/2 left-2 z-20 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black hover:text-white"
        aria-label="Previous image"
        disabled={isTransitioning}
      >
        <RxCaretLeft className="size-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextImage}
        className="absolute top-1/2 right-2 z-20 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black hover:text-white"
        aria-label="Next image"
        disabled={isTransitioning}
      >
        <RxCaretRight className="size-6" />
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
    }, 500);
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
    }, 500);
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
      }, 5000);
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
      }, 1500);

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
    }, 500);
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
        <div
          className="flex h-[90%] w-full transition-transform duration-500 ease-in-out sm:h-[95%]"
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

        {/* counter */}
        {(images.length > 1 || videoUrl) && (
          <div
            className={cn(
              "absolute right-2 z-20 rounded bg-black/50 px-2 py-1 text-xs text-white hover:bg-black hover:text-white",
              {
                "bottom-2": !isModalView || !isMobile,
                "bottom-4": isModalView && isMobile,
              }
            )}
          >
            {currentIndex + 1}/{totalItems}
          </div>
        )}

        {/* nav for modal */}
        {(isModalView || controls) && (images.length > 1 || videoUrl) && (
          <CarouselNav
            prevImage={prevImage}
            nextImage={nextImage}
            isTransitioning={isTransitioning}
          />
        )}

        {/* nav dots */}
        {isModalView && (images.length > 1 || videoUrl) && (
          <div className="z-20 mx-auto flex translate-y-4 space-x-2 sm:translate-y-3">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-gray-500"
                } transition-colors duration-300`}
                aria-label={`Go to ${
                  index === 0 && videoUrl
                    ? "video"
                    : `image ${videoUrl ? index : index + 1}`
                }`}
                disabled={isTransitioning}
              />
            ))}
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

  // If this is already a modal view, just render the carousel
  if (modal) {
    return renderCarouselContent(true);
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

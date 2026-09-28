import React, { useRef, useState, useEffect, memo } from "react";
import { Html } from "@react-three/drei";
import { useHero } from "../../context/HeroContext";
import { useThree } from "@react-three/fiber";
import type { Mesh } from "three";
import type { OrbitControls } from "three-stdlib";
import {
  videos,
  credits,
  projects,
  contactInfo,
  desktopProjectsText,
  viewLiveText,
  viewGitHubText,
  previousText,
  nextText,
  contactText,
  downloadResumeText,
  windowLabels,
  assetsPaths,
} from "../../constants";
import { marked } from "marked";
import { useLanguage } from "../../context/LanguageContext";
import type { Language, Project, VideoClip } from "../../types";
const START_X = 50;
const START_Y = 0;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;
const WINDOW_FACTOR = 400;

type DesktopProject = Project & { longDesc?: string };

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

interface DesktopScreenProps {
  width: number;
  height: number;
}

const DesktopScreen = ({ width, height }: DesktopScreenProps) => {
  const { language } = useLanguage();
  const meshRef = useRef<Mesh>(null);
  const { controls } = useThree();
  const { isInteracting } = useHero();
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<
    Record<string, WindowPosition>
  >({});
  const [isDragging, setIsDragging] = useState<string | false>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<string | null>(null);
  const [windowSizes, setWindowSizes] = useState<Record<string, WindowSize>>({});
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [isHovered, setIsHovered] = useState(false);
  const [readMesFetched, setReadMesFetched] = useState(false);
  const [projectData, setProjectData] = useState<DesktopProject[]>(projects);
  const originalSizeRef = useRef<{
    size?: WindowSize;
    position?: WindowPosition;
  }>({});

  const fetchReadme = async (project: DesktopProject) => {
    if (!project.readmeUrl) return;
    const response = await fetch(project.readmeUrl);
    if (!response.ok) {
      return;
    }
    const data = await response.text();
    const html = marked(data) as string;
    setProjectData((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, longDesc: html } : p))
    );
  };

  const bringToFront = (windowType: string) => {
    if (windowType === activeWindow) return;
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindowZIndices((prev) => ({
      ...prev,
      [windowType]: newZIndex,
    }));
    setActiveWindow(windowType);
  };

  const handleIconClick = (type: string) => {
    if (minimizedWindows.includes(type)) {
      setMinimizedWindows(minimizedWindows.filter((window) => window !== type));
      bringToFront(type);
      return;
    }
    if (openWindows.includes(type)) {
      bringToFront(type);
      return;
    }

    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setOpenWindows((prev) => [...prev, type]);
    if (!readMesFetched && type === "projects") {
      projectData.forEach(async (project) => {
        await fetchReadme(project);
      });
      setReadMesFetched(true);
    }
    setActiveWindow(type);

    // update z index z index
    setWindowZIndices((prev) => ({
      ...prev,
      [type]: newZIndex,
    }));

    //  cascade effect for multiple windows
    const offset = openWindows.length * 20;
    const newPosition = {
      x: START_X + offset,
      y: START_Y + offset,
    };

    setWindowPositions((prev) => ({
      ...prev,
      [type]: newPosition,
    }));

    // set default window size if not already set
    if (!windowSizes[type]) {
      setWindowSizes((prev) => ({
        ...prev,
        [type]: {
          width: Math.min(
            DEFAULT_WIDTH,
            width * WINDOW_FACTOR - (START_X + offset + 20)
          ),
          height: Math.min(
            DEFAULT_HEIGHT,
            height * WINDOW_FACTOR - (START_Y + offset + 20)
          ),
          x: START_X + offset,
          y: START_Y + offset,
        },
      }));
    }
  };

  const handleCloseWindow = (type: string) => {
    // Remove from open windows
    setOpenWindows((prev) => prev.filter((window) => window !== type));

    // consolidate activate window by chosing next highest z
    if (activeWindow === type) {
      const remainingWindows = openWindows.filter((window) => window !== type);
      if (remainingWindows.length > 0) {
        const highestWindow = remainingWindows.reduce((highest, current) => {
          return windowZIndices[current] > windowZIndices[highest] ? current : highest;
        }, remainingWindows[0]);

        setActiveWindow(highestWindow);
      } else {
        setActiveWindow(null);
      }
    }

    if (maximizedWindow === type) {
      setMaximizedWindow(null);
    }

    if (minimizedWindows.includes(type)) {
      setMinimizedWindows(minimizedWindows.filter((window) => window !== type));
    }
  };

  const handleMinimizeWindow = (type: string) => {
    if (!minimizedWindows.includes(type)) {
      setMinimizedWindows([...minimizedWindows, type]);

      // undo maximize
      if (maximizedWindow === type) {
        setMaximizedWindow(null);
      }

      if (activeWindow === type) {
        const visibleWindows = openWindows.filter(
          (window) => !minimizedWindows.includes(window) && window !== type
        );

        // sort by z to get highest to set as active
        if (visibleWindows.length > 0) {
          const highestWindow = visibleWindows.reduce((highest, current) => {
            return windowZIndices[current] > windowZIndices[highest]
              ? current
              : highest;
          }, visibleWindows[0]);
          setActiveWindow(highestWindow);
        } else {
          setActiveWindow(null);
        }
      }
    }
  };

  const handleMaximizeWindow = (type: string) => {
    if (maximizedWindow === type) {
      setMaximizedWindow(null);

      setWindowPositions((prev) => ({
        ...prev,
        [type]: originalSizeRef.current.position || { x: START_X, y: START_Y },
      }));

      setWindowSizes((prev) => ({
        ...prev,
        [type]: originalSizeRef.current.size || { width: 600, height: 450 },
      }));
    } else {
      // save current size and position
      originalSizeRef.current = {
        size: windowSizes[type],
        position: windowPositions[type] || { x: 50, y: 50 },
      };

      setMaximizedWindow(type);

      setWindowPositions((prev) => ({
        ...prev,
        [type]: { x: 0, y: 0 },
      }));

      setWindowSizes((prev) => ({
        ...prev,
        [type]: {
          width: width * WINDOW_FACTOR - 20,
          height: height * WINDOW_FACTOR - 60,
        },
      }));
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, windowType: string) => {
    (controls as unknown as OrbitControls).enabled = false;
    if (maximizedWindow === windowType) return;
    bringToFront(windowType);

    if ((e.target as HTMLElement).closest(".window-header")) {
      e.preventDefault();
      e.stopPropagation();

      const currentPosition = windowPositions[windowType] || { x: 0, y: 0 };

      //  offset from the mouse position to the window position
      const offsetX = e.clientX - currentPosition.x;
      const offsetY = e.clientY - currentPosition.y;

      setIsDragging(windowType);
      setDragOffset({
        x: offsetX,
        y: offsetY,
      });

      // console.log("Drag start:", {
      //   windowType,
      //   mousePos: { x: e.clientX, y: e.clientY },
      //   windowPos: currentPosition,
      //   offset: { x: offsetX, y: offsetY },
      // });
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    const windowWidth = windowSizes[isDragging]?.width || 600;
    const windowHeight = windowSizes[isDragging]?.height || 450;

    const containerWidth = width * WINDOW_FACTOR;
    const containerHeight = height * WINDOW_FACTOR;

    const maxX = containerWidth - windowWidth;
    const maxY = containerHeight - windowHeight;

    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setWindowPositions((prev) => ({
      ...prev,
      [isDragging]: {
        x: constrainedX,
        y: constrainedY,
      },
    }));

    // console.log("Dragging:", {
    //   mouse: { x: mouseX, y: mouseY },
    //   offset: dragOffset,
    //   new: { x: newX, y: newY },
    //   constrained: { x: constrainedX, y: constrainedY },
    // });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    (controls as unknown as OrbitControls).enabled = true;
  };

  const handleWindowClick = (
    e: React.MouseEvent<HTMLDivElement>,
    windowType: string
  ) => {
    bringToFront(windowType);
    e.stopPropagation();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <mesh ref={meshRef}>
      {/* this mesh will detect clicks and hover */}
      <mesh
        onClick={() => setIsHovered(false)}
        onPointerEnter={() => !isInteracting && setIsHovered(true)}
        onPointerLeave={() => !isInteracting && setIsHovered(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {isHovered && (
        <mesh>
          <planeGeometry args={[width + 0.1, height + 0.1]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
      <Html
        transform
        position={[0, 0, 0.02]}
        pointerEvents={isInteracting ? "auto" : "none"}
        style={{
          width: `${width * WINDOW_FACTOR}px`,
          height: `${height * WINDOW_FACTOR}px`,
          backgroundColor: "blue",
        }}
        distanceFactor={1}
        zIndexRange={[10, 0]}
        prepend
        occlude="blending"
        // @ts-expect-error depthWrite is not a declared HtmlProps member; passed through as in the JSX original
        depthWrite={false}
      >
        {/* main container */}
        <div className="color-cycle relative m-0 flex h-full w-full flex-col items-start justify-start border-2 p-0">
          <div className="absolute top-2 left-2 mt-2 grid gap-4">
            {Object.keys(windowLabels).map((key, index) => (
              <div
                key={index}
                onClick={() => handleIconClick(key)}
                className="flex-col-center w-full cursor-pointer rounded-sm p-1 hover:bg-blue-300"
              >
                <div className="flex-center mb-[2px] font-[8px]">
                  <img
                    src={windowLabels[key].icon}
                    alt={windowLabels[key].header[language]}
                    className="h-4 w-4"
                  />
                </div>
                <div className="font-4xs w-fit font-semibold break-words">
                  {windowLabels[key].header[language]}
                </div>
              </div>
            ))}
          </div>

          {/* Windows */}
          {openWindows.map(
            (windowType) =>
              !minimizedWindows.includes(windowType) && (
                <div
                  key={windowType}
                  className={`window absolute overflow-hidden rounded bg-gray-200 shadow-lg ${
                    activeWindow === windowType ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{
                    left: `${windowPositions[windowType]?.x || 0}px`,
                    top: `${windowPositions[windowType]?.y || 0}px`,
                    width: `${windowSizes[windowType]?.width || 600}px`,
                    height: `${windowSizes[windowType]?.height || 450}px`,
                    zIndex: windowZIndices[windowType] || 1000,
                    transition:
                      isDragging === windowType
                        ? "none"
                        : "left 0.1s ease, top 0.1s ease",
                  }}
                  onClick={(e) => handleWindowClick(e, windowType)}
                  onMouseDown={(e) => handleDragStart(e, windowType)}
                >
                  <div className="window-header flex cursor-move items-center justify-between bg-blue-600 p-2">
                    <span className="font-bold text-white">
                      {windowLabels[windowType].header[language]}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMinimizeWindow(windowType);
                        }}
                      >
                        -
                      </button>
                      <button
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMaximizeWindow(windowType);
                        }}
                      >
                        {maximizedWindow === windowType ? "↙" : "□"}
                      </button>
                      <button
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseWindow(windowType);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {windowType === "resume" && <ResumeWindow language={language} />}
                  {windowType === "credits" && <CreditsWindow language={language} />}
                  {windowType === "projects" && (
                    <ProjectsWindow projectData={projectData} language={language} />
                  )}
                  {windowType === "videos" && <VideosWindow language={language} />}
                  {windowType === "contact" && <ContactWindow language={language} />}
                </div>
              )
          )}

          <div className="absolute bottom-0 left-0 flex h-15 w-full items-center gap-4 bg-gray-300 p-1">
            <span className="font-xs ml-1 cursor-pointer text-white">
              <img
                src={assetsPaths.images.desktop.logo}
                alt="Windows"
                className="h-8 w-8 rounded-lg"
              />
            </span>

            {/* taskbar */}
            {Object.keys(windowLabels).map((key, index) => (
              <div
                key={index}
                className={`font-xs cursor-pointer text-white ${
                  openWindows.includes(key)
                    ? activeWindow === key
                      ? "rounded bg-blue-600"
                      : "rounded bg-blue-400"
                    : ""
                } ${minimizedWindows.includes(key) ? "opacity-70" : ""} p-1`}
                onClick={() => handleIconClick(key)}
              >
                <img
                  src={windowLabels[key].icon}
                  alt={windowLabels[key].header[language]}
                  className="h-4 w-4"
                />
              </div>
            ))}

            <div className="font-2xs mr-2 ml-auto flex flex-col items-start justify-start text-white">
              <p>{new Date().toLocaleTimeString()}</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

// ----- window content components -----
const ResumeWindow = ({ language }: { language: Language }) => (
  <div className="window-content flex flex-col items-center">
    <iframe
      src={assetsPaths.files.resume}
      className="h-[400px] w-full"
      title={windowLabels.resume.header[language]}
    />
    <a
      href={assetsPaths.files.resume}
      download="kalev-keil-resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      {downloadResumeText[language]}
    </a>
  </div>
);

const CreditsWindow = ({ language }: { language: Language }) => (
  <div className="window-content text-black">
    <div className="h-[400px] overflow-y-auto rounded-md bg-gray-100 p-4 font-mono text-sm">
      <h2 className="mb-4 text-lg font-bold">
        {windowLabels.credits.header[language]}
      </h2>
      {credits.map((credit, index) => (
        <div key={index} className="mb-4 border-b border-gray-300 p-2">
          <p className="font-bold">{credit.name}</p>
          <p className="text-gray-600">{credit.msg[language]}</p>
          <a
            href={credit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {credit.url}
          </a>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsWindow = ({
  projectData,
  language,
}: {
  projectData: DesktopProject[];
  language: Language;
}) => {
  const [selectedProject, setSelectedProject] = useState<DesktopProject | null>(null);

  return (
    <div className="window-content">
      {selectedProject ? (
        <div className="p-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-4 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            {desktopProjectsText.backToProjects[language]}
          </button>
          <div className="rounded-md bg-white p-4 shadow">
            <h2 className="text-lg font-bold">{selectedProject.title}</h2>
            {selectedProject.thumbnail && (
              <img
                src={selectedProject.thumbnail}
                alt={selectedProject.title}
                className="my-2 h-40 w-full rounded object-contain"
              />
            )}
            <p className="my-2">{selectedProject.desc[language]}</p>
            <div className="my-2 flex flex-wrap gap-2">
              {selectedProject.stack.map((tech, idx) => (
                <span key={idx} className="rounded bg-gray-200 px-2 py-1 text-xs">
                  {tech}
                </span>
              ))}
            </div>

            {selectedProject.longDesc && (
              <div className="my-6">
                <h3 className="text-lg font-bold">
                  {desktopProjectsText.aboutThisProject[language]}
                </h3>
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{ __html: selectedProject.longDesc }}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {viewLiveText[language]}
                </a>
              )}

              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {viewGitHubText[language]}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[400px] overflow-y-auto bg-gray-100 p-4">
          <h2 className="mb-4 text-lg font-bold"></h2>
          <div className="grid grid-cols-1 gap-4">
            {projectData.map((project, index) => (
              <div
                key={index}
                className="flex cursor-pointer items-center rounded-md bg-white p-3 shadow hover:bg-gray-50"
                onClick={() => {
                  setSelectedProject(project);
                }}
              >
                <img
                  src={assetsPaths.images.desktop.folder}
                  alt="folder"
                  className="mr-3 h-6 w-6"
                />
                <span>{project.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VideosWindow = memo(({ language }: { language: Language }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="window-content">
      <div className="flex h-[400px] flex-col bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-bold">{currentVideo.title}</h2>
        <div className="relative flex flex-1 items-center justify-center bg-black">
          {currentVideo.type === "local" ? (
            <video
              src={currentVideo.url}
              controls
              poster={(currentVideo as VideoClip & { thumbnail?: string }).thumbnail}
              className="max-h-full max-w-full"
            />
          ) : (
            <iframe
              src={currentVideo.url.replace("watch?v=", "embed/")}
              className="h-full w-full"
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={prevVideo}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {previousText[language]}
          </button>
          <div className="text-center">
            {currentVideoIndex + 1} / {videos.length}
          </div>
          <button
            onClick={nextVideo}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {nextText[language]}
          </button>
        </div>
      </div>
    </div>
  );
});

const ContactWindow = ({ language }: { language: Language }) => (
  <div className="window-content">
    <div className="flex h-[400px] flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="mb-6 text-xl font-bold">{contactText[language]}</h2>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <svg
            className="mr-3 h-6 w-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-blue-500 hover:underline"
          >
            {contactInfo.email}
          </a>
        </div>

        <div className="mb-4 flex items-center">
          <svg
            className="mr-3 h-6 w-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
        </div>

        <div className="flex items-center">
          <svg
            className="mr-3 h-6 w-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default DesktopScreen;

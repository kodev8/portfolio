import { memo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
} from "lucide-react";
import {
  assetsPaths,
  contactInfo,
  contactText,
  credits,
  desktopProjectsText,
  downloadResumeText,
  nextText,
  orderedProjects,
  previousText,
  videos,
  viewGitHubText,
  viewLiveText,
  windowLabels,
} from "../../constants";
import type { Language, Project } from "../../types";
import ProjectReadme from "../projects/ProjectReadme";
import type { AppId } from "./desk";

/*
 * What runs inside each desktop window. The shells only draw chrome around
 * these, so both operating systems show exactly the same apps.
 */

const linkClass =
  "inline-flex items-center gap-1.5 rounded-md bg-room-accent px-3 py-1.5 text-xs font-semibold text-room-on-accent transition-opacity hover:opacity-90";

const GitHubGlyph = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInGlyph = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// ----- projects -----

const ProjectDetail = ({
  project,
  language,
  onBack,
}: {
  project: Project;
  language: Language;
  onBack: () => void;
}) => (
  <div className="flex flex-col gap-3 p-4">
    <button
      onClick={onBack}
      className="inline-flex w-fit items-center gap-1 text-xs text-room-mid hover:text-room-hi"
    >
      <ArrowLeft className="size-3.5" />
      {desktopProjectsText.backToProjects[language]}
    </button>

    <div className="flex items-start gap-3">
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt=""
          className="h-20 w-28 shrink-0 rounded-md border border-[var(--room-line)] object-cover"
        />
      )}
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-room-hi">{project.title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-room-mid">
          {project.desc[language]}
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {project.stack.map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-[var(--room-line)] px-2 py-0.5 text-[10px] text-room-mid"
        >
          {tech}
        </span>
      ))}
    </div>

    {(project.liveUrl || project.githubUrl) && (
      <div className="flex gap-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <ExternalLink className="size-3.5" />
            {viewLiveText[language]}
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--room-line-strong)] px-3 py-1.5 text-xs text-room-hi hover:bg-white/5"
          >
            <GitHubGlyph />
            {viewGitHubText[language]}
          </a>
        )}
      </div>
    )}

    {project.readmeUrl && (
      <section className="border-t border-[var(--room-line)] pt-3">
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-room-low uppercase">
          {desktopProjectsText.aboutThisProject[language]}
        </h3>
        <ProjectReadme url={project.readmeUrl} />
      </section>
    )}
  </div>
);

const ProjectsApp = ({ language }: { language: Language }) => {
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <ProjectDetail
        project={selected}
        language={language}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-1 p-3">
      {orderedProjects.map((project) => (
        <li key={project.id}>
          <button
            onClick={() => setSelected(project)}
            className="flex w-full flex-col items-center gap-1.5 rounded-md p-2 text-center hover:bg-white/8 focus-visible:bg-white/8"
          >
            <img src={assetsPaths.images.desktop.folder} alt="" className="size-10" />
            <span className="line-clamp-2 text-[11px] leading-tight text-room-hi">
              {project.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

// ----- the rest -----

const ResumeApp = ({ language }: { language: Language }) => (
  <div className="flex h-full flex-col">
    <iframe
      src={assetsPaths.files.resume}
      className="min-h-0 w-full flex-1 bg-white"
      title={windowLabels.resume.header[language]}
    />
    <div className="flex justify-end border-t border-[var(--room-line)] p-2">
      <a
        href={assetsPaths.files.resume}
        download="kalev-keil-resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Download className="size-3.5" />
        {downloadResumeText[language]}
      </a>
    </div>
  </div>
);

const CreditsApp = ({ language }: { language: Language }) => (
  <ul className="flex flex-col gap-1 p-3">
    {credits.map((credit) => (
      <li key={credit.url} className="rounded-md p-2 hover:bg-white/5">
        <a
          href={credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-room-hi hover:text-room-accent"
        >
          {credit.name}
        </a>
        <p className="mt-0.5 text-[11px] leading-snug text-room-mid">
          {credit.msg[language]}
        </p>
      </li>
    ))}
  </ul>
);

const VideosApp = memo(({ language }: { language: Language }) => {
  const [index, setIndex] = useState(0);
  const clip = videos[index];
  if (!clip) return null;

  const step = (by: number) =>
    setIndex((i) => (i + by + videos.length) % videos.length);

  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-black">
        {clip.type === "local" ? (
          <video
            key={clip.url}
            src={clip.url}
            controls
            className="max-h-full max-w-full"
          />
        ) : (
          <iframe
            src={clip.url.replace("watch?v=", "embed/")}
            className="h-full w-full"
            title={clip.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-room-mid">
        <button
          onClick={() => step(-1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/8 hover:text-room-hi"
        >
          <ChevronLeft className="size-3.5" />
          {previousText[language]}
        </button>
        <span>
          {clip.title} · {index + 1}/{videos.length}
        </span>
        <button
          onClick={() => step(1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/8 hover:text-room-hi"
        >
          {nextText[language]}
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
});

const ContactApp = ({ language }: { language: Language }) => {
  const rows = [
    {
      href: `mailto:${contactInfo.email}`,
      label: contactInfo.email,
      icon: <Mail className="size-3.5" />,
    },
    { href: contactInfo.github, label: "GitHub", icon: <GitHubGlyph /> },
    { href: contactInfo.linkedin, label: "LinkedIn", icon: <LinkedInGlyph /> },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <h2 className="text-sm font-semibold text-room-hi">{contactText[language]}</h2>
      <ul className="flex w-full max-w-xs flex-col gap-1.5">
        {rows.map((row) => (
          <li key={row.href}>
            <a
              href={row.href}
              target={row.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-[var(--room-line)] px-3 py-2 text-xs text-room-hi hover:border-[var(--room-line-strong)] hover:bg-white/5"
            >
              <span className="text-room-accent">{row.icon}</span>
              <span className="truncate">{row.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AppContent = ({ id, language }: { id: AppId; language: Language }) => {
  switch (id) {
    case "projects":
      return <ProjectsApp language={language} />;
    case "videos":
      return <VideosApp language={language} />;
    case "credits":
      return <CreditsApp language={language} />;
    case "resume":
      return <ResumeApp language={language} />;
    case "contact":
      return <ContactApp language={language} />;
    default:
      return null;
  }
};

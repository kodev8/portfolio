import { useEffect, useState } from "react";
import { projectDialogText } from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import { renderMarkdown } from "../../utils/markdown";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; html: string }
  | { status: "failed" };

/** Fetched readmes, so reopening a project does not refetch it. */
const cache = new Map<string, string>();

/**
 * The readme, fetched and rendered.
 *
 * Every project already carries a `readmeUrl`, but until now only the 3D
 * desktop screen fetched one — the 2D site showed images and nothing else.
 * This is the longest-form writing about each project and it costs one request.
 */
const ProjectReadme = ({ url }: { url?: string }) => {
  const { language } = useLanguage();
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    if (!url) {
      setState({ status: "idle" });
      return;
    }

    const cached = cache.get(url);
    if (cached !== undefined) {
      setState({ status: "ready", html: cached });
      return;
    }

    // Closing the dialog mid-flight must not set state on a gone component,
    // and must not leave the request running either.
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.text();
      })
      .then((text) => {
        const html = renderMarkdown(text);
        cache.set(url, html);
        setState({ status: "ready", html });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "failed" });
      });

    return () => controller.abort();
  }, [url]);

  if (!url) {
    return (
      <p className="text-sm text-room-low">{projectDialogText.readmeNone[language]}</p>
    );
  }

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="flex flex-col gap-2.5" aria-busy="true">
        <span className="sr-only">{projectDialogText.readmeLoading[language]}</span>
        {["100%", "92%", "74%", "88%", "60%"].map((width, index) => (
          <span
            key={index}
            style={{ width }}
            className="block h-2.5 rounded-full bg-[var(--room-line)]"
          />
        ))}
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <p className="text-sm text-room-low">
        {projectDialogText.readmeFailed[language]}
      </p>
    );
  }

  return (
    <div
      className="readme-body text-sm leading-relaxed text-room-mid"
      // Sanitised in renderMarkdown: a readme is third-party content even when
      // it is your own, because GitHub passes raw HTML straight through.
      dangerouslySetInnerHTML={{ __html: state.html }}
    />
  );
};

export default ProjectReadme;

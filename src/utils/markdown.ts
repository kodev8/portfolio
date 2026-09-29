import { marked } from "marked";

const BLOCKED_TAGS = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "style",
  "link",
  "meta",
  "base",
]);

const isSafeUrl = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  // Relative and anchor links are fine; only the script-bearing schemes are not.
  return !trimmed.startsWith("javascript:") && !trimmed.startsWith("data:text/html");
};

/**
 * Turn a README into HTML that is safe to inject.
 *
 * A README is third-party content even when it comes from your own repository:
 * GitHub renders raw HTML inside markdown, so `marked` faithfully passes through
 * whatever a file contains. That is fine for the `<p align="center">` and badge
 * images READMEs are full of, and not fine for anything that can execute, so the
 * output is walked once and the executable parts are removed.
 *
 * Done with DOMParser rather than a regular expression: parsing is what the
 * browser will do with the string anyway, so it is the only pass that sees the
 * same tags the browser would.
 */
export const renderMarkdown = (source: string): string => {
  const html = marked.parse(source, { async: false }) as string;

  if (typeof DOMParser === "undefined") return "";

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((element) => {
    if (BLOCKED_TAGS.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }

    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();

      // Every inline handler, in one sweep.
      if (name.startsWith("on")) {
        element.removeAttribute(attribute.name);
        continue;
      }

      if ((name === "href" || name === "src") && !isSafeUrl(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }

    // A readme's links leave the site, so they must not hand it the opener.
    if (element.tagName === "A" && element.getAttribute("href")) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  return doc.body.innerHTML;
};

export default renderMarkdown;

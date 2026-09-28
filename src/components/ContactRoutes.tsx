import type { ReactNode } from "react";
import { contactInfo, contactRoutesText } from "../constants";
import { useLanguage } from "../context/LanguageContext";

const RouteIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-room-accent"
    aria-hidden="true"
  >
    {children}
  </svg>
);

interface Route {
  key: string;
  href: string;
  value: string;
  external: boolean;
  icon: ReactNode;
}

/**
 * Replaces the stock illustration that used to fill this column. It was purple
 * and coral and matched nothing else on the page, and a list of real ways to
 * reach someone is more use on a contact section than a decorative figure.
 */
const ContactRoutes = () => {
  const { language } = useLanguage();

  const routes: Route[] = [
    {
      key: "email",
      href: `mailto:${contactInfo.email}`,
      value: contactInfo.email,
      external: false,
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </>
      ),
    },
    {
      key: "linkedin",
      href: contactInfo.linkedin,
      value: contactInfo.linkedin.replace(
        /^https?:\/\/(www\.)?linkedin\.com\/in\//,
        ""
      ),
      external: true,
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
        </>
      ),
    },
    {
      key: "github",
      href: contactInfo.github,
      value: contactInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, ""),
      external: true,
      icon: (
        <path d="M9 19c-4 1.4-4-2.2-5.6-2.8M15 21v-3.4a3 3 0 0 0-.8-2.3c2.6-.3 5.4-1.3 5.4-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.3S17 2.4 15 3.8a11.6 11.6 0 0 0-6 0C7 2.4 6.1 2.8 6.1 2.8a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4.7 9.3c0 4.7 2.8 5.7 5.4 6a3 3 0 0 0-.8 2.3V21" />
      ),
    },
    {
      key: "resume",
      href: contactInfo.resume,
      value: contactRoutesText.resumeValue[language],
      external: true,
      icon: (
        <>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M12 18v-6M9 15l3 3 3-3" />
        </>
      ),
    },
  ];

  return (
    <ul className="flex w-full flex-col gap-3">
      {routes.map((route) => (
        <li key={route.key}>
          <a
            href={route.href}
            {...(route.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--room-line)] bg-room-surface px-5 py-4 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-room-accent focus-visible:border-room-accent focus-visible:outline-none"
          >
            <RouteIcon>{route.icon}</RouteIcon>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-mono text-[11px] tracking-[0.08em] text-room-low uppercase">
                {contactRoutesText[route.key][language]}
              </span>
              <span className="truncate text-room-hi">{route.value}</span>
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-auto shrink-0 text-room-low transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ContactRoutes;

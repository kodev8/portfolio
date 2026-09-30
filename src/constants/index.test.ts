import { describe, expect, it } from "vitest";
import {
  aboutMe,
  assetsPaths,
  contactForm,
  contactHeader,
  credits,
  desktopOsText,
  experienceTabs,
  expCertifications,
  expEducationCards,
  expWorkCards,
  orderedProjects,
  heroWords,
  navBarImages,
  navLinks,
  projects,
  showCaseHeader,
  techStackGroups,
  techStackHeader,
  topNavLinks,
  videos,
  windowLabels,
  words,
} from "./index";
import type { ExperienceCard, Translated } from "../types";

const LANGUAGES = ["en", "fr"] as const;

/** Every leaf that the UI indexes with `[language]` must carry both locales. */
const expectTranslated = (value: Translated<unknown>, label: string) => {
  for (const lang of LANGUAGES) {
    expect(value?.[lang], `${label}.${lang}`).toBeDefined();
  }
};

describe("translated content", () => {
  it.each(Object.entries(heroWords))("heroWords.%s has both locales", (key, value) => {
    expectTranslated(value, `heroWords.${key}`);
  });

  it.each(Object.entries(aboutMe))("aboutMe.%s has both locales", (key, value) => {
    expectTranslated(value, `aboutMe.${key}`);
  });

  it.each(Object.entries(experienceTabs))(
    "experienceTabs.%s is fully translated",
    (key, tab) => {
      for (const field of ["title", "sub", "tabLabel"] as const) {
        expectTranslated(tab[field], `experienceTabs.${key}.${field}`);
      }
    }
  );

  it.each(Object.entries(desktopOsText))(
    "desktopOsText.%s has both locales",
    (key, value) => {
      expectTranslated(value, `desktopOsText.${key}`);
    }
  );

  it.each(Object.entries(windowLabels))(
    "windowLabels.%s has a translated header",
    (key, label) => {
      expectTranslated(label.header, `windowLabels.${key}.header`);
      expect(label.icon).toBeTruthy();
    }
  );

  it.each([
    ["showCaseHeader", showCaseHeader],
    ["techStackHeader", techStackHeader],
    ["contactHeader", contactHeader],
  ])("%s has a translated title and sub", (name, header) => {
    expectTranslated(header.title, `${name}.title`);
    expectTranslated(header.sub, `${name}.sub`);
  });

  it("gives every hero word list the same length in both locales", () => {
    expect(words.en).toHaveLength(words.fr.length);
    expect(words.en.length).toBeGreaterThan(0);
  });

  it("points every hero word at an image", () => {
    for (const lang of LANGUAGES) {
      for (const word of words[lang]) {
        expect(word.text, `${lang} word text`).toBeTruthy();
        expect(word.imgPath, `${lang} word imgPath`).toBeTruthy();
      }
    }
  });
});

describe("projects", () => {
  it("has no duplicate ids", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every project a plain-string title", () => {
    // DesktopScreen renders `project.title` directly. If one of these ever
    // becomes a { en, fr } map the heading silently renders blank.
    for (const project of projects) {
      expect(typeof project.title, `project ${project.id} title`).toBe("string");
      expect(project.title).toBeTruthy();
    }
  });

  it("translates every project description", () => {
    for (const project of projects) {
      expectTranslated(project.desc, `project ${project.id} desc`);
    }
  });

  it("gives every project something to show in a carousel", () => {
    for (const project of projects) {
      const slides = project.carousel ?? (project.thumbnail ? [project.thumbnail] : []);
      expect(slides.length, `project ${project.id} has no images`).toBeGreaterThan(0);
    }
  });

  it("lists a non-empty stack for every project", () => {
    for (const project of projects) {
      expect(project.stack.length, `project ${project.id} stack`).toBeGreaterThan(0);
    }
  });

  it("puts every project in a bucket", () => {
    for (const project of projects) {
      expect(["personal", "professional"], `project ${project.id} category`).toContain(
        project.category
      );
    }
  });

  it("orders featured projects first without dropping any", () => {
    expect(orderedProjects).toHaveLength(projects.length);
    const featuredCount = projects.filter((p) => p.featured).length;
    for (const [index, project] of orderedProjects.entries()) {
      expect(Boolean(project.featured), `position ${index}`).toBe(
        index < featuredCount
      );
    }
  });

  it("only uses absolute or root-relative urls", () => {
    for (const project of projects) {
      for (const url of [project.liveUrl, project.githubUrl, project.readmeUrl]) {
        if (url) expect(url).toMatch(/^https?:\/\//);
      }
    }
  });
});

describe("credits", () => {
  it("keeps name a plain string and msg translated", () => {
    // Mirrors the DesktopScreen credits window: name renders raw, msg by locale.
    for (const credit of credits) {
      expect(typeof credit.name).toBe("string");
      expect(credit.name).toBeTruthy();
      expectTranslated(credit.msg, `credit ${credit.name} msg`);
      expect(credit.url).toMatch(/^https?:\/\//);
    }
  });
});

describe("experience cards", () => {
  const all: [string, ExperienceCard][] = [
    ...expWorkCards.map((c, i) => [`work[${i}]`, c] as [string, ExperienceCard]),
    ...expEducationCards.map(
      (c, i) => [`education[${i}]`, c] as [string, ExperienceCard]
    ),
    ...expCertifications.map((c, i) => [`cert[${i}]`, c] as [string, ExperienceCard]),
  ];

  it.each(all)("%s translates title, date and location", (label, card) => {
    for (const field of ["title", "date", "location"] as const) {
      expectTranslated(card[field], `${label}.${field}`);
    }
  });

  it.each(all)("%s has matching bullet counts across locales", (label, card) => {
    expect(card.details.en.length, `${label} en bullets`).toBeGreaterThan(0);
    expect(card.details.fr.length, `${label} fr bullets`).toBe(card.details.en.length);
  });

  it.each(all)("%s has a logo", (_label, card) => {
    expect(card.logoPath).toBeTruthy();
  });

  it("keys cards uniquely by english title", () => {
    // Experience.tsx uses `card.title[language]` as the React key.
    for (const group of [expWorkCards, expEducationCards, expCertifications]) {
      for (const lang of LANGUAGES) {
        const keys = group.map((c) => c.title[lang]);
        expect(new Set(keys).size, `duplicate ${lang} title key`).toBe(keys.length);
      }
    }
  });
});

describe("tech stack", () => {
  it("translates every group name and fills it with icons", () => {
    for (const group of techStackGroups) {
      expectTranslated(group.name, "techStackGroup.name");
      expect(group.icons.length).toBeGreaterThan(0);
    }
  });

  it("gives every icon a model, an image and a 3-axis rotation", () => {
    for (const group of techStackGroups) {
      for (const icon of group.icons) {
        expect(icon.name, "icon name").toBeTruthy();
        expect(icon.modelPath, `${icon.name} modelPath`).toBeTruthy();
        expect(icon.imgPath, `${icon.name} imgPath`).toBeTruthy();
        expect(icon.rotation, `${icon.name} rotation`).toHaveLength(3);
        expect(icon.scale, `${icon.name} scale`).toBeGreaterThan(0);
      }
    }
  });

  it("has no duplicate icon names across groups", () => {
    const names = techStackGroups.flatMap((g) => g.icons.map((i) => i.name));
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("navigation", () => {
  it("keeps the top nav to in-page anchors", () => {
    // These drive scroll-spy in NavContext, so an external href would break it.
    for (const link of topNavLinks) {
      expect(link.href).toMatch(/^#/);
    }
  });

  it("gives every nav link an icon, a translated title and a usable href", () => {
    for (const link of navLinks) {
      expect(link.Icon, `nav ${link.href} icon`).toBeTypeOf("function");
      expectTranslated(link.title, `nav ${link.href}`);
      // A bucket-backed href is absolute in production mode and root-relative
      // in development, so accept both rather than pinning VITE_MODE.
      expect(link.href).toMatch(/^(#|\/|mailto:|https?:\/\/)/);
    }
  });

  it("translates the alt text on nav bar images", () => {
    for (const image of navBarImages) {
      expect(image.src).toBeTruthy();
      expectTranslated(image.alt, "navBarImage.alt");
    }
  });
});

describe("assets", () => {
  it("derives every path from the same bucket root", () => {
    const flatten = (node: unknown): string[] => {
      if (typeof node === "string") return [node];
      if (Array.isArray(node)) return node.flatMap(flatten);
      if (node && typeof node === "object") return Object.values(node).flatMap(flatten);
      return [];
    };
    const paths = flatten(assetsPaths);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path, `asset path "${path}"`).toMatch(/^(https?:\/\/|\/)/);
    }
  });

  it("numbers every video clip and marks it local", () => {
    expect(videos.length).toBeGreaterThan(0);
    videos.forEach((video, index) => {
      expect(video.title).toBe(`Clip ${index + 1}`);
      expect(video.type).toBe("local");
      expect(video.url).toBeTruthy();
    });
  });
});

describe("contact form copy", () => {
  it("translates every field label, placeholder and status message", () => {
    for (const [key, value] of Object.entries(contactForm)) {
      if (value && typeof value === "object" && "en" in value) {
        expectTranslated(value as Translated, `contactForm.${key}`);
      } else if (value && typeof value === "object") {
        for (const [sub, subValue] of Object.entries(value)) {
          expectTranslated(subValue as Translated, `contactForm.${key}.${sub}`);
        }
      }
    }
  });
});

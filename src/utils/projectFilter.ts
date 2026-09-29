import type { Project, ProjectCategory } from "../types";

export type ProjectFilter = ProjectCategory | "all";

export interface ProjectMatch {
  project: Project;
  /** Stack entries the query hit, in the order they appear on the project. */
  matchedStack: string[];
  /** True when the query hit the title rather than the stack. */
  matchedTitle: boolean;
}

const normalise = (value: string) => value.trim().toLowerCase();

/**
 * Filter by bucket and by a single query that searches the title *and* the
 * stack.
 *
 * One input rather than a search box plus a rack of technology chips: with nine
 * projects most stack entries return a single result, so a chip each would be a
 * wall of controls that answers one question. Reporting which stack entries
 * matched is what makes the combined search legible — otherwise a project
 * surviving a search for "neo4j" shows nothing on the card explaining why.
 */
export const filterProjects = (
  projects: Project[],
  filter: ProjectFilter,
  query: string
): ProjectMatch[] => {
  const needle = normalise(query);
  const inBucket =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  if (!needle) {
    return inBucket.map((project) => ({
      project,
      matchedStack: [],
      matchedTitle: false,
    }));
  }

  return inBucket
    .map((project) => ({
      project,
      matchedStack: project.stack.filter((tech) => normalise(tech).includes(needle)),
      matchedTitle: normalise(project.title).includes(needle),
    }))
    .filter((match) => match.matchedTitle || match.matchedStack.length > 0);
};

/** How many projects sit in each bucket, for the counts on the filter chips. */
export const countByFilter = (projects: Project[]): Record<ProjectFilter, number> => ({
  all: projects.length,
  personal: projects.filter((p) => p.category === "personal").length,
  professional: projects.filter((p) => p.category === "professional").length,
});

/**
 * Matched stack entries first, then the rest in their original order.
 *
 * The card shows only the first few tags, so without this a project can match a
 * search on a technology that is then cut off the visible list.
 */
export const stackWithMatchesFirst = (
  project: Project,
  matchedStack: string[]
): string[] => {
  if (matchedStack.length === 0) return project.stack;
  const matched = new Set(matchedStack);
  return [...matchedStack, ...project.stack.filter((tech) => !matched.has(tech))];
};

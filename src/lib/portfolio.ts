import type {
  Project as ProjectRecord,
  Skill as SkillRecord,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ProjectCardProps } from "@/components/projects/project-card";
import type { ProjectShowcaseListItem } from "@/components/projects/project-showcase-list";

export type PortfolioData = {
  cards: ProjectCardProps[];
  showcase: ProjectShowcaseListItem[];
  skills: {
    sectionName: string;
    skills: { name: string; icon: string }[];
  }[];
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const [projects, skills]: [ProjectRecord[], SkillRecord[]] =
    await Promise.all([
      prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

  const cards: ProjectCardProps[] = projects.map((project: ProjectRecord) => ({
    name: project.name,
    favicon: project.favicon,
    imageUrl: JSON.parse(project.imageUrl),
    description: project.description,
    sourceCodeHref: project.sourceCodeHref,
    ...(project.liveWebsiteHref
      ? { liveWebsiteHref: project.liveWebsiteHref }
      : {}),
  }));
  const showcase: ProjectShowcaseListItem[] = projects
    .filter(
      (project: ProjectRecord) =>
        project.showcaseTitle && project.showcaseLight,
    )
    .map((project: ProjectRecord, index: number) => ({
      index,
      title: project.showcaseTitle!,
      href: project.showcaseHref,
      tags: JSON.parse(project.showcaseTags),
      image: {
        LIGHT: project.showcaseLight!,
        ...(project.showcaseDark ? { DARK: project.showcaseDark } : {}),
      },
    }));
  const grouped = skills.reduce<
    Record<string, { name: string; icon: string }[]>
  >((result, skill: SkillRecord) => {
    (result[skill.sectionName] ??= []).push({
      name: skill.name,
      icon: skill.icon,
    });
    return result;
  }, {});

  return {
    cards,
    showcase,
    skills: Object.entries(grouped).map(
      ([sectionName, sectionSkills]: [
        string,
        { name: string; icon: string }[],
      ]) => ({
        sectionName,
        skills: sectionSkills,
      }),
    ),
  };
}

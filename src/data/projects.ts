import { type ProjectCardProps } from "@/components/projects/project-card";
import { type ProjectShowcaseListItem } from "@/components/projects/project-showcase-list";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export const PROJECT_SHOWCASE: ProjectShowcaseListItem[] = [
  {
    index: 1,
    title: "EatNaked",
    href: "/projects",
    tags: ["JavaScript", "Vite", "CSS", "Vercel", "Html"],
    image: {
      LIGHT: "/images/projects/eanaked.png",
      DARK: "/images/projects/eanaked-dark.png",
    },
  },
  {
    index: 2,
    title: "Rift Arena",
    href: "/projects",
    tags: ["Html"],
    image: {
      LIGHT: "/images/projects/rift-arena.png",
      DARK: "/images/projects/rift-arena-dark.png",
    },
  },
  {
    index: 3,
    title: "DHMS",
    href: "/projects",
    tags: ["JavaScript", "Vite", "CSS", "Vercel", "Html"],
    image: {
      LIGHT: "/images/projects/dhm.png",
      DARK: "/images/projects/dhm-dark.png",
    },
  },
];


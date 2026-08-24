require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const projects = [
  {
    name: "Rift Arena",
    favicon: "/images/projects/rift-arena.png",
    imageUrl: ["/images/projects/rift-arena.png"],
    description: "HTML",
    sourceCodeHref: "https://github.com/yummyhere/rift-arena",
    liveWebsiteHref: "https://yummyhere.github.io/rift-arena/",
    showcaseTitle: "Rift Arena",
    showcaseTags: ["HTML"],
    showcaseLight: "/images/projects/rift-arena.png",
  },
  {
    name: "Eat Naked",
    favicon: "/images/projects/eatnaked.png",
    imageUrl: ["/images/projects/eatnaked.png"],
    description: "HTML",
    sourceCodeHref: "https://github.com/yummyhere/eatnaked",
    liveWebsiteHref: "https://eatnaked.vercel.app/",
    showcaseTitle: "Eat Naked",
    showcaseTags: ["HTML"],
    showcaseLight: "/images/projects/eatnaked.png",
  },
  {
    name: "DHM",
    favicon: "/images/projects/dhm.png",
    imageUrl: ["/images/projects/dhm.png"],
    description: "HTML",
    sourceCodeHref: "https://github.com/yummyhere/DHMS",
    liveWebsiteHref: "https://dhms-alpha.vercel.app/",
    showcaseTitle: "DHM",
    showcaseTags: ["HTML"],
    showcaseLight: "/images/projects/dhm.png",
  },
];

const skills = [
  ["Languages", ["HTML", "CSS", "Javascript", "Typescript", "Python"]],
  [
    "Libraries and Frameworks",
    [
      "Reactjs",
      "Nextjs",
      "React Router Dom",
      "Tailwindcss",
      "Framer motion",
      "Vite",
    ],
  ],
  ["Backend", ["Nodejs", "Express"]],
  ["Databases and ORMs", ["MongoDB", "Postgress"]],
  ["Tools and Technologies", ["Git", "Docker"]],
];

async function main() {
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: projects.map((project) => ({
      ...project,
      imageUrl: JSON.stringify(project.imageUrl),
      showcaseTags: JSON.stringify(project.showcaseTags),
    })),
  });
  if ((await prisma.skill.count()) === 0)
    await prisma.skill.createMany({
      data: skills.flatMap(([sectionName, names], sectionIndex) =>
        names.map((name, sortOrder) => ({
          sectionName,
          name,
          icon: name.toLowerCase().replace(/[^a-z]/g, ""),
          sortOrder: sectionIndex * 100 + sortOrder,
        })),
      ),
    });
}

main().finally(() => prisma.$disconnect());

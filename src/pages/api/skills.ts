import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const grouped = skills.reduce<
      Record<string, { name: string; icon: string }[]>
    >((result, skill) => {
      (result[skill.sectionName] ??= []).push({
        name: skill.name,
        icon: skill.icon,
      });
      return result;
    }, {});
    return res.status(200).json(
      Object.entries(grouped).map(([sectionName, sectionSkills]) => ({
        sectionName,
        skills: sectionSkills,
      })),
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Unable to load skills" });
  }
}

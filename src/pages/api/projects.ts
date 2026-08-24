import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(
      projects.map((project) => ({
        ...project,
        imageUrl: JSON.parse(project.imageUrl),
        showcaseTags: JSON.parse(project.showcaseTags),
      })),
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Unable to load projects" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const projectSchema = Yup.object({
  name: Yup.string().trim().max(100).required(),
  favicon: Yup.string().trim().required(),
  imageUrl: Yup.array().of(Yup.string().trim().required()).min(1).required(),
  description: Yup.string().trim().max(5000).required(),
  sourceCodeHref: Yup.string().url().required(),
  liveWebsiteHref: Yup.string().url().nullable().default(null),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "POST") {
      const data = await projectSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      const project = await prisma.project.create({
        data: { ...data, imageUrl: JSON.stringify(data.imageUrl) },
      });
      return res.status(201).json(project);
    }
    if (req.method === "DELETE") {
      const id = Number(req.query.id);
      if (!Number.isInteger(id))
        return res
          .status(400)
          .json({ status: 400, message: "A valid project id is required" });
      await prisma.project.delete({ where: { id } });
      return res.status(200).json({ status: 200, message: "Project deleted" });
    }
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  } catch (error) {
    if (error instanceof Yup.ValidationError)
      return res.status(422).json({ status: 422, message: error.errors });
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Unable to update project" });
  }
}

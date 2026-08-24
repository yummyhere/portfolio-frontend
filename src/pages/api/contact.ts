import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { prisma } from "@/lib/prisma";
import { rateLimiterApi, getUserId } from "@/utility/rate-limiter";

const limiter = rateLimiterApi({
  interval: 3600000,
  uniqueTokenPerInterval: 100,
  getUserId,
});
const contactSchema = Yup.object({
  name: Yup.string().trim().min(2).max(100).required(),
  email: Yup.string().trim().email().max(200).required(),
  subject: Yup.string().trim().min(2).max(200).required(),
  message: Yup.string().trim().min(2).max(5000).required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  const limited = await limiter.check(res, req, 5);
  if (limited.status !== 200) return;

  try {
    const data = await contactSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const contact = await prisma.contactMessage.create({ data });
    return res.status(201).json({
      status: 201,
      message: "Contact message received",
      id: contact.id,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError)
      return res.status(422).json({ status: 422, message: error.errors });
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
}

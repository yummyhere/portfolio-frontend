import type { NextApiRequest, NextApiResponse } from "next";

export function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.ADMIN_TOKEN;
  const providedToken = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token || providedToken !== token) {
    res.status(401).json({ status: 401, message: "Unauthorized" });
    return false;
  }

  return true;
}

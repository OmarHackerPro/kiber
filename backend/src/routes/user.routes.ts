/**
 * User routes: get current user profile (protected).
 */
import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendError } from "../lib/errors";
import { requireAuth } from "../middleware/auth.middleware";
import { NotFoundError } from "../lib/errors";

const router = Router();

router.use(requireAuth);

/** GET /users/me - Current user profile (no password) */
router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

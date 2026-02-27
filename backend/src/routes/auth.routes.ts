/**
 * Auth routes: register, login, logout (client-side token discard), refresh.
 */
import { Router, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendError } from "../lib/errors";
import { requireAuth } from "../middleware/auth.middleware";
import { registerSchema, loginSchema, refreshSchema, type RegisterBody, type LoginBody } from "../validators/auth.validator";
import { ValidationError } from "../lib/errors";
import { logger } from "../lib/logger";

const router = Router();

/** POST /auth/register - Create account and return user + tokens */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const { body } = parsed.data as { body: RegisterBody };
    const result = await authService.register(body);
    logger.info("User registered", { email: body.email });
    res.status(201).json(result);
  } catch (err) {
    sendError(res, err);
  }
});

/** POST /auth/login - Return user + access & refresh tokens */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const { body } = parsed.data as { body: LoginBody };
    const result = await authService.login(body);
    logger.info("User logged in", { email: body.email });
    res.json(result);
  } catch (err) {
    sendError(res, err);
  }
});

/** POST /auth/logout - No server-side token invalidation; client discards tokens */
router.post("/logout", requireAuth, (req: Request, res: Response) => {
  // Optional: add refresh token to a blacklist (e.g. Redis) here
  logger.info("User logged out", { userId: req.userId });
  res.status(204).send();
});

/** POST /auth/refresh - Exchange refresh token for new access token */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const parsed = refreshSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const { refreshToken } = (parsed.data as { body: { refreshToken: string } }).body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.json(result);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

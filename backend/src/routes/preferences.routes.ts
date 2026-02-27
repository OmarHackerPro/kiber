/**
 * Preferences routes: get and update current user preferences (protected).
 */
import { Router, Request, Response } from "express";
import * as preferencesService from "../services/preferences.service";
import { sendError } from "../lib/errors";
import { requireAuth } from "../middleware/auth.middleware";
import { updatePreferencesSchema, type UpdatePreferencesBody } from "../validators/preferences.validator";
import { ValidationError } from "../lib/errors";

const router = Router();

router.use(requireAuth);

/** GET /preferences - Get current user preferences */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const prefs = await preferencesService.getPreferences(userId);
    res.json(prefs);
  } catch (err) {
    sendError(res, err);
  }
});

/** PATCH /preferences - Update current user preferences */
router.patch("/", async (req: Request, res: Response) => {
  try {
    const parsed = updatePreferencesSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const userId = req.userId!;
    const prefs = await preferencesService.updatePreferences(userId, (parsed.data as { body: UpdatePreferencesBody }).body);
    res.json(prefs);
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

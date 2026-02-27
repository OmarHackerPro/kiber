/**
 * Ingestion API: submit content through the validation -> transform -> storage pipeline.
 */
import { Router, Request, Response } from "express";
import { runIngestion } from "../ingestion";
import { sendError } from "../lib/errors";
import { requireAuth } from "../middleware/auth.middleware";
import { ingestionInputSchema, type IngestionInput } from "../validators/content.validator";
import { ValidationError } from "../lib/errors";

const router = Router();

router.use(requireAuth);

/** POST /ingestion - Run content through ingestion pipeline */
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = ingestionInputSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const authorId = req.userId!;
    const result = await runIngestion(parsed.data as IngestionInput, { authorId, source: "api" });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ contentId: result.contentId });
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

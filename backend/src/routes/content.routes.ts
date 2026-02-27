/**
 * Content routes: CRUD for content (create/list/get/update/delete).
 * Create/update/delete require auth; list/get can be public for published content.
 */
import { Router, Request, Response } from "express";
import * as contentService from "../services/content.service";
import { sendError } from "../lib/errors";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware";
import { createContentSchema, updateContentSchema, type CreateContentBody, type UpdateContentBody } from "../validators/content.validator";
import { ValidationError } from "../lib/errors";

const router = Router();

/** POST /contents - Create content (protected) */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createContentSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const authorId = req.userId!;
    const content = await contentService.createContent(authorId, (parsed.data as { body: CreateContentBody }).body);
    res.status(201).json(content);
  } catch (err) {
    sendError(res, err);
  }
});

/** GET /contents - List content (optional auth for drafts) */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as "DRAFT" | "PUBLISHED" | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const authorId = req.userId ?? undefined; // if not auth, only published
    const result = await contentService.listContent({
      status: status || (authorId ? undefined : "PUBLISHED"),
      authorId: req.query.authorId as string || authorId,
      limit,
      offset,
    });
    res.json(result);
  } catch (err) {
    sendError(res, err);
  }
});

/** GET /contents/:id - Get one content */
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const content = await contentService.getContentById(req.params.id, req.userId);
    res.json(content);
  } catch (err) {
    sendError(res, err);
  }
});

/** PATCH /contents/:id - Update content (protected, author or admin) */
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = updateContentSchema.safeParse(req);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error?.flatten());
    }
    const userId = req.userId!;
    const isAdmin = req.auth!.role === "ADMIN";
    const content = await contentService.updateContent(
      req.params.id,
      userId,
      isAdmin,
      (parsed.data as { body: UpdateContentBody }).body
    );
    res.json(content);
  } catch (err) {
    sendError(res, err);
  }
});

/** DELETE /contents/:id - Delete content (protected, author or admin) */
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const isAdmin = req.auth!.role === "ADMIN";
    await contentService.deleteContent(req.params.id, userId, isAdmin);
    res.status(204).send();
  } catch (err) {
    sendError(res, err);
  }
});

export default router;

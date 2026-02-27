/**
 * Validation for content create/update and ingestion input.
 */
import { z } from "zod";

export const contentStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);

export const createContentSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    body: z.string(),
    status: contentStatusEnum.optional().default("DRAFT"),
    tags: z.array(z.string()).optional().default([]),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const updateContentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    body: z.string().optional(),
    status: contentStatusEnum.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

/** Raw input for ingestion pipeline (e.g. from external source) */
export const ingestionInputSchema = z.object({
  title: z.string().min(1).max(500),
  body: z.string(),
  status: contentStatusEnum.optional().default("DRAFT"),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateContentBody = z.infer<typeof createContentSchema>["body"];
export type UpdateContentBody = z.infer<typeof updateContentSchema>["body"];
export type IngestionInput = z.infer<typeof ingestionInputSchema>;

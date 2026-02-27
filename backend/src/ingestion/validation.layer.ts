/**
 * Ingestion pipeline - Validation layer.
 * Validates raw input and returns a typed ValidatedContent or throws.
 */
import { ingestionInputSchema } from "../validators/content.validator";
import type { IngestionRawInput, ValidatedContent } from "./types";
import { logger } from "../lib/logger";

export function validateContentInput(raw: IngestionRawInput): ValidatedContent {
  const result = ingestionInputSchema.safeParse(raw);
  if (!result.success) {
    const err = result.error?.flatten();
    logger.warn("Ingestion validation failed", { errors: err, input: raw });
    throw new Error(`Validation failed: ${JSON.stringify(err)}`);
  }
  return result.data as ValidatedContent;
}

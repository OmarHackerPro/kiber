/**
 * Ingestion pipeline orchestrator: validate -> transform -> store.
 * Optional: enqueue job for async processing (scaffold only).
 */
import { logger } from "../lib/logger";
import { validateContentInput } from "./validation.layer";
import { transformContent } from "./transformation.layer";
import { storeContent } from "./storage.layer";
import type { IngestionRawInput, IngestionContext, IngestionResult } from "./types";

export async function runIngestion(
  raw: IngestionRawInput,
  context: IngestionContext
): Promise<IngestionResult> {
  const { authorId, jobId } = context;
  try {
    const validated = validateContentInput(raw);
    const transformed = transformContent(validated);
    const stored = await storeContent(transformed, context);
    logger.info("Ingestion completed", { contentId: stored.id, authorId, jobId });
    return { success: true, contentId: stored.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("Ingestion failed", { authorId, jobId, error: message });
    return { success: false, error: message };
  }
}

/**
 * Optional: enqueue ingestion for background processing.
 * Scaffold only - no actual queue implementation; would use Bull/BullMQ + Redis.
 */
export function enqueueIngestion(raw: IngestionRawInput, context: IngestionContext): void {
  logger.info("Enqueue ingestion (scaffold - no queue)", { authorId: context.authorId });
  // Example: await jobQueue.add('ingest', { raw, context });
  // For now we run synchronously; in production you would push to Redis and have a worker run runIngestion.
}

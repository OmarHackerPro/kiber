/**
 * Ingestion pipeline - Storage layer.
 * Persists transformed content to the database.
 */
import { prisma } from "../lib/prisma";
import type { TransformedContent, IngestionContext, StoredContent } from "./types";
import type { ContentStatus } from "../types/prisma-enums";
import { logger } from "../lib/logger";

export async function storeContent(
  transformed: TransformedContent,
  context: IngestionContext
): Promise<StoredContent> {
  const { authorId, jobId } = context;
  logger.info("Storing content", { authorId, jobId, title: transformed.title });
  const content = await prisma.content.create({
    data: {
      title: transformed.normalizedTitle ?? transformed.title,
      body: transformed.body,
      authorId,
      status: transformed.status,
      tags: JSON.stringify(transformed.tags),
      metadata: JSON.stringify(transformed.metadata),
    },
  });
  const stored: StoredContent = {
    ...content,
    status: content.status as ContentStatus,
    tags: JSON.parse(content.tags || "[]"),
    metadata: content.metadata ? JSON.parse(content.metadata) : {},
  };
  return stored;
}

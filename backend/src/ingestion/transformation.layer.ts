/**
 * Ingestion pipeline - Transformation layer.
 * Normalizes and enriches validated content (slug, excerpt, sanitization placeholder).
 */
import type { ValidatedContent, TransformedContent } from "./types";
import { logger } from "../lib/logger";

/** Create a URL-friendly slug from title */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** First N characters of body as excerpt */
function excerpt(body: string, maxLength = 160): string {
  const stripped = body.replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).trim() + "…";
}

export function transformContent(validated: ValidatedContent): TransformedContent {
  logger.debug("Transforming content", { title: validated.title });
  return {
    ...validated,
    normalizedTitle: validated.title.trim(),
    slug: slugify(validated.title),
    excerpt: excerpt(validated.body),
  };
}

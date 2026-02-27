/**
 * Ingestion pipeline types: raw input, validated payload, stored result.
 */
import type { ContentStatus } from "../types/prisma-enums";

export interface IngestionRawInput {
  title: string;
  body: string;
  status?: ContentStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/** After validation layer */
export interface ValidatedContent {
  title: string;
  body: string;
  status: ContentStatus;
  tags: string[];
  metadata: Record<string, unknown>;
}

/** After transformation (e.g. sanitize, normalize) */
export interface TransformedContent extends ValidatedContent {
  normalizedTitle?: string;
  slug?: string;
  excerpt?: string;
}

/** Result from storage layer */
export interface StoredContent {
  id: string;
  title: string;
  body: string;
  authorId: string;
  status: ContentStatus;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngestionContext {
  authorId: string;
  source?: string;
  jobId?: string;
}

export interface IngestionResult {
  success: boolean;
  contentId?: string;
  error?: string;
}

/**
 * Ingestion pipeline public API.
 * Modular structure: validation -> transformation -> storage, with optional queue.
 */
export { runIngestion, enqueueIngestion } from "./pipeline";
export { validateContentInput } from "./validation.layer";
export { transformContent } from "./transformation.layer";
export { storeContent } from "./storage.layer";
export type {
  IngestionRawInput,
  ValidatedContent,
  TransformedContent,
  StoredContent,
  IngestionContext,
  IngestionResult,
} from "./types";

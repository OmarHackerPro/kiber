/**
 * Validation for preferences update endpoint.
 */
import { z } from "zod";

export const updatePreferencesSchema = z.object({
  body: z.object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    notifications: z.boolean().optional(),
    language: z.string().max(10).optional(),
    settings: z.record(z.unknown()).optional(),
  }),
});

export type UpdatePreferencesBody = z.infer<typeof updatePreferencesSchema>["body"];

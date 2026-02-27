/**
 * User preferences service: get and update theme, notifications, language, extensible settings.
 */
import { prisma } from "../lib/prisma";

export type Theme = "light" | "dark" | "system";

export interface UpdatePreferencesInput {
  theme?: Theme;
  notifications?: boolean;
  language?: string;
  settings?: Record<string, unknown>;
}

/** Get preferences for a user (creates default if missing) */
export async function getPreferences(userId: string) {
  let prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!prefs) {
    prefs = await prisma.userPreferences.create({ data: { userId } });
  }
  return {
    ...prefs,
    settings: prefs.settings ? (JSON.parse(prefs.settings) as Record<string, unknown>) : {},
  };
}

/** Update preferences for a user */
export async function updatePreferences(userId: string, input: UpdatePreferencesInput) {
  const existing = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!existing) {
    const created = await prisma.userPreferences.create({
      data: {
        userId,
        ...(input.theme && { theme: input.theme }),
        ...(typeof input.notifications === "boolean" && { notifications: input.notifications }),
        ...(input.language !== undefined && { language: input.language }),
        ...(input.settings !== undefined && { settings: JSON.stringify(input.settings) }),
      },
    });
    return { ...created, settings: created.settings ? JSON.parse(created.settings) : {} };
  }
  const updated = await prisma.userPreferences.update({
    where: { userId },
    data: {
      ...(input.theme !== undefined && { theme: input.theme }),
      ...(typeof input.notifications === "boolean" && { notifications: input.notifications }),
      ...(input.language !== undefined && { language: input.language }),
      ...(input.settings !== undefined && { settings: JSON.stringify(input.settings) }),
    },
  });
  return { ...updated, settings: updated.settings ? JSON.parse(updated.settings) : {} };
}

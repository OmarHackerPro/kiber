/**
 * Content service: CRUD for content with author relation, tags, metadata.
 */
import { prisma } from "../lib/prisma";
import { NotFoundError, ForbiddenError } from "../lib/errors";
import type { ContentStatus } from "../types/prisma-enums";

export interface CreateContentInput {
  title: string;
  body: string;
  status?: ContentStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateContentInput {
  title?: string;
  body?: string;
  status?: ContentStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

function tagsToString(tags: string[]): string {
  return JSON.stringify(tags);
}

function parseTags(s: string): string[] {
  if (!s) return [];
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return s.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

/** Create content for the given author (userId) */
export async function createContent(authorId: string, input: CreateContentInput) {
  const content = await prisma.content.create({
    data: {
      title: input.title,
      body: input.body,
      authorId,
      status: input.status ?? "DRAFT",
      tags: tagsToString(input.tags ?? []),
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return { ...content, tags: parseTags(content.tags), metadata: content.metadata ? JSON.parse(content.metadata) : {} };
}

/** Get content by id; optionally ensure author or admin */
export async function getContentById(id: string, userId?: string) {
  const content = await prisma.content.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  if (!content) throw new NotFoundError("Content not found");
  const canAccess = content.status === "PUBLISHED" || content.authorId === userId;
  if (userId && !canAccess) throw new ForbiddenError("You cannot access this content");
  if (!userId && content.status !== "PUBLISHED") throw new NotFoundError("Content not found");
  return { ...content, tags: parseTags(content.tags), metadata: content.metadata ? JSON.parse(content.metadata) : {} };
}

/** List content (filter by status, author; pagination) */
export async function listContent(options: {
  status?: ContentStatus;
  authorId?: string;
  limit?: number;
  offset?: number;
}) {
  const { status, authorId, limit = 20, offset = 0 } = options;
  const where: { status?: ContentStatus; authorId?: string } = {};
  if (status) where.status = status;
  if (authorId) where.authorId = authorId;
  const [items, total] = await Promise.all([
    prisma.content.findMany({
      where,
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
      take: Math.min(limit, 100),
      skip: offset,
    }),
    prisma.content.count({ where }),
  ]);
  const mapped = items.map((c: { tags: string; metadata: string | null } & Record<string, unknown>) => ({
    ...c,
    tags: parseTags(c.tags),
    metadata: c.metadata ? JSON.parse(c.metadata) : {},
  }));
  return { items: mapped, total };
}

/** Update content; only author or admin */
export async function updateContent(
  id: string,
  userId: string,
  isAdmin: boolean,
  input: UpdateContentInput
) {
  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) throw new NotFoundError("Content not found");
  if (content.authorId !== userId && !isAdmin) throw new ForbiddenError("You cannot update this content");
  const updated = await prisma.content.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.body !== undefined && { body: input.body }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.tags !== undefined && { tags: tagsToString(input.tags) }),
      ...(input.metadata !== undefined && { metadata: JSON.stringify(input.metadata) }),
    },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  return { ...updated, tags: parseTags(updated.tags), metadata: updated.metadata ? JSON.parse(updated.metadata) : {} };
}

/** Delete content; only author or admin */
export async function deleteContent(id: string, userId: string, isAdmin: boolean) {
  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) throw new NotFoundError("Content not found");
  if (content.authorId !== userId && !isAdmin) throw new ForbiddenError("You cannot delete this content");
  await prisma.content.delete({ where: { id } });
}

/**
 * Auth middleware: protect routes by validating JWT and attaching user to request.
 */
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";
import { UnauthorizedError, ForbiddenError, sendError } from "../lib/errors";
import type { TokenPayload } from "../services/auth.service";

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
      userId?: string;
    }
  }
}

/** Require valid JWT (Bearer token). Sets req.auth and req.userId. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, new UnauthorizedError("Missing or invalid Authorization header"));
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    if (payload.type !== "access") {
      sendError(res, new UnauthorizedError("Invalid token type"));
      return;
    }
    req.auth = payload;
    req.userId = payload.sub;
    next();
  } catch {
    sendError(res, new UnauthorizedError("Invalid or expired token"));
  }
}

/** Optional auth: attach user if token present, do not block if missing */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    if (payload.type === "access") {
      req.auth = payload;
      req.userId = payload.sub;
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

/** Require admin role. Use after requireAuth. */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    sendError(res, new UnauthorizedError("Authentication required"));
    return;
  }
  if (req.auth.role !== "ADMIN") {
    sendError(res, new ForbiddenError("Admin access required"));
    return;
  }
  next();
}

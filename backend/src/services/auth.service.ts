/**
 * Authentication service: password hashing, JWT creation/verification.
 * Uses bcrypt for hashing and jsonwebtoken for JWT.
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { ConflictError, UnauthorizedError } from "../lib/errors";
import type { User } from "@prisma/client";
import type { Role } from "../types/prisma-enums";

const SALT_ROUNDS = 12;

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
  type: "access" | "refresh";
}

/** Hash a plain password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare plain password with hash */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Create access and refresh tokens for a user */
export function createTokens(user: User): { accessToken: string; refreshToken: string; expiresIn: string } {
  const role = user.role as Role;
  const payload: Omit<TokenPayload, "type"> = { sub: user.id, email: user.email, role };
  const accessToken = jwt.sign(
    { ...payload, type: "access" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
  const refreshToken = jwt.sign(
    { ...payload, type: "refresh" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
  return { accessToken, refreshToken, expiresIn: env.JWT_EXPIRES_IN };
}

/** Verify JWT and return payload (throws if invalid) */
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  if (!decoded.sub || !decoded.type) {
    throw new UnauthorizedError("Invalid token payload");
  }
  return decoded;
}

/** Register a new user. Throws ConflictError if email exists. */
export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("Email already registered");
  }
  const hashed = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      role: input.role ?? "USER",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  // Create default preferences for new user
  await prisma.userPreferences.create({
    data: { userId: user.id },
  });
  const tokens = createTokens({ ...user, password: "" } as User);
  return { user, ...tokens };
}

/** Login: validate credentials and return user + tokens */
export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const tokens = createTokens(user);
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
  return { user: safeUser, ...tokens };
}

/** Refresh access token using a valid refresh token */
export function refreshAccessToken(refreshToken: string) {
  const payload = verifyToken(refreshToken);
  if (payload.type !== "refresh") {
    throw new UnauthorizedError("Invalid token type");
  }
  // Optionally re-fetch user and create new tokens
  const accessToken = jwt.sign(
    { sub: payload.sub, email: payload.email, role: payload.role, type: "access" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
  return { accessToken, expiresIn: env.JWT_EXPIRES_IN };
}

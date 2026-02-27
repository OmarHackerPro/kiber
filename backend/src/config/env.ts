/**
 * Environment variable configuration.
 * All env vars are validated and exported from a single place.
 */
import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optional = (key: string, defaultValue: string): string => {
  return process.env[key] ?? defaultValue;
};

export const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: parseInt(optional("PORT", "3000"), 10),
  API_PREFIX: optional("API_PREFIX", "/api/v1"),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: optional("JWT_EXPIRES_IN", "7d"),
  JWT_REFRESH_EXPIRES_IN: optional("JWT_REFRESH_EXPIRES_IN", "30d"),
  LOG_LEVEL: optional("LOG_LEVEL", "info"),
} as const;

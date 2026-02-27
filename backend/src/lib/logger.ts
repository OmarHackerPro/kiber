/**
 * Simple structured logger for the application.
 * In production you might replace this with pino or winston.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (levels[level] < levels[currentLevel]) return;
  const timestamp = new Date().toISOString();
  const payload = meta ? { ...meta, message } : { message };
  const line = JSON.stringify({ timestamp, level, ...payload });
  console[level === "debug" ? "log" : level](line);
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log("debug", msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta),
};

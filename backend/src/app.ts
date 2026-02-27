/**
 * Express app: routes, middleware, global error handler.
 */
import express from "express";
import { env } from "./config";
import { sendError } from "./lib/errors";
import { logger } from "./lib/logger";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import preferencesRoutes from "./routes/preferences.routes";
import contentRoutes from "./routes/content.routes";
import ingestionRoutes from "./routes/ingestion.routes";

const app = express();

app.use(express.json());

// Health check (no prefix)
app.get("/health", (_req: express.Request, res: express.Response) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

const prefix = env.API_PREFIX;
app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/preferences`, preferencesRoutes);
app.use(`${prefix}/contents`, contentRoutes);
app.use(`${prefix}/ingestion`, ingestionRoutes);

// 404
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: { message: "Not found", code: "NOT_FOUND" } });
});

// Global error handler (for errors passed to next(err))
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled error", { err });
  sendError(res, err);
});

export default app;

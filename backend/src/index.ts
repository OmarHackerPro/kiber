/**
 * Entry point: load env, start server.
 * Environment variables are validated on import (config/env).
 */
import { env } from "./config";
import app from "./app";
import { logger } from "./lib/logger";

const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`, { port, apiPrefix: env.API_PREFIX });
});

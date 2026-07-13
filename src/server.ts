import "reflect-metadata";

import { createApp } from "./app";
import { env } from "./config/env";
import {
  closeDatabase,
  initializeDatabase,
} from "./database/initialize-database";

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`${env.APP_NAME} API running on port ${env.PORT}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async (serverError) => {
        if (serverError) {
          console.error("Failed to close HTTP server", serverError);
          process.exit(1);
        }

        try {
          await closeDatabase();
          process.exit(0);
        } catch (databaseError) {
          console.error("Failed to close database connection", databaseError);

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to start AutoLease API", error);
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
  process.exit(1);
});

void startServer();

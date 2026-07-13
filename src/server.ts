import "reflect-metadata";
import "dotenv/config";

import { createApp } from "./app";

const port = Number(process.env.PORT ?? 5000);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`AutoLease API running on port ${port}`);
});

const shutdown = (signal: string): void => {
  console.log(`${signal} received. Closing server...`);

  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server", error);
      process.exit(1);
    }

    console.log("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
  process.exit(1);
});

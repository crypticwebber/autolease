import compression from "compression";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "./config/env";

export const createApp = (): Express => {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    }),
  );

  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(pinoHttp());

  app.get("/health", (_request: Request, response: Response) => {
    response.status(200).json({
      success: true,
      message: "AutoLease API is healthy",
      data: {
        service: "autolease-api",
        database: "connected",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  });

  return app;
};

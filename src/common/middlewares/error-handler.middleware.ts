import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { QueryFailedError } from "typeorm";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";

interface PostgreSqlError {
  code?: string;
  constraint?: string;
  detail?: string;
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      details: error.details ?? null,
    });

    return;
  }

  if (error instanceof ZodError) {
    response.status(422).json({
      success: false,
      message: "Request validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  if (error instanceof QueryFailedError) {
    const databaseError = error.driverError as PostgreSqlError;

    if (databaseError.code === "23505") {
      response.status(409).json({
        success: false,
        message: "A record with the supplied details already exists",
        code: "DUPLICATE_RESOURCE",
        details: null,
      });

      return;
    }
  }

  console.error("Unhandled application error:", error);

  response.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    code: "INTERNAL_SERVER_ERROR",
    details: null,
  });
};

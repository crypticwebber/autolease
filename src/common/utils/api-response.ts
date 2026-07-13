import type { Response } from "express";

interface SuccessResponseOptions<T> {
  statusCode?: number;
  message: string;
  data?: T;
}

export const sendSuccess = <T>(
  response: Response,
  options: SuccessResponseOptions<T>,
): Response => {
  const { statusCode = 200, message, data } = options;

  return response.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

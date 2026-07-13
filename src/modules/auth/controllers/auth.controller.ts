import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/api-response";
import { authService } from "../services/auth.service";
import type { RegisterInput } from "../validators/register.validator";

export class AuthController {
  public async register(
    request: Request<Record<string, never>, unknown, RegisterInput>,
    response: Response,
  ): Promise<Response> {
    const user = await authService.register(request.body);

    return sendSuccess(response, {
      statusCode: 201,
      message:
        "Registration successful. Verify your email to activate your account.",
      data: {
        user,
      },
    });
  }
}

export const authController = new AuthController();

import type { Request, Response } from "express";

import { sendSuccess } from "../../../common/utils/api-response";
import { authService } from "../services/auth.service";
import type { RegisterInput } from "../validators/register.validator";
import { emailVerificationService } from "../services/email-verification.service";
import type {
  ResendVerificationInput,
  VerifyEmailInput,
} from "../validators/email-verification.validator";

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
  public async verifyEmail(
    request: Request<Record<string, never>, unknown, VerifyEmailInput>,
    response: Response,
  ): Promise<Response> {
    await emailVerificationService.verify(request.body.token);

    return sendSuccess(response, {
      message: "Email verified successfully. Your account is now active.",
    });
  }

  public async resendVerification(
    request: Request<Record<string, never>, unknown, ResendVerificationInput>,
    response: Response,
  ): Promise<Response> {
    await emailVerificationService.resend(request.body.email);

    return sendSuccess(response, {
      message:
        "If an unverified account exists, a verification email has been sent.",
    });
  }
}

export const authController = new AuthController();

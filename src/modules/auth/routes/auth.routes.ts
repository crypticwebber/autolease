import { Router } from "express";

import { validateRequest } from "../../../common/middlewares/validate-request.middleware";
import { authController } from "../controllers/auth.controller";
import { registerSchema } from "../validators/register.validator";
import {
  resendVerificationSchema,
  verifyEmailSchema,
} from "../validators/email-verification.validator";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  authController.register.bind(authController),
);
authRouter.post(
  "/verify-email",
  validateRequest({
    body: verifyEmailSchema,
  }),
  authController.verifyEmail.bind(authController),
);

authRouter.post(
  "/resend-verification",
  validateRequest({
    body: resendVerificationSchema,
  }),
  authController.resendVerification.bind(authController),
);

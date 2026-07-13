import { Router } from "express";

import { validateRequest } from "../../../common/middlewares/validate-request.middleware";
import { authController } from "../controllers/auth.controller";
import { registerSchema } from "../validators/register.validator";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  authController.register.bind(authController),
);

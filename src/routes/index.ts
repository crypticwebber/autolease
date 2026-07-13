import { Router } from "express";

import { authRouter } from "../modules/auth/routes/auth.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);

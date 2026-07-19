import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

import { env } from "../../../config/env";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";

export class JwtService {
  generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options);
  }

  generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, options);
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
  }
}

export const jwtService = new JwtService();

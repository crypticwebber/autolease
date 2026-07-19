import argon2 from "argon2";

import { AppError } from "../../../common/errors/app-error";
import { hashToken } from "../../../common/utils/token.util";
import { env } from "../../../config/env";
import { AppDataSource } from "../../../database/data-source";
import { RefreshToken } from "../entities/refresh-token.entity";
import type { LoginResponse } from "../interfaces/login-response.interface";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";
import { jwtService } from "./jwt.service";
import type { LoginInput } from "../validators/login.validator";
import { userRepository } from "../../../repositories/user.repository";
import { UserStatus } from "../../users/entities/user.enums";

export class LoginService {
  public async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponse> {
    // Find user
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Verify password
    if (!user.passwordHash) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      input.password,
    );

    // Check email verification
    if (!user.emailVerified) {
      throw new AppError(
        "Please verify your email address before logging in.",
        403,
        "EMAIL_NOT_VERIFIED",
      );
    }

    // Check account status
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(
        "Your account is not active.",
        403,
        "ACCOUNT_INACTIVE",
      );
    }

    // Get user roles
    const roles = user.userRoles.map((userRole) => userRole.role.name);

    // JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    // Generate tokens
    const accessToken = jwtService.generateAccessToken(payload);

    const refreshToken = jwtService.generateRefreshToken(payload);

    // Calculate refresh expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token
    const refreshRepository = AppDataSource.getRepository(RefreshToken);

    const refreshTokenEntity = refreshRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt,
      revokedAt: null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });

    await refreshRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,

      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: roles.map(String),
      },
    };
  }
}

export const loginService = new LoginService();

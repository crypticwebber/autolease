import { IsNull, MoreThan } from "typeorm";

import { AppError } from "../../../common/errors/app-error";
import {
  generateSecureToken,
  hashToken,
} from "../../../common/utils/token.util";
import { env } from "../../../config/env";
import { AppDataSource } from "../../../database/data-source";
import { emailService } from "../../notifications/services/email.service";
import { User } from "../../users/entities/user.entity";
import { UserStatus } from "../../users/entities/user.enums";
import { EmailVerificationToken } from "../entities/email-verification-token.entity";

export class EmailVerificationService {
  public async createAndSendToken(user: User): Promise<void> {
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() + env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000,
    );

    await AppDataSource.transaction(async (transactionManager) => {
      const tokenRepository = transactionManager.getRepository(
        EmailVerificationToken,
      );

      await tokenRepository.delete({
        userId: user.id,
      });

      const token = tokenRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
        usedAt: null,
      });

      await tokenRepository.save(token);
    });

    await emailService.sendVerificationEmail({
      email: user.email,
      firstName: user.firstName,
      token: rawToken,
    });
  }

  public async verify(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);

    await AppDataSource.transaction(async (transactionManager) => {
      const tokenRepository = transactionManager.getRepository(
        EmailVerificationToken,
      );

      const userRepository = transactionManager.getRepository(User);

      const token = await tokenRepository.findOne({
        where: {
          tokenHash,
          usedAt: IsNull(),
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!token) {
        throw new AppError(
          "Verification token is invalid or has expired",
          400,
          "INVALID_VERIFICATION_TOKEN",
        );
      }

      const user = await userRepository.findOne({
        where: {
          id: token.userId,
        },
      });

      if (!user) {
        throw new AppError("User account was not found", 404, "USER_NOT_FOUND");
      }

      if (user.emailVerified) {
        throw new AppError(
          "Email address is already verified",
          409,
          "EMAIL_ALREADY_VERIFIED",
        );
      }

      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      user.status = UserStatus.ACTIVE;

      token.usedAt = new Date();

      await userRepository.save(user);
      await tokenRepository.save(token);
    });
  }

  public async resend(email: string): Promise<void> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    });

    /*
     * Do not expose whether an account exists.
     * This helps prevent account enumeration.
     */
    if (!user || user.emailVerified) {
      return;
    }

    await this.createAndSendToken(user);
  }
}

export const emailVerificationService = new EmailVerificationService();

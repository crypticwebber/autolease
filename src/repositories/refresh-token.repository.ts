import { BaseRepository } from "./base.repository";

import { RefreshToken } from "../modules/auth/entities/refresh-token.entity";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.findOne({
      where: {
        tokenHash,
      },
    });
  }

  async revoke(refreshToken: RefreshToken): Promise<void> {
    refreshToken.revokedAt = new Date();

    await this.save(refreshToken);
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();

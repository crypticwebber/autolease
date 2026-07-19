import { BaseRepository } from "./base.repository";

import { User } from "../modules/users/entities/user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.userRoles", "userRole")
      .leftJoinAndSelect("userRole.role", "role")
      .where("user.email = :email", { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({
      where: {
        id,
      },
      relations: {
        userRoles: {
          role: true,
        },
        profile: true,
      },
    });
  }
}

export const userRepository = new UserRepository();

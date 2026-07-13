import { AppError } from "../../../common/errors/app-error";
import { AppDataSource } from "../../../database/data-source";
import { Role } from "../../users/entities/role.entity";
import { UserProfile } from "../../users/entities/users-profile.entity";
import { UserRole } from "../../users/entities/user-role.entity";
import { User } from "../../users/entities/user.entity";
import { AuthProvider, UserStatus } from "../../users/entities/user.enums";
import type { RegisterInput } from "../validators/register.validator";
import { passwordService } from "./password.service";

interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
}

export class AuthService {
  public async register(input: RegisterInput): Promise<RegisteredUser> {
    const normalizedEmail = input.email.toLowerCase();

    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new AppError(
        "An account with this email already exists",
        409,
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const passwordHash = await passwordService.hash(input.password);

    return AppDataSource.transaction(async (transactionManager) => {
      const userRepository = transactionManager.getRepository(User);

      const profileRepository = transactionManager.getRepository(UserProfile);

      const roleRepository = transactionManager.getRepository(Role);

      const userRoleRepository = transactionManager.getRepository(UserRole);

      const role = await roleRepository.findOne({
        where: {
          name: input.role,
        },
      });

      if (!role) {
        throw new AppError(
          "The selected account role is unavailable",
          500,
          "ROLE_NOT_CONFIGURED",
        );
      }

      const user = userRepository.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: normalizedEmail,
        phone: input.phone ?? null,
        passwordHash,
        authProvider: AuthProvider.LOCAL,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
      });

      const savedUser = await userRepository.save(user);

      const profile = profileRepository.create({
        userId: savedUser.id,
        country: "Nigeria",
      });

      await profileRepository.save(profile);

      const userRole = userRoleRepository.create({
        userId: savedUser.id,
        roleId: role.id,
      });

      await userRoleRepository.save(userRole);

      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phone: savedUser.phone,
        role: role.name,
        status: savedUser.status,
        emailVerified: savedUser.emailVerified,
        createdAt: savedUser.createdAt,
      };
    });
  }
}

export const authService = new AuthService();

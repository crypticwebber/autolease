import "reflect-metadata";

import { DataSource } from "typeorm";

import { env } from "../config/env";
import { Role } from "../modules/users/entities/role.entity";
import { UserProfile } from "../modules/users/entities/users-profile.entity";
import { UserRole } from "../modules/users/entities/user-role.entity";
import { User } from "../modules/users/entities/user.entity";
import { EmailVerificationToken } from "../modules/auth/entities/email-verification-token.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,

  ssl: env.DATABASE_SSL
    ? {
        rejectUnauthorized: false,
      }
    : false,

  synchronize: false,
  logging: env.NODE_ENV === "development",

  entities: [User, UserProfile, Role, UserRole, EmailVerificationToken],

  migrations: [`${__dirname}/../migrations/*.{ts,js}`],

  subscribers: [],

  migrationsTableName: "typeorm_migrations",
  migrationsRun: false,

  poolSize: 10,
  applicationName: "autolease-api",
});

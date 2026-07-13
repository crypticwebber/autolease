import "reflect-metadata";

import { DataSource } from "typeorm";

import { env } from "../config/env";

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

  entities: [`${__dirname}/../modules/**/*.entity.{ts,js}`],

  migrations: [`${__dirname}/../migrations/*.{ts,js}`],

  subscribers: [`${__dirname}/../subscribers/*.{ts,js}`],

  migrationsTableName: "typeorm_migrations",

  migrationsRun: false,

  poolSize: 10,

  applicationName: "autolease-api",
});

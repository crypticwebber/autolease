import "reflect-metadata";

import { AppDataSource } from "../database/data-source";
import { seedRoles } from "./role.seeder";

const runSeeders = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    console.log("Database connection established");

    await seedRoles();

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed", error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Database connection closed");
    }
  }
};

void runSeeders();

import { AppDataSource } from "./data-source";

export const initializeDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    return;
  }

  await AppDataSource.initialize();

  console.log("PostgreSQL database connected successfully");
};

export const closeDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    return;
  }

  await AppDataSource.destroy();

  console.log("PostgreSQL database connection closed");
};

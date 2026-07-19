import {
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { AppDataSource } from "../database/data-source";

export abstract class BaseRepository<T extends object> {
  protected readonly repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    return this.repository.save(entity);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async delete(criteria: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(criteria);
  }
}

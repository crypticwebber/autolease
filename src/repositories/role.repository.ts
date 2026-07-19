import { BaseRepository } from "./base.repository";

import { Role } from "../modules/users/entities/role.entity";
import { RoleName } from "../modules/users/entities/role.enums";

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role);
  }

  async findByName(name: RoleName): Promise<Role | null> {
    return this.findOne({
      where: {
        name,
      },
    });
  }
}

export const roleRepository = new RoleRepository();

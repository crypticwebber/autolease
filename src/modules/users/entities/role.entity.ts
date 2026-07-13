import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { RoleName } from "./role.enums";
import { UserRole } from "./user-role.entity";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Column({
    type: "enum",
    enum: RoleName,
    unique: true,
  })
  name!: RoleName;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  description!: string | null;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles!: UserRole[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

import { Role } from "./role.entity";
import { User } from "./user.entity";

@Entity({ name: "user_roles" })
@Unique("uq_user_roles_user_role", ["userId", "roleId"])
@Index("idx_user_roles_user_id", ["userId"])
@Index("idx_user_roles_role_id", ["roleId"])
export class UserRole {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
    name: "user_id",
  })
  userId!: string;

  @Column({
    type: "uuid",
    name: "role_id",
  })
  roleId!: string;

  @CreateDateColumn({
    type: "timestamptz",
    name: "assigned_at",
  })
  assignedAt!: Date;

  @ManyToOne(() => User, (user) => user.userRoles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "fk_user_roles_user",
  })
  user!: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "role_id",
    foreignKeyConstraintName: "fk_user_roles_role",
  })
  role!: Role;
}

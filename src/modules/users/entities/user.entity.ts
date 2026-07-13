import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { UserProfile } from "./users-profile.entity";
import { UserRole } from "./user-role.entity";
import { AuthProvider, UserStatus } from "./user.enums";

@Entity({ name: "users" })
@Index("idx_users_email", ["email"])
@Index("idx_users_status", ["status"])
export class User extends BaseEntity {
  @Column({
    type: "varchar",
    length: 100,
    name: "first_name",
  })
  firstName!: string;

  @Column({
    type: "varchar",
    length: 100,
    name: "last_name",
  })
  lastName!: string;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "password_hash",
    nullable: true,
    select: false,
  })
  passwordHash!: string | null;

  @Column({
    type: "varchar",
    length: 30,
    nullable: true,
    unique: true,
  })
  phone!: string | null;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status!: UserStatus;

  @Column({
    type: "enum",
    enum: AuthProvider,
    name: "auth_provider",
    default: AuthProvider.LOCAL,
  })
  authProvider!: AuthProvider;

  @Column({
    type: "varchar",
    length: 255,
    name: "google_id",
    nullable: true,
    unique: true,
  })
  googleId!: string | null;

  @Column({
    type: "boolean",
    name: "email_verified",
    default: false,
  })
  emailVerified!: boolean;

  @Column({
    type: "timestamptz",
    name: "email_verified_at",
    nullable: true,
  })
  emailVerifiedAt!: Date | null;

  @Column({
    type: "timestamptz",
    name: "last_login_at",
    nullable: true,
  })
  lastLoginAt!: Date | null;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile!: UserProfile;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles!: UserRole[];
}

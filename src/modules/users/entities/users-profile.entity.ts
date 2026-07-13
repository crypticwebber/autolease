import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from "./user.entity";

@Entity({ name: "user_profiles" })
export class UserProfile extends BaseEntity {
  @Column({
    type: "uuid",
    name: "user_id",
    unique: true,
  })
  userId!: string;

  @Column({
    type: "text",
    name: "profile_image_url",
    nullable: true,
  })
  profileImageUrl!: string | null;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
  })
  address!: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  city!: string | null;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  state!: string | null;

  @Column({
    type: "varchar",
    length: 100,
    default: "Nigeria",
  })
  country!: string;

  @Column({
    type: "date",
    name: "date_of_birth",
    nullable: true,
  })
  dateOfBirth!: string | null;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "fk_user_profiles_user",
  })
  user!: User;
}

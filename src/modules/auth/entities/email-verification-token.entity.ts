import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../../users/entities/user.entity";

@Entity({ name: "email_verification_tokens" })
@Index("idx_email_verification_tokens_user_id", ["userId"])
@Index("idx_email_verification_tokens_token_hash", ["tokenHash"])
export class EmailVerificationToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
    name: "user_id",
  })
  userId!: string;

  @Column({
    type: "varchar",
    length: 64,
    name: "token_hash",
    unique: true,
  })
  tokenHash!: string;

  @Column({
    type: "timestamptz",
    name: "expires_at",
  })
  expiresAt!: Date;

  @Column({
    type: "timestamptz",
    name: "used_at",
    nullable: true,
  })
  usedAt!: Date | null;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
  })
  createdAt!: Date;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "fk_email_verification_tokens_user",
  })
  user!: User;
}

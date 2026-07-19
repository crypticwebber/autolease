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

@Entity({ name: "refresh_tokens" })
@Index("idx_refresh_tokens_user_id", ["userId"])
@Index("idx_refresh_tokens_token_hash", ["tokenHash"])
export class RefreshToken {
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
    type: "varchar",
    length: 100,
    name: "user_agent",
    nullable: true,
  })
  userAgent!: string | null;

  @Column({
    type: "varchar",
    length: 45,
    name: "ip_address",
    nullable: true,
  })
  ipAddress!: string | null;

  @Column({
    type: "timestamptz",
    name: "expires_at",
  })
  expiresAt!: Date;

  @Column({
    type: "timestamptz",
    name: "revoked_at",
    nullable: true,
  })
  revokedAt!: Date | null;

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
    foreignKeyConstraintName: "fk_refresh_tokens_user",
  })
  user!: User;
}

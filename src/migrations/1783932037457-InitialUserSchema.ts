import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUserSchema1783932037457 implements MigrationInterface {
    name = 'InitialUserSchema1783932037457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "profile_image_url" text, "address" character varying(500), "city" character varying(100), "state" character varying(100), "country" character varying(100) NOT NULL DEFAULT 'Nigeria', "date_of_birth" date, CONSTRAINT "UQ_6ca9503d77ae39b4b5a6cc3ba88" UNIQUE ("user_id"), CONSTRAINT "REL_6ca9503d77ae39b4b5a6cc3ba8" UNIQUE ("user_id"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'suspended', 'pending_verification')`);
        await queryRunner.query(`CREATE TYPE "public"."users_auth_provider_enum" AS ENUM('local', 'google')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255), "phone" character varying(30), "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending_verification', "auth_provider" "public"."users_auth_provider_enum" NOT NULL DEFAULT 'local', "google_id" character varying(255), "email_verified" boolean NOT NULL DEFAULT false, "email_verified_at" TIMESTAMP WITH TIME ZONE, "last_login_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_users_status" ON "users"  ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"  ("email") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_user_roles_user_role" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_roles_role_id" ON "user_roles"  ("role_id") `);
        await queryRunner.query(`CREATE INDEX "idx_user_roles_user_id" ON "user_roles"  ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('customer', 'car_owner', 'admin')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" "public"."roles_name_enum" NOT NULL, "description" character varying(255), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "fk_user_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "fk_user_roles_role"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "fk_user_roles_user"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "fk_user_profiles_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_roles_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_roles_role_id"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_status"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_auth_provider_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}

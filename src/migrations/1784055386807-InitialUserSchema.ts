import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUserSchema1784055386807 implements MigrationInterface {
    name = 'InitialUserSchema1784055386807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "user_agent" character varying(100), "ip_address" character varying(45), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_refresh_tokens_token_hash" ON "refresh_tokens"  ("token_hash") `);
        await queryRunner.query(`CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "fk_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "fk_refresh_tokens_user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_token_hash"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}

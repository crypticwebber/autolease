import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationTokens1783958508341 implements MigrationInterface {
    name = 'AddEmailVerificationTokens1783958508341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c20ed35f3d31d486aabcd0564da" UNIQUE ("token_hash"), CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_email_verification_tokens_token_hash" ON "email_verification_tokens"  ("token_hash") `);
        await queryRunner.query(`CREATE INDEX "idx_email_verification_tokens_user_id" ON "email_verification_tokens"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "fk_email_verification_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_verification_tokens" DROP CONSTRAINT "fk_email_verification_tokens_user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_email_verification_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_email_verification_tokens_token_hash"`);
        await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
    }

}

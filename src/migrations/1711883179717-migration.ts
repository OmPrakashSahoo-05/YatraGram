import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711883179717 implements MigrationInterface {
    name = 'Migration1711883179717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "name" varchar NOT NULL,
                "avatar" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" varchar(44) PRIMARY KEY NOT NULL,
                "user_id" integer,
                "content" text NOT NULL,
                "flash" text NOT NULL,
                "updated_at" integer NOT NULL,
                "created_at" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "story" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "link" varchar NOT NULL,
                "authorId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_story" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "link" varchar NOT NULL,
                "authorId" integer NOT NULL,
                CONSTRAINT "FK_deb112632d0b5be276f59287d99" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_story"("id", "title", "link", "authorId")
            SELECT "id",
                "title",
                "link",
                "authorId"
            FROM "story"
        `);
        await queryRunner.query(`
            DROP TABLE "story"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_story"
                RENAME TO "story"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "story"
                RENAME TO "temporary_story"
        `);
        await queryRunner.query(`
            CREATE TABLE "story" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "link" varchar NOT NULL,
                "authorId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "story"("id", "title", "link", "authorId")
            SELECT "id",
                "title",
                "link",
                "authorId"
            FROM "temporary_story"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_story"
        `);
        await queryRunner.query(`
            DROP TABLE "story"
        `);
        await queryRunner.query(`
            DROP TABLE "sessions"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserroleCol1751201518377 implements MigrationInterface {
    name = 'addUserroleCol1751201518377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'STUDENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}

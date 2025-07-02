import {MigrationInterface, QueryRunner} from "typeorm";

export class addPasswordCol1751197452581 implements MigrationInterface {
    name = 'addPasswordCol1751197452581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}

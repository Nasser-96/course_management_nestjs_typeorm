import {MigrationInterface, QueryRunner} from "typeorm";

export class addCascadeToProfile1751271229077 implements MigrationInterface {
    name = 'addCascadeToProfile1751271229077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_9466682df91534dd95e4dbaa61"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "UQ_a24972ebd73b106250713dcddd9" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "UQ_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

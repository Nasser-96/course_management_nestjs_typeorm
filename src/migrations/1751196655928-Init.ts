import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1751196655928 implements MigrationInterface {
  name = 'Init1751196655928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "courseId" uuid, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bio" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "profileId" uuid, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "instructorId" uuid, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_enrolled_courses_course" ("userId" uuid NOT NULL, "courseId" uuid NOT NULL, CONSTRAINT "PK_042007bd22db48b784dbc7e2f85" PRIMARY KEY ("userId", "courseId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9617733bbbd3615212e56b9d11" ON "user_enrolled_courses_course" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e95acf471c57298669e2f83a13" ON "user_enrolled_courses_course" ("courseId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_32d94af473bb59d808d9a68e17b" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_enrolled_courses_course" ADD CONSTRAINT "FK_9617733bbbd3615212e56b9d119" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_enrolled_courses_course" ADD CONSTRAINT "FK_e95acf471c57298669e2f83a13a" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_enrolled_courses_course" DROP CONSTRAINT "FK_e95acf471c57298669e2f83a13a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_enrolled_courses_course" DROP CONSTRAINT "FK_9617733bbbd3615212e56b9d119"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_32d94af473bb59d808d9a68e17b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_3801ccf9533a8627c1dcb1e33bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e95acf471c57298669e2f83a13"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9617733bbbd3615212e56b9d11"`,
    );
    await queryRunner.query(`DROP TABLE "user_enrolled_courses_course"`);
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
  }
}

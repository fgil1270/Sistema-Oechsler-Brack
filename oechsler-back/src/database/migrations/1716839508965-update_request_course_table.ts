import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseTable1716839508965 implements MigrationInterface {
    name = 'UpdateRequestCourseTable1716839508965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`place\` varchar(255) NULL AFTER \`type\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`place\``);
    }

}

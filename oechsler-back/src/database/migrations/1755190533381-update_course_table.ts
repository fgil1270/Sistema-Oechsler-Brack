import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCourseTable1755190533381 implements MigrationInterface {
    name = 'UpdateCourseTable1755190533381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`syllabus\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`evaluation_method\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`evaluation_method\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`syllabus\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCourseTable1755196322713 implements MigrationInterface {
    name = 'UpdateCourseTable1755196322713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`evaluation_method\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`req_constancy\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`req_quiz\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`req_quiz\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`req_constancy\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`evaluation_method\` varchar(255) NOT NULL`);
    }

}

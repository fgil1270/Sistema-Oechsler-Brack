import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseTable1734462176757 implements MigrationInterface {
    name = 'UpdateRequestCourseTable1734462176757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`comment\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`comment\``);
    }

}

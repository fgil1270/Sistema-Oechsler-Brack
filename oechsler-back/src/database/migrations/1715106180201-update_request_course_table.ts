import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseTable1715106180201 implements MigrationInterface {
    name = 'UpdateRequestCourseTable1715106180201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`evaluation_tool\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`evaluation_tool\``);
    }

}

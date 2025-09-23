import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseTable1756398658684 implements MigrationInterface {
    name = 'UpdateRequestCourseTable1756398658684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`training_objective\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`training_objective\``);
    }

}

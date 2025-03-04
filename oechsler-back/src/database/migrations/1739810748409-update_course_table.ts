import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCourseTable1739810748409 implements MigrationInterface {
    name = 'UpdateCourseTable1739810748409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`description\` text NOT NULL AFTER \`name\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`description\` varchar(255) NOT NULL`);
    }

}

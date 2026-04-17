import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobDegreeTable1776268084665 implements MigrationInterface {
    name = 'UpdateJobDegreeTable1776268084665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_degree\` ADD \`type\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_degree\` DROP COLUMN \`type\``);
    }

}

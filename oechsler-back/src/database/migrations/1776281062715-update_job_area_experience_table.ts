import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobAreaExperienceTable1776281062715 implements MigrationInterface {
    name = 'UpdateJobAreaExperienceTable1776281062715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` DROP COLUMN \`experience\``);
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` ADD \`experience\` decimal(10,1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` DROP COLUMN \`experience\``);
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` ADD \`experience\` int NOT NULL`);
    }

}

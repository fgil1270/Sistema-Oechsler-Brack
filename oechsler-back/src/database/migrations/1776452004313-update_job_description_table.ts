import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobDescriptionTable1776452004313 implements MigrationInterface {
    name = 'UpdateJobDescriptionTable1776452004313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`authorizedLeaderAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`authorizedManagerAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`authorizedRhAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`authorizedRhAt\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`authorizedManagerAt\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`authorizedLeaderAt\``);
    }

}

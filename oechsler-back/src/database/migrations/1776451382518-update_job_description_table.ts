import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobDescriptionTable1776451382518 implements MigrationInterface {
    name = 'UpdateJobDescriptionTable1776451382518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`leaderAuthorizedId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`managerAuthorizedId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`rhAuthorizedId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_ec864b0121570ecf32ac15d16b9\` FOREIGN KEY (\`leaderAuthorizedId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_f1135bd3e7ab080e582e91d440b\` FOREIGN KEY (\`managerAuthorizedId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_290686200e9b488407fabd4a416\` FOREIGN KEY (\`rhAuthorizedId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_290686200e9b488407fabd4a416\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_f1135bd3e7ab080e582e91d440b\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_ec864b0121570ecf32ac15d16b9\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`rhAuthorizedId\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`managerAuthorizedId\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`leaderAuthorizedId\``);
    }

}

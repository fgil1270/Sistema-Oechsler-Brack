import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidenceTable1728324119764 implements MigrationInterface {
    name = 'UpdateEmployeeIncidenceTable1728324119764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`commentCancel\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`approveRHComment\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`approveRHComment\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`commentCancel\``);
    }

}

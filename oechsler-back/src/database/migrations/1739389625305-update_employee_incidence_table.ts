import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidenceTable1739389625305 implements MigrationInterface {
    name = 'UpdateEmployeeIncidenceTable1739389625305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`hour_approved_leader\` time NULL AFTER \`date_aproved_leader\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`hour_approved_leader\``);
    }

}

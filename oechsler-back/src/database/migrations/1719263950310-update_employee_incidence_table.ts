import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidenceTable1719263950310 implements MigrationInterface {
    name = 'UpdateEmployeeIncidenceTable1719263950310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`shift\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`shift\``);
    }

}

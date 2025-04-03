import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeTable1743100342856 implements MigrationInterface {
    name = 'UpdateEmployeTable1743100342856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`employee_image\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`employee_image\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`employee_image\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`employee_image\` text NULL`);
    }

}

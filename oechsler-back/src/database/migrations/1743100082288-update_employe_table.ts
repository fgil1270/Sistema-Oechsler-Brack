import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeTable1743100082288 implements MigrationInterface {
    name = 'UpdateEmployeTable1743100082288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`employee_image\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`employee_image\``);
    }

}

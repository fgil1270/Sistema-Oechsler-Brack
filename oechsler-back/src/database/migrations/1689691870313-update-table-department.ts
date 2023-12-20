import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableDepartment1689691870313 implements MigrationInterface {
    name = 'UpdateTableDepartment1689691870313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`cc\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`cc\``);
    }

}

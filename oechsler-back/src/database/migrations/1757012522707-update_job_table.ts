import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobTable1757012522707 implements MigrationInterface {
    name = 'UpdateJobTable1757012522707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`active\``);
    }

}

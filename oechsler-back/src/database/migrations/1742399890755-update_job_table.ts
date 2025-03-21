import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobTable1742399890755 implements MigrationInterface {
    name = 'UpdateJobTable1742399890755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`produccion_visible\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`produccion_visible\``);
    }

}

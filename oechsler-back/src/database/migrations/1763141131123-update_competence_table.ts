import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCompetenceTable1763141131123 implements MigrationInterface {
    name = 'UpdateCompetenceTable1763141131123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence\` ADD \`is_production\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence\` DROP COLUMN \`is_production\``);
    }

}

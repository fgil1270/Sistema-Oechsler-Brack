import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIncidenceCatalogue1692895540769 implements MigrationInterface {
    name = 'UpdateIncidenceCatalogue1692895540769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidence_catologue\` ADD \`require_date_range\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidence_catologue\` DROP COLUMN \`require_date_range\``);
    }

}

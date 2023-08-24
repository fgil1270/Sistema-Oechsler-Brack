import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIncidenceCatalogue1692902664814 implements MigrationInterface {
    name = 'UpdateIncidenceCatalogue1692902664814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidence_catologue\` ADD \`affected_type\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidence_catologue\` DROP COLUMN \`affected_type\``);
    }

}

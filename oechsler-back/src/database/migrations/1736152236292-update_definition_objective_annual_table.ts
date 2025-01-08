import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefinitionObjectiveAnnualTable1736152236292 implements MigrationInterface {
    name = 'UpdateDefinitionObjectiveAnnualTable1736152236292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`is_evaluated\` tinyint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`is_evaluated\``);
    }

}

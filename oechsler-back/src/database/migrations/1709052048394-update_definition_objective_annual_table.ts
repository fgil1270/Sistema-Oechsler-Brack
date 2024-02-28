import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefinitionObjectiveAnnualTable1709052048394 implements MigrationInterface {
    name = 'UpdateDefinitionObjectiveAnnualTable1709052048394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`comment_edit\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`comment_edit\``);
    }

}

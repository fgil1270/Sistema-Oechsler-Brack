import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefinitionObjectiveAnnualTable1725382592104 implements MigrationInterface {
    name = 'UpdateDefinitionObjectiveAnnualTable1725382592104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_comment\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_range\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_value\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_value\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_range\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_comment\` text NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefinitionObjectiveAnnualTable1725640508140 implements MigrationInterface {
    name = 'UpdateDefinitionObjectiveAnnualTable1725640508140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_employee_range\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_employee_value\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_employee_comment\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_range\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_value\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`half_year_leader_comment\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_leader_range\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_leader_value\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD \`end_year_leader_comment\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_leader_comment\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_leader_value\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_leader_range\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_comment\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_value\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`half_year_leader_range\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_employee_comment\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_employee_value\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP COLUMN \`end_year_employee_range\``);
    }

}

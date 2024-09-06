import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateObjectiveEvaluationTable1725659638271 implements MigrationInterface {
    name = 'UpdateObjectiveEvaluationTable1725659638271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` CHANGE \`value_end_year\` \`value_end_year\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` CHANGE \`comment_end_year\` \`comment_end_year\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` CHANGE \`comment_end_year\` \`comment_end_year\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` CHANGE \`value_end_year\` \`value_end_year\` int NOT NULL`);
    }

}

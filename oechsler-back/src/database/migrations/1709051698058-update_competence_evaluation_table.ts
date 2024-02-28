import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCompetenceEvaluationTable1709051698058 implements MigrationInterface {
    name = 'UpdateCompetenceEvaluationTable1709051698058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`value_half_year\` \`value_half_year\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`comment_half_year\` \`comment_half_year\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`value_end_year\` \`value_end_year\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`comment_end_year\` \`comment_end_year\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`comment_end_year\` \`comment_end_year\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`value_end_year\` \`value_end_year\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`comment_half_year\` \`comment_half_year\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` CHANGE \`value_half_year\` \`value_half_year\` int NOT NULL`);
    }

}

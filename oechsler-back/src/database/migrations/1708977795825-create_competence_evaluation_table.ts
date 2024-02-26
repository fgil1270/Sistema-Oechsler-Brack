import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompetenceEvaluationTable1708977795825 implements MigrationInterface {
    name = 'CreateCompetenceEvaluationTable1708977795825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`competence_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, \`competenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` ADD CONSTRAINT \`FK_48c6f5fc8f2c7a94de527a984a5\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` ADD CONSTRAINT \`FK_262e49d34fbe7150a7021c4dd35\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` DROP FOREIGN KEY \`FK_262e49d34fbe7150a7021c4dd35\``);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` DROP FOREIGN KEY \`FK_48c6f5fc8f2c7a94de527a984a5\``);
        await queryRunner.query(`DROP TABLE \`competence_evaluation\``);
    }

}

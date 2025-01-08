import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateObjectiveQuestionTable1736146810622 implements MigrationInterface {
    name = 'CreateObjectiveQuestionTable1736146810622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`objective_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` text NULL, \`description\` text NULL, \`value\` int NULL, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`objective_question\` ADD CONSTRAINT \`FK_e93842d3c11ca9f9bc1ac494ce0\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objective_question\` DROP FOREIGN KEY \`FK_e93842d3c11ca9f9bc1ac494ce0\``);
        await queryRunner.query(`DROP TABLE \`objective_question\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefinitionObjectiveAnnual1708968759376 implements MigrationInterface {
    name = 'CreateDefinitionObjectiveAnnual1708968759376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_objective_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`objectiveId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employee_objective\` (\`id\` int NOT NULL AUTO_INCREMENT, \`area\` varchar(255) NOT NULL, \`goal\` varchar(255) NOT NULL, \`calculation\` varchar(255) NOT NULL, \`percentage\` int NOT NULL, \`comment\` text NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`definition_objective_annual\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`percentageDefinitionId\` int NULL, \`evaluatedById\` int NULL, \`comment_edit\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` ADD CONSTRAINT \`FK_8c0b51c08fc7f4710b754e78067\` FOREIGN KEY (\`objectiveId\`) REFERENCES \`employee_objective\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` ADD CONSTRAINT \`FK_ee663efc6e8263e1c51818cf939\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD CONSTRAINT \`FK_9fb4c9d8a2354aeaab407210122\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD CONSTRAINT \`FK_453b26bc0b143a231b59e731e7b\` FOREIGN KEY (\`percentageDefinitionId\`) REFERENCES \`percentage_definition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` ADD CONSTRAINT \`FK_f840078b2ad43afec90a90017fa\` FOREIGN KEY (\`evaluatedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP FOREIGN KEY \`FK_f840078b2ad43afec90a90017fa\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP FOREIGN KEY \`FK_453b26bc0b143a231b59e731e7b\``);
        await queryRunner.query(`ALTER TABLE \`definition_objective_annual\` DROP FOREIGN KEY \`FK_9fb4c9d8a2354aeaab407210122\``);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` DROP FOREIGN KEY \`FK_ee663efc6e8263e1c51818cf939\``);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` DROP FOREIGN KEY \`FK_8c0b51c08fc7f4710b754e78067\``);
        await queryRunner.query(`DROP TABLE \`definition_objective_annual\``);
        await queryRunner.query(`DROP TABLE \`employee_objective\``);
        await queryRunner.query(`DROP TABLE \`employee_objective_evaluation\``);
    }

}

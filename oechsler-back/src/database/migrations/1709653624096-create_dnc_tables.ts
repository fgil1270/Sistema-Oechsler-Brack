import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDncTables1709653624096 implements MigrationInterface {
    name = 'CreateDncTables1709653624096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course_evaluation_mannual\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`dncCourseManualId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dnc_course_manual\` (\`id\` int NOT NULL AUTO_INCREMENT, \`goal\` varchar(255) NOT NULL, \`train\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, \`competenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`competence_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`value_half_year\` int NULL, \`comment_half_year\` text NULL, \`value_end_year\` int NULL, \`comment_end_year\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, \`competenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`dncCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dnc_course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`train\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_evaluation_mannual\` ADD CONSTRAINT \`FK_7ff65477c2bdbe389c2a7a0390f\` FOREIGN KEY (\`dncCourseManualId\`) REFERENCES \`dnc_course_manual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` ADD CONSTRAINT \`FK_fbb96cad7e7eb660a768565b581\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` ADD CONSTRAINT \`FK_10a646d63a877a26b5c921df273\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` ADD CONSTRAINT \`FK_48c6f5fc8f2c7a94de527a984a5\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` ADD CONSTRAINT \`FK_262e49d34fbe7150a7021c4dd35\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_evaluation\` ADD CONSTRAINT \`FK_569c0dea11ce9975475a36c7b0c\` FOREIGN KEY (\`dncCourseId\`) REFERENCES \`dnc_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` ADD CONSTRAINT \`FK_290e8ce1a92cb9b15c35903215a\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` ADD CONSTRAINT \`FK_0fa8ed01cb3f30ade2b593ce69f\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dnc_course\` DROP FOREIGN KEY \`FK_0fa8ed01cb3f30ade2b593ce69f\``);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` DROP FOREIGN KEY \`FK_290e8ce1a92cb9b15c35903215a\``);
        await queryRunner.query(`ALTER TABLE \`course_evaluation\` DROP FOREIGN KEY \`FK_569c0dea11ce9975475a36c7b0c\``);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` DROP FOREIGN KEY \`FK_262e49d34fbe7150a7021c4dd35\``);
        await queryRunner.query(`ALTER TABLE \`competence_evaluation\` DROP FOREIGN KEY \`FK_48c6f5fc8f2c7a94de527a984a5\``);
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` DROP FOREIGN KEY \`FK_10a646d63a877a26b5c921df273\``);
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` DROP FOREIGN KEY \`FK_fbb96cad7e7eb660a768565b581\``);
        await queryRunner.query(`ALTER TABLE \`course_evaluation_mannual\` DROP FOREIGN KEY \`FK_7ff65477c2bdbe389c2a7a0390f\``);
        await queryRunner.query(`DROP TABLE \`dnc_course\``);
        await queryRunner.query(`DROP TABLE \`course_evaluation\``);
        await queryRunner.query(`DROP TABLE \`competence_evaluation\``);
        await queryRunner.query(`DROP TABLE \`dnc_course_manual\``);
        await queryRunner.query(`DROP TABLE \`course_evaluation_mannual\``);
    }

}

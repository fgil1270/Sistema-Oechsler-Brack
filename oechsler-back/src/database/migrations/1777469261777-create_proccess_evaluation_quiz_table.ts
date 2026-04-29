import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProccessEvaluationQuizTable1777469261777 implements MigrationInterface {
    name = 'CreateProccessEvaluationQuizTable1777469261777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`proccess_evaluation_quiz\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`intentos\` int NOT NULL DEFAULT '0', \`evaluation_date\` date NULL, \`new_limit_date\` date NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`proccessEvaluationId\` int NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`proccess_evaluation_quiz_response\` (\`id\` int NOT NULL AUTO_INCREMENT, \`proccessEvaluationQuizId\` int NULL, \`proccessEvaluationQuestionId\` int NULL, \`proccessEvaluationResponseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`proccess_evaluation_response\` (\`id\` int NOT NULL AUTO_INCREMENT, \`response\` varchar(255) NOT NULL, \`isCorrect\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`proccessEvaluationQuestionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`proccess_evaluation_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`proccessEvaluationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz\` ADD CONSTRAINT \`FK_bf63c2cf6d2586d42bb36d1e938\` FOREIGN KEY (\`proccessEvaluationId\`) REFERENCES \`proccess_evaluation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz\` ADD CONSTRAINT \`FK_5756f6a3fd2d9ab486b07ef0c66\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` ADD CONSTRAINT \`FK_34602e0c64d5c1cde8936a9e1ce\` FOREIGN KEY (\`proccessEvaluationQuizId\`) REFERENCES \`proccess_evaluation_quiz\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` ADD CONSTRAINT \`FK_2fd5f07567f19564f3aca2907c5\` FOREIGN KEY (\`proccessEvaluationQuestionId\`) REFERENCES \`proccess_evaluation_question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` ADD CONSTRAINT \`FK_9f060e39b947257eaa086b6fed7\` FOREIGN KEY (\`proccessEvaluationResponseId\`) REFERENCES \`proccess_evaluation_response\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_response\` ADD CONSTRAINT \`FK_5bce56de4a23182aa31d331e022\` FOREIGN KEY (\`proccessEvaluationQuestionId\`) REFERENCES \`proccess_evaluation_question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_question\` ADD CONSTRAINT \`FK_aaa896ba08fd6661480ae987d5b\` FOREIGN KEY (\`proccessEvaluationId\`) REFERENCES \`proccess_evaluation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_question\` DROP FOREIGN KEY \`FK_aaa896ba08fd6661480ae987d5b\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_response\` DROP FOREIGN KEY \`FK_5bce56de4a23182aa31d331e022\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` DROP FOREIGN KEY \`FK_9f060e39b947257eaa086b6fed7\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` DROP FOREIGN KEY \`FK_2fd5f07567f19564f3aca2907c5\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz_response\` DROP FOREIGN KEY \`FK_34602e0c64d5c1cde8936a9e1ce\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz\` DROP FOREIGN KEY \`FK_5756f6a3fd2d9ab486b07ef0c66\``);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation_quiz\` DROP FOREIGN KEY \`FK_bf63c2cf6d2586d42bb36d1e938\``);
        await queryRunner.query(`DROP TABLE \`proccess_evaluation_question\``);
        await queryRunner.query(`DROP TABLE \`proccess_evaluation_response\``);
        await queryRunner.query(`DROP TABLE \`proccess_evaluation_quiz_response\``);
        await queryRunner.query(`DROP TABLE \`proccess_evaluation_quiz\``);
    }

}

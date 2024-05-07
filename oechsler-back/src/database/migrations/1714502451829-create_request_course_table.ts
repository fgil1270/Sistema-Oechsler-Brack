import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRequestCourseTable1714502451829 implements MigrationInterface {
    name = 'CreateRequestCourseTable1714502451829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`request_course_assignment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date_start\` timestamp NULL, \`date_end\` timestamp NULL, \`day\` set ('L', 'M', 'X', 'J', 'V', 'S', 'D') NOT NULL, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`requestCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`request_course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_name\` varchar(255) NOT NULL, \`training_reason\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`efficiency_period\` varchar(255) NULL, \`cost\` decimal(10,2) NOT NULL, \`currency\` set ('MXN', 'USD', 'EUR') NOT NULL DEFAULT 'MXN', \`type\` varchar(255) NULL, \`tentative_date_start\` timestamp NULL, \`tentative_date_end\` timestamp NULL, \`approved_at_leader\` timestamp NULL, \`canceled_at_leader\` timestamp NULL, \`approved_at_rh\` timestamp NULL, \`canceled_at_rh\` timestamp NULL, \`approved_at_gm\` timestamp NULL, \`canceled_at_gm\` timestamp NULL, \`status\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`courseId\` int NULL, \`departmentId\` int NULL, \`employeeId\` int NULL, \`competenceId\` int NULL, \`leaderId\` int NULL, \`rhId\` int NULL, \`gmId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD CONSTRAINT \`FK_ab21494bfb6811f7cae7651a782\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_e222fe21f65c95c92d7fdbe17fb\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_4265d5df9fefbd22626dbbdc7a7\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_291f1020f815bca49c489eecf8f\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_ef827f485f19d0c423d696cb8d7\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_28058ccf341d22d8cacb2af3624\` FOREIGN KEY (\`leaderId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_97dfe3be3490b52b4c592eb0e3c\` FOREIGN KEY (\`rhId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_dc6056a805840594b5604f659ee\` FOREIGN KEY (\`gmId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_dc6056a805840594b5604f659ee\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_97dfe3be3490b52b4c592eb0e3c\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_28058ccf341d22d8cacb2af3624\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_ef827f485f19d0c423d696cb8d7\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_291f1020f815bca49c489eecf8f\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_4265d5df9fefbd22626dbbdc7a7\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_e222fe21f65c95c92d7fdbe17fb\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP FOREIGN KEY \`FK_ab21494bfb6811f7cae7651a782\``);
        await queryRunner.query(`DROP TABLE \`request_course\``);
        await queryRunner.query(`DROP TABLE \`request_course_assignment\``);
    }

}

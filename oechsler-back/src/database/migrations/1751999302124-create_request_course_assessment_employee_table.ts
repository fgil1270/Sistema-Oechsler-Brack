import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRequestCourseAssessmentEmployeeTable1751999302124 implements MigrationInterface {
    name = 'CreateRequestCourseAssessmentEmployeeTable1751999302124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`request_course_assessment_employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_uno\` int NOT NULL, \`training_reason\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`requestCourseId\` int NULL, UNIQUE INDEX \`REL_00c0e2fb3081538c29b845d4a6\` (\`requestCourseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD CONSTRAINT \`FK_00c0e2fb3081538c29b845d4a64\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP FOREIGN KEY \`FK_00c0e2fb3081538c29b845d4a64\``);
        await queryRunner.query(`DROP INDEX \`REL_00c0e2fb3081538c29b845d4a6\` ON \`request_course_assessment_employee\``);
    }

}

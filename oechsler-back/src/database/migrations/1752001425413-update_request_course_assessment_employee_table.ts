import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseAssessmentEmployeeTable1752001425413 implements MigrationInterface {
    name = 'UpdateRequestCourseAssessmentEmployeeTable1752001425413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD \`employeeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD CONSTRAINT \`FK_d454ec8d5a4fe0706316277ffc3\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP FOREIGN KEY \`FK_d454ec8d5a4fe0706316277ffc3\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP COLUMN \`employeeId\``);
    }

}

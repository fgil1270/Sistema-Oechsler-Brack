import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseAssessmentEmployeeTable1751999572036 implements MigrationInterface {
    name = 'UpdateRequestCourseAssessmentEmployeeTable1751999572036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP COLUMN \`priority\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP COLUMN \`training_reason\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD \`value_dos\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD \`value_tres\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP COLUMN \`value_tres\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` DROP COLUMN \`value_dos\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD \`training_reason\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course_assessment_employee\` ADD \`priority\` varchar(255) NOT NULL`);
    }

}

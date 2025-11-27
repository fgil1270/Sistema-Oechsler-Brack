import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventIncidenceTable1764187244639 implements MigrationInterface {
    name = 'UpdateEventIncidenceTable1764187244639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_0a0939cadd0a5f1494da28c5f16\``);
        await queryRunner.query(`DROP INDEX \`IDX_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\``);
        await queryRunner.query(`DROP INDEX \`REL_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`eventRequestCourseId\``);
        await queryRunner.query(`ALTER TABLE \`event_request_course\` ADD \`sequence\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD \`eventRequestCourseId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD UNIQUE INDEX \`IDX_72706aa3a72925ba6bb0e1d6d0\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_72706aa3a72925ba6bb0e1d6d0\` ON \`request_course_assignment\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD CONSTRAINT \`FK_72706aa3a72925ba6bb0e1d6d04\` FOREIGN KEY (\`eventRequestCourseId\`) REFERENCES \`event_request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP FOREIGN KEY \`FK_72706aa3a72925ba6bb0e1d6d04\``);
        await queryRunner.query(`DROP INDEX \`REL_72706aa3a72925ba6bb0e1d6d0\` ON \`request_course_assignment\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP INDEX \`IDX_72706aa3a72925ba6bb0e1d6d0\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP COLUMN \`eventRequestCourseId\``);
        await queryRunner.query(`ALTER TABLE \`event_request_course\` DROP COLUMN \`sequence\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`eventRequestCourseId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_0a0939cadd0a5f1494da28c5f16\` FOREIGN KEY (\`eventRequestCourseId\`) REFERENCES \`event_request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

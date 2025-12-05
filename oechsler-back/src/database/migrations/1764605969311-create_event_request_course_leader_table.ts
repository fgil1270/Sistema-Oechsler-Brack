import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventRequestCourseLeaderTable1764605969311 implements MigrationInterface {
    name = 'CreateEventRequestCourseLeaderTable1764605969311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_request_course_leader\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`sequence\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD \`eventRequestCourseLeaderId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD UNIQUE INDEX \`IDX_2a0d8124b1ae18435ade100ac7\` (\`eventRequestCourseLeaderId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_2a0d8124b1ae18435ade100ac7\` ON \`request_course_assignment\` (\`eventRequestCourseLeaderId\`)`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD CONSTRAINT \`FK_2a0d8124b1ae18435ade100ac7c\` FOREIGN KEY (\`eventRequestCourseLeaderId\`) REFERENCES \`event_request_course_leader\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP FOREIGN KEY \`FK_2a0d8124b1ae18435ade100ac7c\``);
        await queryRunner.query(`DROP INDEX \`REL_2a0d8124b1ae18435ade100ac7\` ON \`request_course_assignment\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP INDEX \`IDX_2a0d8124b1ae18435ade100ac7\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP COLUMN \`eventRequestCourseLeaderId\``);
        await queryRunner.query(`DROP TABLE \`event_request_course_leader\``);
    }

}

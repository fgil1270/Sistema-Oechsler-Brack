import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRequestCourseDocumentTable1749836033643 implements MigrationInterface {
    name = 'CreateRequestCourseDocumentTable1749836033643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`request_course_document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`route\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`requestCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course_document\` ADD CONSTRAINT \`FK_1ebb01b1440ba29fe80682afc21\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_document\` DROP FOREIGN KEY \`FK_1ebb01b1440ba29fe80682afc21\``);
        await queryRunner.query(`DROP TABLE \`request_course_document\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventIncidenceTable1764094717945 implements MigrationInterface {
    name = 'CreateEventIncidenceTable1764094717945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_request_course\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event_incidence\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`eventRequestCourseId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD UNIQUE INDEX \`IDX_0a0939cadd0a5f1494da28c5f1\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`eventIncidenceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD UNIQUE INDEX \`IDX_0d40ab0d991ab0bb20c1479e3c\` (\`eventIncidenceId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\` (\`eventRequestCourseId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0d40ab0d991ab0bb20c1479e3c\` ON \`employee_incidence\` (\`eventIncidenceId\`)`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_0a0939cadd0a5f1494da28c5f16\` FOREIGN KEY (\`eventRequestCourseId\`) REFERENCES \`event_request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_0d40ab0d991ab0bb20c1479e3c7\` FOREIGN KEY (\`eventIncidenceId\`) REFERENCES \`event_incidence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_0d40ab0d991ab0bb20c1479e3c7\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_0a0939cadd0a5f1494da28c5f16\``);
        await queryRunner.query(`DROP INDEX \`REL_0d40ab0d991ab0bb20c1479e3c\` ON \`employee_incidence\``);
        await queryRunner.query(`DROP INDEX \`REL_0a0939cadd0a5f1494da28c5f1\` ON \`request_course\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP INDEX \`IDX_0d40ab0d991ab0bb20c1479e3c\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`eventIncidenceId\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP INDEX \`IDX_0a0939cadd0a5f1494da28c5f1\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`eventRequestCourseId\``);
        await queryRunner.query(`DROP TABLE \`event_incidence\``);
        await queryRunner.query(`DROP TABLE \`event_request_course\``);
    }

}

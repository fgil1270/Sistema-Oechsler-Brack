import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobReportHimTable1772213540543 implements MigrationInterface {
    name = 'CreateJobReportHimTable1772213540543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_report_him\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobId\` int NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_report_him\` ADD CONSTRAINT \`FK_5841273419ce5e53040d5e5e43c\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_report_him\` ADD CONSTRAINT \`FK_7ccd0028b3a3037b5fa7b8f90fa\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_report_him\` DROP FOREIGN KEY \`FK_7ccd0028b3a3037b5fa7b8f90fa\``);
        await queryRunner.query(`ALTER TABLE \`job_report_him\` DROP FOREIGN KEY \`FK_5841273419ce5e53040d5e5e43c\``);
        await queryRunner.query(`DROP TABLE \`job_report_him\``);
    }

}

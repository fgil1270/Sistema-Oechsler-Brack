import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobHelpTable1772216305734 implements MigrationInterface {
    name = 'CreateJobHelpTable1772216305734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_help\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobId\` int NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_help\` ADD CONSTRAINT \`FK_15ec676f4d40bad349e387c26c6\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_help\` ADD CONSTRAINT \`FK_b21f7555735dd9fc0aab695dfa9\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_help\` DROP FOREIGN KEY \`FK_b21f7555735dd9fc0aab695dfa9\``);
        await queryRunner.query(`ALTER TABLE \`job_help\` DROP FOREIGN KEY \`FK_15ec676f4d40bad349e387c26c6\``);
        await queryRunner.query(`DROP TABLE \`job_help\``);
    }

}

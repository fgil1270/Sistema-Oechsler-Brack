import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobDocumentTable1726243358446 implements MigrationInterface {
    name = 'CreateJobDocumentTable1726243358446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`route\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_document\` ADD CONSTRAINT \`FK_4283bf08497c3eeaf2e4e117333\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_document\` DROP FOREIGN KEY \`FK_4283bf08497c3eeaf2e4e117333\``);
        await queryRunner.query(`DROP TABLE \`job_document\``);
    }

}

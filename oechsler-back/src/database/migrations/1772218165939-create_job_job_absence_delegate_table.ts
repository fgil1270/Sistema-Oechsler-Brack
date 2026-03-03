import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobJobAbsenceDelegateTable1772218165939 implements MigrationInterface {
    name = 'CreateJobJobAbsenceDelegateTable1772218165939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_absence_delegate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobDescriptionId\` int NULL, \`jobId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_absence_delegate\` ADD CONSTRAINT \`FK_3f8bc4daec5b80949a962005500\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_absence_delegate\` ADD CONSTRAINT \`FK_a708e4545fdc4144b3b3cf60838\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_absence_delegate\` DROP FOREIGN KEY \`FK_a708e4545fdc4144b3b3cf60838\``);
        await queryRunner.query(`ALTER TABLE \`job_absence_delegate\` DROP FOREIGN KEY \`FK_3f8bc4daec5b80949a962005500\``);
        await queryRunner.query(`DROP TABLE \`job_absence_delegate\``);
    }

}

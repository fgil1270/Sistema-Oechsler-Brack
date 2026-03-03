import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobDescriptionTable1772143231153 implements MigrationInterface {
    name = 'CreateJobDescriptionTable1772143231153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_description\` (\`id\` int NOT NULL AUTO_INCREMENT, \`area\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`type_job\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`lead_authorized_at\` datetime NULL, \`manager_authorized_at\` datetime NULL, \`rh_authorized_at\` datetime NULL, \`authorizeLeaderId\` int NULL, \`authorizeManagerId\` int NULL, \`authorizeRhId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`jobDescriptionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD UNIQUE INDEX \`IDX_cd8334a510572fc39859ed1e0a\` (\`jobDescriptionId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_cd8334a510572fc39859ed1e0a\` ON \`job\` (\`jobDescriptionId\`)`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_a2fe10c111f349f1297da0f8255\` FOREIGN KEY (\`authorizeLeaderId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_884f6fae9a6eccb0fef0a9770e2\` FOREIGN KEY (\`authorizeManagerId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_80018a07efbb59255cfc5abe6b3\` FOREIGN KEY (\`authorizeRhId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job\` ADD CONSTRAINT \`FK_cd8334a510572fc39859ed1e0aa\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP FOREIGN KEY \`FK_cd8334a510572fc39859ed1e0aa\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_80018a07efbb59255cfc5abe6b3\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_884f6fae9a6eccb0fef0a9770e2\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_a2fe10c111f349f1297da0f8255\``);
        await queryRunner.query(`DROP INDEX \`REL_cd8334a510572fc39859ed1e0a\` ON \`job\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP INDEX \`IDX_cd8334a510572fc39859ed1e0a\``);
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`jobDescriptionId\``);
        await queryRunner.query(`DROP TABLE \`job_description\``);
    }

}

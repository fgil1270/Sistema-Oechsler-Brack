import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobDescriptionTable1772211014755 implements MigrationInterface {
    name = 'CreateJobDescriptionTable1772211014755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_cd8334a510572fc39859ed1e0a\` ON \`job\``);
        await queryRunner.query(`CREATE TABLE \`job_activity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`activity\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_activity\` ADD CONSTRAINT \`FK_7abe650c2fb8562f2b4349315be\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_activity\` DROP FOREIGN KEY \`FK_7abe650c2fb8562f2b4349315be\``);
        await queryRunner.query(`DROP TABLE \`job_activity\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cd8334a510572fc39859ed1e0a\` ON \`job\` (\`jobDescriptionId\`)`);
    }

}

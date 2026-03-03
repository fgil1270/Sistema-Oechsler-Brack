import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobAreaExperienceTable1772226276017 implements MigrationInterface {
    name = 'CreateJobAreaExperienceTable1772226276017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_area_experience\` (\`id\` int NOT NULL AUTO_INCREMENT, \`area\` varchar(255) NOT NULL, \`experience\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` ADD CONSTRAINT \`FK_3c1e56d9c2ec158e037d75ba8bb\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_area_experience\` DROP FOREIGN KEY \`FK_3c1e56d9c2ec158e037d75ba8bb\``);
        await queryRunner.query(`DROP TABLE \`job_area_experience\``);
    }

}

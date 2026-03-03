import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobDegreeTable1772225543111 implements MigrationInterface {
    name = 'CreateJobDegreeTable1772225543111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_degree\` (\`id\` int NOT NULL AUTO_INCREMENT, \`degree\` varchar(255) NOT NULL, \`dominio\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_degree\` ADD CONSTRAINT \`FK_0c04fe54aec709bd7fd7c1a59ff\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_degree\` DROP FOREIGN KEY \`FK_0c04fe54aec709bd7fd7c1a59ff\``);
        await queryRunner.query(`DROP TABLE \`job_degree\``);
    }

}

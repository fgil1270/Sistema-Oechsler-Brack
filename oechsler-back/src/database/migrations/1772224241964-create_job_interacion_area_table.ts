import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobInteracionAreaTable1772224241964 implements MigrationInterface {
    name = 'CreateJobInteracionAreaTable1772224241964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job_interaction_area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`jobDescriptionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`job_interaction_area\` ADD CONSTRAINT \`FK_91017c49047aff6185f63b2806e\` FOREIGN KEY (\`jobDescriptionId\`) REFERENCES \`job_description\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_interaction_area\` DROP FOREIGN KEY \`FK_91017c49047aff6185f63b2806e\``);
        await queryRunner.query(`DROP TABLE \`job_interaction_area\``);
    }

}

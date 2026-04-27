import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProccessEvaluationTable1777316656920 implements MigrationInterface {
    name = 'CreateProccessEvaluationTable1777316656920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`proccess_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`review\` int NOT NULL DEFAULT '0', \`limit_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation\` ADD CONSTRAINT \`FK_1ac9a43423dc4046d4b254f1694\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`proccess_evaluation\` DROP FOREIGN KEY \`FK_1ac9a43423dc4046d4b254f1694\``);
        await queryRunner.query(`DROP TABLE \`proccess_evaluation\``);
    }

}

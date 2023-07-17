import { MigrationInterface, QueryRunner } from "typeorm";

export class Job1689630130246 implements MigrationInterface {
    name = 'Job1689630130246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`job\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cv_code\` varchar(255) NOT NULL, \`cv_name\` varchar(255) NOT NULL, \`shift_leader\` tinyint NOT NULL DEFAULT 0, \`plc\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`job\``);
    }

}

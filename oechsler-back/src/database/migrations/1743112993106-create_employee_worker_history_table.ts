import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeWorkerHistoryTable1743112993106 implements MigrationInterface {
    name = 'CreateEmployeeWorkerHistoryTable1743112993106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_worker_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`worker\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_worker_history\` ADD CONSTRAINT \`FK_a6a2fb334b5745e0149e7023390\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_worker_history\` DROP FOREIGN KEY \`FK_a6a2fb334b5745e0149e7023390\``);
        await queryRunner.query(`DROP TABLE \`employee_worker_history\``);
    }

}

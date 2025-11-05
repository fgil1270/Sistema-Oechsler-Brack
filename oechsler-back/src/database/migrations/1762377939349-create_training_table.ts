import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrainingTable1762377939349 implements MigrationInterface {
    name = 'CreateTrainingTable1762377939349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`training\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_date\` datetime NOT NULL, \`end_date\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`training_machine_id\` int NULL, \`employee_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`training\` ADD CONSTRAINT \`FK_d2419913355b7816c1e3434e1ff\` FOREIGN KEY (\`training_machine_id\`) REFERENCES \`training_machine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training\` ADD CONSTRAINT \`FK_10cc0c9023955df3055a1d57c33\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training\` DROP FOREIGN KEY \`FK_10cc0c9023955df3055a1d57c33\``);
        await queryRunner.query(`ALTER TABLE \`training\` DROP FOREIGN KEY \`FK_d2419913355b7816c1e3434e1ff\``);
        await queryRunner.query(`DROP TABLE \`training\``);
    }

}

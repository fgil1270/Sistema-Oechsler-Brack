import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLogAdjustmentVacation1702907756531 implements MigrationInterface {
    name = 'CreateLogAdjustmentVacation1702907756531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`log_adjustment_vacation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`before_value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`new_value\` decimal(10,2) NOT NULL DEFAULT '0.00', \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`leaderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`log_adjustment_vacation\` ADD CONSTRAINT \`FK_e0169fa3b80c3c2b955b71d67a8\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`log_adjustment_vacation\` ADD CONSTRAINT \`FK_1334e6a017f4224b2c094288b40\` FOREIGN KEY (\`leaderId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`log_adjustment_vacation\` DROP FOREIGN KEY \`FK_1334e6a017f4224b2c094288b40\``);
        await queryRunner.query(`ALTER TABLE \`log_adjustment_vacation\` DROP FOREIGN KEY \`FK_e0169fa3b80c3c2b955b71d67a8\``);
        await queryRunner.query(`DROP TABLE \`log_adjustment_vacation\``);
    }

}
